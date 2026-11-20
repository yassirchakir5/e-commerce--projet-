import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Store,Search,Package,MapPin,Phone,Clock,X,CheckCircle} from "lucide-react";
import boutiquesData from "../../data/Boutiques.json";
import "./Shop.css";
import { Check } from "lucide-react";

class Boutiques extends Component {
  constructor(props) {
    super(props);

    const userShop = JSON.parse(localStorage.getItem("ma_boutique_config"));

    this.state = {
      search: "",
      filterType: "all",
      selectedBoutique: null,
      boutiques: [
        {
          id: 1,
          nom: userShop?.nomBoutique || "Yassir Store",
          logoText: "YS",
          cover:
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
          status: userShop ? (userShop.isOpen ? "Ouverte" : "Fermée") : "Ouverte",
          certifie: false,
          stars: 4,
          avis: 45,
          categorie: "Informatique",
          description:
            userShop?.description || "Matériel informatique & Smartphones",
          produitsCount: 15,
          vendeur: "Yassir",
          ville: userShop?.ville || "Ouled Teima / Agadir",
          telephone: userShop?.telephone || "0777040217",
          horaires: "09:00 - 20:00",
        },
        {
          id: 2,
          nom: "Electro Marrakesh",
          logoText: "EM",
          cover:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
          status: "Ouverte",
          certifie: false,
          stars: 4,
          avis: 45,
          categorie: "Informatique",
          description: "Matériel informatique & Gaming",
          produitsCount: 15,
          vendeur: "Yassir",
          ville: "Marrakech",
          telephone: "0661234567",
          horaires: "09:30 - 21:00",
        },
        {
          id: 3,
          nom: "Fashion Style",
          logoText: "FS",
          cover:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
          status: "Ouverte",
          certifie: true,
          stars: 4,
          avis: 45,
          categorie: "Mode",
          description: "Vêtements et accessoires tendance",
          produitsCount: 42,
          vendeur: "Yassir",
          ville: "Agadir",
          telephone: "0662987654",
          horaires: "10:00 - 22:00",
        },
        {
          id: 4,
          nom: "Casablanca Tech",
          logoText: "CT",
          cover:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
          status: "Ouverte",
          certifie: false,
          stars: 4,
          avis: 20,
          categorie: "Smartphones",
          description: "Matériel informatique & Smartphones",
          produitsCount: 42,
          vendeur: "Yassir",
          ville: "Casablanca",
          telephone: "0663112233",
          horaires: "09:00 - 19:30",
        },
      ],
    };
  }

  handleSearch = (e) => {
    this.setState({ search: e.target.value });
  };

  handleFilterChange = (e) => {
    this.setState({ filterType: e.target.value });
  };

  openDetails = (boutique) => {
    this.setState({ selectedBoutique: boutique });
  };

  closeDetails = () => {
    this.setState({ selectedBoutique: null });
  };

  render() {
    const { boutiques, search, filterType, selectedBoutique } = this.state;

    const filteredBoutiques = boutiquesData.filter((b) => {
      const matchSearch =
        b.nom.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        b.vendeur.toLowerCase().includes(search.toLowerCase());

      if (filterType === "all") return matchSearch;
      if (filterType === "ouverte")
        return matchSearch && b.status.toLowerCase() === "ouverte";
      if (filterType === "certifie") return matchSearch && b.certifie;
      return (
        matchSearch && b.categorie.toLowerCase() === filterType.toLowerCase()
      );
    });

    return (
      <div className="boutiques-page">
        <div className="boutiques-banner">
          <h1>
            <Store size={30} /> Toutes Nos Boutiques
          </h1>
          <p>
            Découvrez les boutiques de nos vendeurs ({filteredBoutiques.length}{" "}
            boutiques disponibles)
          </p>
        </div>

        <div className="boutiques-controls">
          <select
            className="boutiques-select"
            value={filterType}
            onChange={this.handleFilterChange}
          >
            <option value="all">Toutes</option>
            <option value="ouverte">Ouvertes</option>
            <option value="certifie">Vendeur Certifié</option>
            <option value="Informatique">Informatique</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Mode">Vêtements & Mode</option>
          </select>

          <div className="boutiques-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={search}
              onChange={this.handleSearch}
            />
          </div>
        </div>

        <div className="boutiques-grid">
          {boutiquesData.map((b) => (
            <div className="boutique-card" key={b.id}>
              <div className="boutique-cover-wrapper">
                <img
                  src={b.cover}
                  alt={b.nom}
                  className="boutique-cover-img"
                />
                <div className="boutique-avatar">
                  <span>{b.logoText}</span>
                </div>
              </div>

              <div className="boutique-body">
                {b.certifie ? (
                  <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <div className="pb-certified-badge">
                      <span className="pb-certified-icon">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>Vendeur Certifié</span>
                    </div>
                    <span
                    className={`boutique-badge ${
                      b.status === "Ouverte" ? "badge-ouverte" : "badge-fermee"
                    }`}
                  >
                    {b.status}
                  </span>
                  </div>
                ) : (
                  <div  style={{ display: "flex", justifyContent: "space-between"}}>
                    <div className="pb-certified-badge">
                      <span className="pb-certified-icon">
                        <X size={11} strokeWidth={3} />
                      </span>
                      <span>Vendeur Non Certifié</span>
                    </div>
                    <span
                    className={`boutique-badge ${
                      b.status === "Ouverte" ? "badge-ouverte" : "badge-fermee"
                    }`}
                  >
                    {b.status}
                  </span>
                  </div>
                )}
                  
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

        {filteredBoutiques.length === 0 && (
          <div className="boutiques-empty">
            <h3>Aucune boutique ne correspond à votre recherche.</h3>
          </div>
        )}

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

export default Boutiques;