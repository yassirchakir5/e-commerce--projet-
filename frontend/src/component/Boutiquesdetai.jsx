import { Component } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, CheckCircle2, Star, Check, Heart, Store, X, User } from "lucide-react";
import { CartContext } from "../context/CartContext";
import "./Boutiquedetail.css";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import api from "../api/api";

class Boutiquedetail extends Component {
  static contextType = CartContext;
  constructor(props) {
    super(props);
    this.state = {
      favorites: JSON.parse(sessionStorage.getItem("favoris_boutique")) || [],
      addedId: null,
      boutique: null,
      boutiqueProduits: [],
      loading: true,
      hoverRating: 0,
      ratingMessage: "",
      submittingRating: false,
    };
  }

  toggleFavorite = (productId) => {
    this.setState((prevState) => {
      const exists = prevState.favorites.includes(productId);
      const updated = exists
        ? prevState.favorites.filter((id) => id !== productId)
        : [...prevState.favorites, productId];

      sessionStorage.setItem("favoris_boutique", JSON.stringify(updated));
      return { favorites: updated };
    });
  };

  componentDidMount() {
    this.handleboutiquecureent();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.handleboutiquecureent();
    }
  }

  handleboutiquecureent = async () => {
    const { id } = this.props;
    this.setState({ loading: true });

    try {
      const [resBoutique, resProduits] = await Promise.all([
        api.get(`/boutique/${id}`),
        api.get(`/boutique/produit/${id}`).catch(() => ({ data: { produit: [] } })),
      ]);

      const prods = resProduits.data.produit || resProduits.data.produits || [];

      this.setState({
        boutique: resBoutique.data.boutique || null,
        boutiqueProduits: Array.isArray(prods) ? prods : [],
        loading: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({ boutique: null, boutiqueProduits: [], loading: false });
    }
  };

  handleRateBoutique = async (note) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Veuillez vous connecter pour évaluer cette boutique.");
      return;
    }

    if (this.state.submittingRating) return;
    this.setState({ submittingRating: true });

    try {
      const { id } = this.props;
      const res = await api.post(
        `/boutique/${id}/noter`,
        { note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      this.setState((prevState) => ({
        boutique: {
          ...prevState.boutique,
          stars: res.data.stars,
          count_avis: res.data.count_avis,
        },
        ratingMessage: res.data.message || "Merci pour votre avis !",
        submittingRating: false,
      }));

      setTimeout(() => this.setState({ ratingMessage: "" }), 3000);
    } catch (err) {
      console.error("Erreur lors de l'évaluation :", err);
      alert("Erreur lors de l'enregistrement de votre évaluation.");
      this.setState({ submittingRating: false });
    }
  };

  handleAddCart = (product) => {
    const { addToCart } = this.context || {};
    if (addToCart) {
      addToCart(product);
      this.setState({ addedId: product.id });
      setTimeout(() => this.setState({ addedId: null }), 1200);
    }
  };

  render() {
    const {
      favorites,
      addedId,
      boutique,
      boutiqueProduits,
      loading,
      hoverRating,
      ratingMessage,
    } = this.state;

    if (loading) {
      return <div style={{ padding: "40px", textAlign: "center" }}>Chargement de la boutique...</div>;
    }

    const b = boutique || {};
    const nomBoutique = b.nom || "Boutique introuvable";
    const logoText = nomBoutique.slice(0, 2).toUpperCase() || "BT";
    const isOpen = String(b.status_boutique || b.status || "").toLowerCase() === "ouverte";
    const certifie = b.certifiée === true || String(b.certifiée).toLowerCase() === "true";

    const rawTel = String(b.numtel || b.telephone || "").trim();
    const formattedTel = rawTel ? (rawTel.startsWith("0") ? rawTel : `0${rawTel}`) : "";

    const stars = Number(b.stars ?? 0);
    const avis = b.count_avis ?? b.avis ?? 0;
    const email = b.email || "";
    const ville = b.ville || "";
    const categorie = b.categorie || "Non spécifiée";
    const coverImage = b.logo_boutique
      ? `http://127.0.0.1:8000/storage/${b.logo_boutique}`
      : "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80";
    const validStars = Math.min(5, Math.max(0, Math.round(stars)));
    const ventesMois = 84;
    const avisPositifs = "98%";

    return (
      <div className="pb-container">
        <div className="pb-header-title">
          <span className="pb-vertical-bar"></span>
          <h2>Profil de la Boutique</h2>
        </div>

        <div className="pb-banner" style={{ backgroundImage: `url(${coverImage})` }}>
          <div className="pb-banner-overlay">
            <h1 className="pb-banner-name">{nomBoutique}</h1>
          </div>
        </div>

        <div className="pb-bottom-section">
          <div className="pb-identity">
            <div className="pb-avatar">{logoText}</div>

            <div className="pb-title-row">
              <h3 className="pb-store-name">{nomBoutique}</h3>
              <span className={`pb-status-badge ${isOpen ? "open" : "closed"}`}>
                {isOpen ? "Ouverte" : "Fermée"}
              </span>
            </div>

            {certifie ? (
              <div className="pb-certified-badge">
                <span className="pb-certified-icon">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span>Vendeur Certifié</span>
              </div>
            ) : (
              <div className="pb-certified-badge">
                <span className="pb-certified-icon">
                  <X size={11} strokeWidth={3} />
                </span>
                <span>Vendeur Non Certifié</span>
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              <div
                className="product-rating"
                style={{ display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}
                onMouseLeave={() => this.setState({ hoverRating: 0 })}
                title="Cliquez sur une étoile pour évaluer"
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = hoverRating ? starValue <= hoverRating : starValue <= validStars;
                  return (
                    <span
                      key={starValue}
                      onMouseEnter={() => this.setState({ hoverRating: starValue })}
                      onClick={() => this.handleRateBoutique(starValue)}
                      style={{
                        fontSize: "20px",
                        color: isFilled ? "#f59e0b" : "#cbd5e1",
                        transition: "transform 0.15s ease, color 0.15s ease",
                        transform: hoverRating === starValue ? "scale(1.2)" : "scale(1)",
                        userSelect: "none",
                      }}
                    >
                      ★
                    </span>
                  );
                })}
                <span className="reviews-count" style={{ marginLeft: "6px", fontSize: "14px", color: "#475569" }}>
                  {stars} ({avis} avis)
                </span>
              </div>

              {ratingMessage && (
                <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600", marginTop: "4px" }}>
                  ✓ {ratingMessage}
                </div>
              )}
            </div>

            {formattedTel && (
              <div className="pb-stat-card" style={{ marginTop: "10px", width: "100%" }}>
                <a href={`tel:${formattedTel}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#0f172a", fontWeight: "500" }}>
                  <BsFillTelephoneFill color="#16a34a" /> {formattedTel}
                </a>
              </div>
            )}

            {email && (
              <div className="pb-stat-card" style={{ marginTop: "10px", width: "100%" }}>
                <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#0f172a", fontWeight: "500", wordBreak: "break-all" }}>
                  <MdEmail color="#2563eb" size={18} /> {email}
                </a>
              </div>
            )}

            <p className="pb-stat-card" style={{ marginTop: "10px", width: "100%", display: "flex", alignItems: "center", gap: "8px" }}>
              <CiLocationOn size={20} color="#dc2626" /> {ville}
            </p>

            <p className="pb-stat-card" style={{ marginTop: "10px", width: "100%" }}>
              Catégorie : <strong>{categorie}</strong>
            </p>

            {(() => {
              const utilisateur = b.vendeur?.utilisateur;
              const nomComplet = utilisateur
                ? `${utilisateur.name || ""} ${utilisateur.prenom || ""}`.trim()
                : null;

              return (
                nomComplet && (
                  <div className="pb-stat-card" style={{ marginTop: "10px", width: "100%" }}>
                    <Link
                      to={`/profile/${utilisateur.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        textDecoration: "none",
                        color: "#0f172a",
                        fontWeight: "600",
                      }}
                    >
                      <User color="#2563eb" size={18} />
                      <span>{nomComplet}</span>
                    </Link>
                  </div>
                )
              );
            })()}
          </div>

          <div style={{ flex: 1 }}>
            <div className="pb-stats-grid">
              <div className="pb-stat-card">
                <Package size={24} className="pb-icon-blue" strokeWidth={1.8} />
                <div className="pb-stat-info">
                  <span className="pb-stat-label">Total Produits:</span>
                  <strong className="pb-stat-value">{boutiqueProduits.length}</strong>
                </div>
              </div>

              <div className="pb-stat-card">
                <CheckCircle2 size={24} className="pb-icon-green" strokeWidth={1.8} />
                <div className="pb-stat-info">
                  <span className="pb-stat-label">Ventes Ce Mois:</span>
                  <strong className="pb-stat-value">{ventesMois}</strong>
                </div>
              </div>

              <div className="pb-stat-card">
                <Star size={24} className="pb-icon-gold" strokeWidth={1.8} />
                <div className="pb-stat-info">
                  <span className="pb-stat-label">Avis Positifs:</span>
                  <strong className="pb-stat-value">{avisPositifs}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "28px" }}>
              <h3 style={{ marginBottom: "16px", fontSize: "19px", fontWeight: "700" }}>
                Produits de la Boutique ({boutiqueProduits.length})
              </h3>

              {boutiqueProduits.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                    gap: "18px",
                  }}
                >
                  {boutiqueProduits.map((p, index) => {
                    const prodName = p.nom || p.name || "Produit";
                    const mainImg =
                      Array.isArray(p.images) && p.images.length > 0
                        ? `http://127.0.0.1:8000/storage/${p.images[0].path}`
                        : p.image;
                    const prodStars = Math.min(5, Math.max(0, Number(p.stars) || 0));
                    const isFav = favorites.includes(p.id);
                    const isDispo = String(p.status || "").toLowerCase() === "disponible";
                    const canBuy = isDispo && isOpen;

                    return (
                      <div
                        className="boutique-card pb-product-card"
                        key={p.id || index}
                        style={{
                          padding: "14px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          animationDelay: `${0.35 + index * 0.07}s`,
                        }}
                      >
                        <div style={{ position: "relative", height: "165px", background: "#f8fafc", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px", overflow: "hidden" }}>
                          <img src={mainImg} alt={prodName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          <button type="button" className="pb-fav-btn" onClick={() => this.toggleFavorite(p.id)} title="Ajouter aux favoris" style={{ position: "absolute", top: "8px", right: "8px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Heart size={16} color={isFav ? "#ef4444" : "#64748b"} fill={isFav ? "#ef4444" : "none"} />
                          </button>
                        </div>

                        <div className="boutique-body" style={{ padding: "4px 0" }}>
                          <span className={`boutique-badge ${isDispo ? "badge-ouverte" : "badge-fermee"}`}>
                            {p.status}
                          </span>

                          <h3 className="boutique-title" style={{ fontSize: "16px", margin: "6px 0" }}>
                            {prodName}
                          </h3>

                          <div className="boutique-rating">
                            <span className="stars" style={{ color: "#f59e0b" }}>
                              {"★".repeat(prodStars)}
                              {"☆".repeat(5 - prodStars)}
                            </span>
                            <span className="avis-count">({p.countst || 0})</span>
                          </div>

                          <div style={{ fontSize: "18px", fontWeight: "800", color: "#dc2626", margin: "6px 0 10px" }}>
                            {p.prix} DH
                          </div>

                          <div className="boutique-actions" style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              className="btn-visiter"
                              onClick={() => this.handleAddCart(p)}
                              disabled={!canBuy}
                              style={{
                                flex: 1,
                                border: "none",
                                borderRadius: "8px",
                                padding: "8px 10px",
                                fontWeight: "600",
                                fontSize: "13px",
                                color: "#ffffff",
                                background: canBuy ? (addedId === p.id ? "#16a34a" : "#0284c7") : "#94a3b8",
                                cursor: canBuy ? "pointer" : "not-allowed",
                              }}
                            >
                              {addedId === p.id ? "Ajouté ✓" : "Ajouter au panier"}
                            </button>

                            <Link
                              to={`/product/${p.id}`}
                              className="btn-details-boutique"
                              style={{
                                textDecoration: "none",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              Détails
                            </Link>
                          </div>
                        </div>

                        <div className="boutique-footer" style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #f1f5f9", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <Store size={14} />
                          <span>
                            Vendu par : <strong>{p.vendupa || nomBoutique}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="boutiques-empty" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "28px", textAlign: "center", color: "#64748b" }}>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>
                    Aucun produit disponible dans cette boutique.
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function BoutiquedetailWrapper(props) {
  const { id } = useParams();
  return <Boutiquedetail {...props} id={id} />;
}

export default BoutiquedetailWrapper;