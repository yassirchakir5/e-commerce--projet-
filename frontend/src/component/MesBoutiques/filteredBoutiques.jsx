import { Component } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

class FilteredBoutiques extends Component{
    render(){
        return (
        <div  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",  gap: "20px", marginBottom: "30px", }} >
         {this.props.filteredBoutiques.map((b, index) => {
            const statusText = b.status_boutique || "ouverte";
            const isCertifie = b.certifiée === true || b.certifiée === "true";
            const vendeurName = typeof b.vendeur === "string" ? b.vendeur : b.vendeur?.name || "Vendeur";

            return (
              <div
                className="boutique-card"
                key={b.id}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <div className="boutique-cover-wrapper">
                  <img
                    src={
                      b.logo_boutique
                        ? encodeURI(`http://127.0.0.1:8000/storage/${b.logo_boutique}`)
                        : "/placeholder-store.jpg"
                    }
                    alt={b.nom}
                    className="boutique-cover-img"
                  />
                  <div className="boutique-avatar">
                    <span>{b.logoText || (b.nom ? b.nom[0].toUpperCase() : "B")}</span>
                  </div>
                </div>

                <div className="boutique-body">
                {isCertifie ? (
                  <span className="boutique-badge badge-certifie">
                    Vendeur Certifié
                  </span>
                ) : (
                  <span
                    className={`boutique-badge ${
                      statusText.toLowerCase() === "ouverte"
                        ? "badge-ouverte"
                        : "badge-fermee"
                    }`}
                  >
                    {statusText}
                  </span>
                )}

                  <h3 className="boutique-title">{b.nom}</h3>

                  <div className="boutique-rating">
                    <span className="stars">
                      {"★".repeat(b.stars || 5)}
                      {"☆".repeat(5 - (b.stars || 5))}
                    </span>
                    <span className="avis-count">({b.avis || 0})</span>
                  </div>

                  <p className="boutique-desc">{b.description || b.desc}</p>

                  <div className="boutique-products-count">
                    <Package size={16} color="#b45309" />
                    <span>{b.produitsCount } Produits</span>
                  </div>

                  <div className="boutique-actions">
                    <Link to={`/boutique/${b.id}`} className="btn-visiter">
                      Visiter la boutique
                    </Link>
                    <button
                      type="button"
                      className="btn-details-boutique"
                      onClick={() => this.props.openDetails(b)}
                    >
                      Gérer / Détails
                    </button>
                  </div>
                </div>

                <div className="boutique-footer">
                  Géré par : <strong>{vendeurName}</strong>
                </div>
              </div>
            );
          })}
        </div>
        );
    }
}
export default FilteredBoutiques;