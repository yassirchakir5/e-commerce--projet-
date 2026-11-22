import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Store, Search, Package, MapPin, Phone, Clock, X, CheckCircle, Check } from "lucide-react";
import api from "../../api/api";
import "./Shop.css";

class Boutiques extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      filterType: "all",
      selectedBoutique: null,
      boutiques: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchBoutiques();
  }

  fetchBoutiques = async () => {
    try {
      const res = await api.get("/boutique/all");
      const list = res.data.boutiques || res.data || [];
      
      this.setState({
        boutiques: Array.isArray(list) ? list : [],
        loading: false,
      });
    } catch (err) {
      console.error("Erreur chargement boutiques:", err);
    }
  };

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

  normalizeBoutique = (b) => {
    const nom = b.nom || "Boutique sans nom";
    const description = b.desc || b.description || "";
    const status = b.status_boutique || b.status || "Fermée";
    const isOpen = String(status).toLowerCase() === "ouverte";
    const certifie = b.certifiée === true || String(b.certifiée || b.certifie).toLowerCase() === "true";
    const stars = Math.min(5, Math.max(0, Number(b.stars) || 0));
    const avis = Number(b.count_avis ?? b.avis ?? 0);
    const telephone = b.numtel || b.telephone || "Non renseigné";
    const ville = b.ville || "Non renseignée";
    const horaires = b.horaire || b.horaires || "09:00 - 20:00";
    const categorie = b.categorie || "";
    const logoText = b.logoText || nom.slice(0, 2).toUpperCase();
    const cover = b.logo_boutique
      ? `http://127.0.0.1:8000/storage/${b.logo_boutique}`
      : b.cover || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80";
    const produitsCount = Number(
      b.produits_count ?? (Array.isArray(b.products) ? b.products.length : b.produitsCount ?? 0)
    );
   
    const vendeur =
      typeof b.vendeur === "object" && b.vendeur !== null
        ? b.vendeur.name || b.vendeur.nom || "Vendeur"
        : b.vendeur || "Vendeur";
    
    return {
      ...b,
      nom,
      description,
      status,
      isOpen,
      certifie,
      stars,
      avis,
      telephone,
      ville,
      horaires,
      categorie,
      logoText,
      cover,
      produitsCount,
      vendeur,
    };
  };

  render() {
    const { boutiques, search, filterType, selectedBoutique, loading } = this.state;

    const normalizedList = boutiques.map(this.normalizeBoutique);

    const filteredBoutiques = normalizedList.filter((b) => {
      const term = search.trim().toLowerCase();
      
      const matchSearch =
        !term ||
        b.nom.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        b.vendeur.toLowerCase().includes(term) ||
        b.ville.toLowerCase().includes(term);

      if (filterType === "all") return matchSearch;
      if (filterType === "ouverte") return matchSearch && b.isOpen;
      if (filterType === "certifie") return matchSearch && b.certifie;
      return matchSearch && b.categorie.toLowerCase() === filterType.toLowerCase();
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
          <select  className="boutiques-select" value={filterType} onChange={this.handleFilterChange} >
            <option value="all">Toutes</option>
            <option value="ouverte">Ouvertes</option>
            <option value="certifie">Vendeur Certifié</option>
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Chargement des boutiques...
          </div>
        ) : (
          <div className="boutiques-grid">
            {filteredBoutiques.map((b) => (
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {b.certifie ? (
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

                    <span
                      className={`boutique-badge ${
                        b.isOpen ? "badge-ouverte" : "badge-fermee"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

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
                    <span>{b.produitsCount} Produits</span>
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
        )}

        {!loading && filteredBoutiques.length === 0 && (
          <div className="boutiques-empty">
            <h3>Aucune boutique existe.</h3>
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
                  to={`/boutique/${selectedBoutique.id}`}
                  className="btn-visiter"
                  onClick={this.closeDetails}
                >
                  Voir la boutique
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