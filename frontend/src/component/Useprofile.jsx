import { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/Useprofile.css';
import { CartContext } from "../context/CartContext";
import ShareProfileModal from './ShareProfile';
import { Package, MapPin, Phone, Clock, CheckCircle, X } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/api';

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
      userBoutiques: [],
      userInfo: null,
      loading: true,
      iscardcontopen: false,
      isshareop: false,
      selectedBoutique: null,
      contactForm: {
        email: '',
        nom: '',
        sujet: '',
        description: ''
      },
      sendingEmail: false
    };
  }

  componentDidMount() {
    this.fetchUserData();
  }

  componentDidUpdate(prevProps) {
    const currentId = this.props.params.id || this.props.params.username;
    const prevId = prevProps.params.id || prevProps.params.username;
    if (currentId !== prevId) {
      this.fetchUserData();
    }
  }

  togllecard = () => {
    this.setState((prevState) => ({
      iscardcontopen: !prevState.iscardcontopen
    }));
  };

  toggleShareModal = () => {
    this.setState((prevState) => ({
      isshareop: !prevState.isshareop
    }));
  };

  handleContactChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      contactForm: {
        ...prevState.contactForm,
        [name]: value
      }
    }));
  };

  handleContactSubmit = async (e) => {
    e.preventDefault();
    const { userInfo, contactForm } = this.state;
    if (!userInfo) return;

    this.setState({ sendingEmail: true });

    try {
      await api.post(`/contact-vendeur/${userInfo.id}`, contactForm);

      Swal.fire({
        icon: 'success',
        title: 'Message envoyé !',
        text: `Votre message a bien été envoyé à ${userInfo.name}.`,
        confirmButtonColor: '#2563eb'
      });

      this.setState({
        iscardcontopen: false,
        sendingEmail: false,
        contactForm: {
          email: '',
          nom: '',
          sujet: '',
          description: ''
        }
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      this.setState({ sendingEmail: false });
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || "Impossible d'envoyer le message pour le moment."
      });
    }
  };

  fetchUserData = async () => {
    const userId = this.props.params.id || this.props.params.username;
    this.setState({ loading: true });

    try {
      const res = await api.get(`/profile/${userId}`);
      const u = res.data.utilisateur;
      const stats = res.data.stats || {};

      if (u) {
        const nomComplet = `${u.name || ''} ${u.prenom || ''}`.trim();
        const avatarUrl = u.path_img_profile
          ? `http://127.0.0.1:8000/storage/${u.path_img_profile}`
          : null;

        const joinDate = u.created_at
          ? new Date(u.created_at).toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric'
            })
          : 'Non spécifié';

        const fullAddress = [u.addresselocal, u.province, u.pays]
          .filter(Boolean)
          .join(', ') || "Non spécifiée";

        const boutiques = u.vendeur?.boutiques || [];

        const vendeurStatus = String(u.vendeur?.status || '').toLowerCase().trim();
        const hasCertifiedBoutique = boutiques.some(
          (b) => b.certifiée === true || b.certifiée === 1 || String(b.certifiée || '').toLowerCase().trim() === 'true'
        );

        const isVendeurVerified = Boolean(
          u.vendeur && (
            ['accepté', 'accepte', 'validé', 'valide', 'certifié', 'certifie', 'verified', 'verifie', 'actif'].includes(vendeurStatus) ||
            hasCertifiedBoutique
          )
        );

        this.setState({
          userBoutiques: boutiques,
          userInfo: {
            id: u.id,
            name: nomComplet || "Utilisateur",
            avatar: avatarUrl,
            location: fullAddress,
            joinDate: joinDate,
            boutiquesCount: stats.boutiques_count ?? boutiques.length,
            responseRate: stats.taux_reponse ?? "100%",
            rating: stats.rating ?? 0,
            reviewsCount: stats.reviews_count ?? 0,
            isVendeurVerified: isVendeurVerified
          },
          loading: false
        });
      } else {
        this.setState({ userInfo: null, loading: false });
      }
    } catch (err) {
      console.error("Erreur lors du chargement du profil :", err);
      this.setState({ userInfo: null, loading: false });
    }
  };

  openDetails = (boutique) => {
    this.setState({ selectedBoutique: boutique });
  };

  closeDetails = () => {
    this.setState({ selectedBoutique: null });
  };

  render() {
    const {
      userBoutiques,
      selectedBoutique,
      userInfo,
      isshareop,
      iscardcontopen,
      loading,
      contactForm,
      sendingEmail
    } = this.state;

    if (loading) {
      return <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>Chargement du profil...</div>;
    }

    if (!userInfo) {
      return <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>Utilisateur non trouvé...</div>;
    }

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
                <form onSubmit={this.handleContactSubmit}>
                  <label htmlFor="email">Saisir votre Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={this.handleContactChange}
                    placeholder="Saisir votre email"
                    required
                  />

                  <label htmlFor="nom">Nom Complet</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={contactForm.nom}
                    onChange={this.handleContactChange}
                    placeholder="Nom Complet"
                    required
                  />

                  <label htmlFor="sub">Sujet</label>
                  <input
                    type="text"
                    id="sub"
                    name="sujet"
                    value={contactForm.sujet}
                    onChange={this.handleContactChange}
                    placeholder="Sujet"
                    required
                  />

                  <label htmlFor="desc">Description</label>
                  <textarea
                    name="description"
                    id="desc"
                    value={contactForm.description}
                    onChange={this.handleContactChange}
                    required
                  />

                  <button type="submit" className="btnmodif" disabled={sendingEmail}>
                    {sendingEmail ? 'Envoi en cours...' : 'Envoyer'}
                  </button>
                  <button type="button" className="btnferm" onClick={this.togllecard} disabled={sendingEmail}>
                    Fermer
                  </button>
                </form>
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
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className="avatar-fallback">{userInfo.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="user-details">
                <h2>
                  {userInfo.name}{' '}
                  {userInfo.isVendeurVerified && (
                    <span className="verified-badge">✔ Vendeur vérifié</span>
                  )}
                </h2>
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
                  <span className="stat-number">{userInfo.boutiquesCount}</span>
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
          <h3>Ses Boutiques ({userBoutiques.length})</h3>

          {userBoutiques.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>
              Ce vendeur n'a pas encore de boutiques.
            </p>
          ) : (
            <div className="boutiques-grid">
              {userBoutiques.map((b) => {
                const coverUrl = b.logo_boutique
                  ? `http://127.0.0.1:8000/storage/${b.logo_boutique}`
                  : "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80";
                const statusBoutique = b.status_boutique || b.status || "Fermée";
                const isOpen = String(statusBoutique).toLowerCase() === "ouverte";
                const certifie = b.certifiée === true || b.certifiée === 1 || String(b.certifiée).toLowerCase() === "true";
                const validStars = Math.min(5, Math.max(0, Number(b.stars) || 0));
                const produitsCount = Array.isArray(b.produits) ? b.produits.length : 0;

                return (
                  <div className="boutique-card" key={b.id}>
                    <div className="boutique-cover-wrapper">
                      <img
                        src={coverUrl}
                        alt={b.nom}
                        className="boutique-cover-img"
                      />
                    </div>

                    <div className="boutique-body">
                      {certifie && (
                        <span className="boutique-badge badge-certifie">
                          Vendeur Certifié
                        </span>
                      )}
                      <span
                        className={`boutique-badge ${
                          isOpen ? "badge-ouverte" : "badge-fermee"
                        }`}
                      >
                        {statusBoutique}
                      </span>

                      <h3 className="boutique-title">{b.nom}</h3>

                      <div className="boutique-rating">
                        <span className="stars">
                          {"★".repeat(validStars)}
                          {"☆".repeat(5 - validStars)}
                        </span>
                        <span className="avis-count">({b.count_avis || b.avis || 0})</span>
                      </div>

                      <p className="boutique-desc">{b.description || b.desc || ""}</p>

                      <div className="boutique-products-count">
                        <Package size={16} color="#b45309" />
                        <span>{produitsCount} Produits</span>
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
                      Géré par : <strong>{userInfo.name}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                <div className="modal-logo">
                  {(selectedBoutique.nom || "BT").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2>{selectedBoutique.nom}</h2>
                  <span className="modal-sub">
                    Géré par {userInfo.name}
                  </span>
                </div>
              </div>

              <p className="modal-desc">{selectedBoutique.description || selectedBoutique.desc || ""}</p>

              <ul className="modal-info-list">
                <li>
                  <MapPin size={18} color="#2563eb" />
                  <span>Ville : {selectedBoutique.ville || "Non spécifiée"}</span>
                </li>
                <li>
                  <Phone size={18} color="#16a34a" />
                  <span>Téléphone : {selectedBoutique.numtel || selectedBoutique.telephone || "Non spécifié"}</span>
                </li>
                <li>
                  <Clock size={18} color="#d97706" />
                  <span>Horaires : {selectedBoutique.horaire || "09:00 - 20:00"}</span>
                </li>
                <li>
                  <CheckCircle size={18} color="#0284c7" />
                  <span>
                    Catalogue : {Array.isArray(selectedBoutique.produits) ? selectedBoutique.produits.length : 0} produits disponibles
                  </span>
                </li>
              </ul>

              <div className="modal-footer-actions">
                <Link
                  to={`/boutique/${selectedBoutique.id}`}
                  className="btn-visiter"
                  onClick={this.closeDetails}
                >
                  Visiter la boutique
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