import React, { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/product.json';
import '../assets/Useprofile.css';
import { CartContext } from "../context/CartContext"; 


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
      iscardcontopen: false
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

  togllecard = (a, index) => {
    this.setState((prevState) => ({
        iscardcontopen: !prevState.iscardcontopen
    }));
  }

  fetchUserData = () => {
    const { username } = this.props.params; 
    
    const filtered = products.filter(p => p.vendupa.toLowerCase() === username.toLowerCase());

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

  render() {
    const { userProducts, userInfo } = this.state;
    const { addToCart } = this.context;

    if (!userInfo) return <div className="loading">Utilisateur non trouvé...</div>;

    return (
      <div className="profile-container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> &gt; <span>Vendeurs</span> &gt; <span>{userInfo.name}</span>
          </div>
          {this.state.iscardcontopen && (
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
                                <button className="btnferm" onClick={() => {this.togllecard(null, undefined)}}>Fermer</button>
                            </div>
                        </div>
                    </div>
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
                  <button className="btn-share">Partager le profil</button>
                </div>
                
                <div className="user-stats">
                  <div className="stat-box">
                    <span className="stat-number">{userProducts.length}</span>
                    <span className="stat-label">Produits en vente</span>
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
            <h3>Ses Produits en vente ({userProducts.length})</h3>
            
            <div className="products-grid">
              {userProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="card-image-container">
                    <span className={`badge ${product.status.toLowerCase() === 'disponible' ? 'badge-green' : 'badge-gray'}`}>
                      {product.status.toUpperCase()}
                    </span>
                    <img src={product.image} alt={product.name} />
                  </div>
                  
                  <div className="card-info">
                    <h4>{product.name}</h4>
                    <div className="stars">
                      {'⭐'.repeat(Math.min(product.stars, 5))}
                    </div>
                    <div className="price">{product.prix} DH</div>
                  </div>

                  <div className="card-actions">
                    <Link to={`/product/${product.id}`} className="btn-details">
                      Détails
                    </Link>
                    <button className="btn-add" onClick={() => {addToCart(product)}}>Ajouter</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    );
  }
}

export default withRouter(UserProfile);