import { Component } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, CheckCircle2, Star, Check, Heart, Store } from "lucide-react";
import boutiquesData from "../data/Boutiques.json";
import { CartContext } from "../context/CartContext";
import "./Boutiquedetail.css";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { X } from "lucide-react";

class Boutiquedetail extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      favorites: JSON.parse(sessionStorage.getItem("favoris_boutique")) || [],
      addedId: null,
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

  handleAddCart = (product) => {
    const { addToCart } = this.context || {};
    if (addToCart) {
      addToCart(product);
      this.setState({ addedId: product.id });
      setTimeout(() => this.setState({ addedId: null }), 1200);
    }
  };

  render() {
    const { favorites, addedId } = this.state;

    const sessionBoutiques =
      JSON.parse(sessionStorage.getItem("mes_boutiques")) || [];
    const boutiquesMap = new Map();

    boutiquesData.forEach((b) => boutiquesMap.set(String(b.id), b));

    if (Array.isArray(sessionBoutiques)) {
      sessionBoutiques.forEach((b) => {
        const existing = boutiquesMap.get(String(b.id)) || {};
        boutiquesMap.set(String(b.id), { ...existing, ...b });
      });
    }

    const allBoutiques = Array.from(boutiquesMap.values());

    const { id } = this.props;
    const currentBoutique =
      allBoutiques.find((b) => String(b.id) === String(id)) || {};

    const rawTel = String(
      currentBoutique.telephone || currentBoutique.prix || ""
    ).trim();
    const formattedTel = rawTel
      ? rawTel.startsWith("0")
        ? rawTel
        : `0${rawTel}`
      : "";

    const {
      nomBoutique = currentBoutique.nom || "Boutique introuvable",
      logoText = currentBoutique.logoText || "BT",
      isOpen = currentBoutique.status === "Ouverte",
      certifie = currentBoutique.certifie ?? false,
      boutiquesDatas = currentBoutique.products || [],
      totalProduits = Array.isArray(currentBoutique.products)
        ? currentBoutique.products.length
        : currentBoutique.produitsCount ?? 0,
      stars = currentBoutique.stars ?? 0,
      avis = currentBoutique.avis ?? 0,
      email = currentBoutique.email,
      ville = currentBoutique.ville,
      ventesMois = 84,
      avisPositifs = "98%",
      coverImage = currentBoutique.cover ||
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
    } = this.props;

    const validStars = Math.min(5, Math.max(0, Number(stars) || 0));

    return (
      <div className="pb-container">
        <div className="pb-header-title">
          <span className="pb-vertical-bar"></span>
          <h2>Profil de la Boutique</h2>
        </div>

        <div
          className="pb-banner"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
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

            <div className="product-rating" style={{ marginTop: "8px" }}>
              {"⭐".repeat(validStars)}
              {"☆".repeat(5 - validStars)}
              <span className="reviews-count">
                {" "}
                {validStars} ({avis})
              </span>
            </div>

            {formattedTel && (
              <div
                className="pb-stat-card"
                style={{ marginTop: "10px", width: "100%" }}
              >
                <a
                  href={`tel:${formattedTel}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                    color: "#0f172a",
                    fontWeight: "500",
                  }}
                >
                  <BsFillTelephoneFill color="#16a34a" /> {formattedTel}
                </a>
              </div>
            )}

            {email && (
              <div
                className="pb-stat-card"
                style={{ marginTop: "10px", width: "100%" }}
              >
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                    color: "#0f172a",
                    fontWeight: "500",
                    wordBreak: "break-all",
                  }}
                >
                  <MdEmail color="#2563eb" size={18} /> {email}
                </a>
              </div>
            )}

            <p
              className="pb-stat-card"
              style={{
                marginTop: "10px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CiLocationOn size={20} color="#dc2626" /> {ville || ""}
            </p>

            <p
              className="pb-stat-card"
              style={{ marginTop: "10px", width: "100%" }}
            >
              Catégorie :{" "}
              <strong>{currentBoutique.categorie || "Non spécifiée"}</strong>
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <div className="pb-stats-grid">
              <div className="pb-stat-card">
                <Package size={24} className="pb-icon-blue" strokeWidth={1.8} />
                <div className="pb-stat-info">
                  <span className="pb-stat-label">Total Produits:</span>
                  <strong className="pb-stat-value">{totalProduits}</strong>
                </div>
              </div>

              <div className="pb-stat-card">
                <CheckCircle2
                  size={24}
                  className="pb-icon-green"
                  strokeWidth={1.8}
                />
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
              <h3
                style={{
                  marginBottom: "16px",
                  fontSize: "19px",
                  fontWeight: "700",
                }}
              >
                Produits de la Boutique ({boutiquesDatas.length})
              </h3>

              {boutiquesDatas.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(230px, 1fr))",
                    gap: "18px",
                  }}
                >
                  {boutiquesDatas.map((p, index) => {
                    const prodStars = Math.min(
                      5,
                      Math.max(0, Number(p.stars) || 0)
                    );
                    const isFav = favorites.includes(p.id);
                    const canBuy = p.status === "disponible" && isOpen;

                    return (
                      <div
                        className="boutique-card"
                        key={p.id || index}
                        style={{
                          padding: "14px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            height: "165px",
                            background: "#f8fafc",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "10px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => this.toggleFavorite(p.id)}
                            title="Ajouter aux favoris"
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              background: "#fff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Heart
                              size={16}
                              color={isFav ? "#ef4444" : "#64748b"}
                              fill={isFav ? "#ef4444" : "none"}
                            />
                          </button>
                        </div>

                        <div
                          className="boutique-body"
                          style={{ padding: "4px 0" }}
                        >
                          <span
                            className={`boutique-badge ${
                              p.status === "disponible"
                                ? "badge-ouverte"
                                : "badge-fermee"
                            }`}
                          >
                            {p.status}
                          </span>

                          <h3
                            className="boutique-title"
                            style={{ fontSize: "16px", margin: "6px 0" }}
                          >
                            {p.name}
                          </h3>

                          <div className="boutique-rating">
                            <span className="stars" style={{ color: "#f59e0b" }}>
                              {"★".repeat(prodStars)}
                              {"☆".repeat(5 - prodStars)}
                            </span>
                            <span className="avis-count">
                              ({p.countst || 0})
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: "800",
                              color: "#dc2626",
                              margin: "6px 0 10px",
                            }}
                          >
                            {p.prix} DH
                          </div>

                          <div
                            className="boutique-actions"
                            style={{ display: "flex", gap: "8px" }}
                          >
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
                                background: canBuy
                                  ? addedId === p.id
                                    ? "#16a34a"
                                    : "#0284c7"
                                  : "#94a3b8",
                                cursor: canBuy ? "pointer" : "not-allowed",
                              }}
                            >
                              {addedId === p.id
                                ? "Ajouté ✓"
                                : "Ajouter au panier"}
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

                        <div
                          className="boutique-footer"
                          style={{
                            marginTop: "12px",
                            paddingTop: "8px",
                            borderTop: "1px solid #f1f5f9",
                            fontSize: "12px",
                            color: "#64748b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <Store size={14} />
                          <span>
                            Vendu par : <strong>{p.vendupa}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="boutiques-empty"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "28px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
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