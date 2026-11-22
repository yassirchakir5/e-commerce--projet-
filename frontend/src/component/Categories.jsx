import { Component } from "react";
import { Link } from "react-router-dom";
import { Store, ShieldCheck, Truck, CreditCard, Sparkles, ArrowRight } from "lucide-react";
import "../assets/categorie.css"

class Categories extends Component {
  render() {
    const isConnected = localStorage.getItem("login") === "true";

    return (
      <div className="hero-banner-wrapper">
        <div className="hero-banner-box">
          <div className="hero-left-content">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.12)",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#7dd3fc",
                marginBottom: "16px",
              }}
            >
              <Sparkles size={15} />
              <span>Marketplace Multi-Vendeurs au Maroc</span>
            </div>

            <h1
              style={{
                margin: "0 0 14px",
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: "800",
                lineHeight: "1.2",
              }}
            >
              Découvrez les meilleures offres de nos{" "}
              <span style={{ color: "#38bdf8" }}>boutiques certifiées</span>
            </h1>

            <p
              style={{
                margin: "0 0 26px",
                fontSize: "15px",
                color: "#cbd5e1",
                lineHeight: "1.6",
                maxWidth: "560px",
              }}
            >
              Achetez en toute confiance auprès de vendeurs vérifiés ou lancez votre propre
              boutique en ligne en quelques minutes.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
              <Link to="/shop" className="hero-btn-primary">
                <Store size={18} />
                Explorer les boutiques
                <ArrowRight size={17} className="arrow-icon" />
              </Link>

              <Link
                to={isConnected ? "/boutiques" : "/inscrit"}
                className="hero-btn-secondary"
              >
                {isConnected ? "Gérer mes boutiques" : "Devenir vendeur"}
              </Link>
            </div>
          </div>

          <div className="hero-right-card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck size={22} color="#ffffff" />
              </div>
              <div>
                <strong style={{ display: "block", fontSize: "15px" }}>100% Sécurisé</strong>
                <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                  Vendeurs contrôlés & vérifiés
                </span>
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.12)" }} />

            <p style={{ margin: 0, fontSize: "13px", color: "#e2e8f0", lineHeight: "1.5" }}>
              Comparez les prix, consultez les avis clients et commandez directement depuis nos
              boutiques partenaires.
            </p>
          </div>
        </div>

        <div className="trust-badges-grid">
          <div className="trust-badge-card">
            <div className="trust-icon-box" style={{ background: "#dcfce7", color: "#16a34a" }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 3px", fontSize: "15px", color: "#0f172a" }}>
                Vendeurs Certifiés
              </h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Identité et boutiques vérifiées
              </p>
            </div>
          </div>

          <div className="trust-badge-card">
            <div className="trust-icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 3px", fontSize: "15px", color: "#0f172a" }}>
                Livraison Rapide
              </h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Expédition partout au Maroc
              </p>
            </div>
          </div>

          <div className="trust-badge-card">
            <div className="trust-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
              <CreditCard size={22} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 3px", fontSize: "15px", color: "#0f172a" }}>
                Paiement Sécurisé
              </h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Transactions protégées et fiables
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Categories;