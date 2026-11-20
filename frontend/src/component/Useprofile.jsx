import { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/Boutiques.json';
import '../assets/Useprofile.css';
import { CartContext } from "../context/CartContext"; 
import ShareProfileModal from './ShareProfile'; 
import { Package } from 'lucide-react';
import { MapPin, Phone, Clock, CheckCircle, X } from 'lucide-react';

const withRouter = (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
};

class UserProfile extends Component {
    static contextType = CartContext;
  constructor(props) {
    super(props);
    this.state = {
      userProducts: [],
      userInfo: null,
      iscardcontopen: false,
      isshareop: false ,
      selectedBoutique: null
    };
  }

  componentDidMount() {
    this.fetchUserData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.username !== prevProps.params.username) {
      this.fetchUserData();
    }
  }

  togllecard = () => {
    this.setState((prevState) => ({
        iscardcontopen: !prevState.iscardcontopen
    }));
  }

  toggleShareModal = () => {
    this.setState((prevState) => ({
        isshareop: !prevState.isshareop
    }));
  }

  fetchUserData = () => {
    const { username } = this.props.params; 
    
    const filtered = products.filter(p => p.vendeur.toLowerCase() === username.toLowerCase());

    if (filtered.length > 0) {
      this.setState({
        userProducts: filtered,
        userInfo: {
          name: filtered[0].vendupa,
          avatar: "/images/avatar.jpg", 
          location: "Casablanca, Maroc",
          rating: 4.8,
          reviewsCount: 112,
          joinDate: "Novembre 2024",
          responseRate: "98%"
        }
      });
    }
  }
  openDetails = (boutique) => {
    this.setState({ selectedBoutique: boutique });
  };
  closeDetails = () => {
    this.setState({ selectedBoutique: null });
  };
  render() {
    const { userProducts, selectedBoutique, userInfo, isshareop, iscardcontopen } = this.state;

    if (!userInfo) return <div className="loading">Utilisateur non trouvé...</div>;

    return (
      <div className="profile-container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> &gt; <span>Vendeurs</span> &gt; <span>{userInfo.name}</span>
          </div>

          {iscardcontopen && (
            <div className="overlay">
                <div className="card">
                    <div className="carsHeader">
                        <h2 style={{ margin: 0, fontStyle: 'italic', color: '#333' }}>✉ Contacter le vendeur</h2>
                    </div>

                    <div className="cardBody">
                        <form>
                          <label htmlFor='email'>Saisir votre Email</label>
                          <input type="email" id='email' placeholder='Saisir votre email' />
                          <label htmlFor='nom'>Nom Complet</label>
                          <input type="text" id='nom' placeholder='Nom Complet' />
                          <label htmlFor='sub'>Subjectif</label>
                          <input type="text" id='sub' placeholder='Subjectif' />
                          <label htmlFor='desc'>Description</label>
                          <textarea name="description" id="desc"/>
                        </form>
                        <button className="btnmodif">Envoyer</button> 
                        <button className="btnferm" onClick={this.togllecard}>Fermer</button>
                    </div>
                </div>
            </div>
          )}

          {isshareop && (
             <ShareProfileModal 
                onClose={this.toggleShareModal} 
                vendorName={userInfo.name} 
             />
          )}

          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-section">
                <div className="avatar-circle">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt={userInfo.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                  ) : (
                    <span className="avatar-fallback">{userInfo.name.charAt(0)}</span>
                  )}
                </div>
                <div className="user-details">
                  <h2>{userInfo.name} <span className="verified-badge">✔ Vendeur vérifié</span></h2>
                  <div className="user-rating">
                    ⭐ {userInfo.rating} <span className="reviews">({userInfo.reviewsCount} avis)</span>
                  </div>
                  <p className="meta-info">Membre depuis : {userInfo.joinDate}</p>
                  <p className="meta-info">📍 {userInfo.location}</p>
                </div>
              </div>

              <div className="profile-actions-right">
                <div className="action-buttons">
                  <button className="btn-contact" onClick={this.togllecard}>✉ Contacter le vendeur</button>
                  <button className="btn-share" onClick={this.toggleShareModal}>Partager le profil</button>
                </div>
                
                <div className="user-stats">
                  <div className="stat-box">
                    <span className="stat-number">{userProducts.length}</span>
                    <span className="stat-label">Boutiques</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">{userInfo.responseRate}</span>
                    <span className="stat-label">Taux de réponse</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">{userInfo.rating}</span>
                    <span className="stat-label">Évaluation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="user-products-section">
            <h3>Ses Boutiques({userProducts.length})</h3>
            
            <div className="boutiques-grid">
          {userProducts.map((b) => (
            <div className="boutique-card" key={b.id}>
              <div className="boutique-cover-wrapper">
                <img
                  src={b.cover}
                  alt={b.nom}
                  className="boutique-cover-img"
                />
              </div>

              <div className="boutique-body">
                {b.certifie ? (
                  <span className="boutique-badge badge-certifie">
                    Vendeur Certifié
                  </span>
                ) : ''}
                  <span
                    className={`boutique-badge ${
                      b.status === "Ouverte" ? "badge-ouverte" : "badge-fermee"
                    }`}
                  >
                    {b.status}
                  </span>
                <h3 className="boutique-title">{b.nom}</h3>

                <div className="boutique-rating">
                  <span className="stars">
                    {"★".repeat(b.stars)}
                    {"☆".repeat(5 - b.stars)}
                  </span>
                  <span className="avis-count">({b.avis})</span>
                </div>

                <p className="boutique-desc">{b.description}</p>

                <div className="boutique-products-count">
                  <Package size={16} color="#b45309" />
                  <span>{b.products.length} Produits</span>
                </div>

                <div className="boutique-actions">
                  <Link to={`/boutique/${b.id}`} className="btn-visiter">
                    Visiter la boutique
                  </Link>
                  <button
                    type="button"
                    className="btn-details-boutique"
                    onClick={() => this.openDetails(b)}
                  >
                    Détails
                  </button>
                </div>
              </div>

              <div className="boutique-footer">
                Géré par : <strong>{b.vendeur}</strong>
              </div>
            </div>
          ))}
        </div>
          </div>
          {selectedBoutique && (
          <div className="boutique-modal-overlay" onClick={this.closeDetails}>
            <div
              className="boutique-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={this.closeDetails}
              >
                <X size={20} />
              </button>

              <div className="modal-header-info">
                <div className="modal-logo">{selectedBoutique.logoText}</div>
                <div>
                  <h2>{selectedBoutique.nom}</h2>
                  <span className="modal-sub">
                    Géré par {selectedBoutique.vendeur}
                  </span>
                </div>
              </div>

              <p className="modal-desc">{selectedBoutique.description}</p>

              <ul className="modal-info-list">
                <li>
                  <MapPin size={18} color="#2563eb" />
                  <span>Ville : {selectedBoutique.ville}</span>
                </li>
                <li>
                  <Phone size={18} color="#16a34a" />
                  <span>Téléphone : {selectedBoutique.telephone}</span>
                </li>
                <li>
                  <Clock size={18} color="#d97706" />
                  <span>Horaires : {selectedBoutique.horaires}</span>
                </li>
                <li>
                  <CheckCircle size={18} color="#0284c7" />
                  <span>
                    Catalogue : {selectedBoutique.produitsCount} produits
                    disponibles
                  </span>
                </li>
              </ul>

              <div className="modal-footer-actions">
                <Link
                  to="/shop"
                  className="btn-visiter"
                  onClick={this.closeDetails}
                >
                  Voir tous les produits
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(UserProfile);