import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Wallet, Package, ShoppingBag, Star, Plus, Settings, Check, ArrowUpRight, Trash2, Store,  LayoutDashboard, ArrowLeft, } from "lucide-react";
import api from "../api/api";
import "./VendorDashboard.css";

const MOIS_NOMS = [ "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc" ];

class VendorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boutiques: [],
      allProducts: [],
      allOrders: [],
      selectedBoutique: null,
      hoveredMonth: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchDataFromDatabase();
  }

  fetchDataFromDatabase = async () => {
    try {
      const [boutiquesRes, produitsRes, commandesRes] = await Promise.allSettled([
        api.get("/boutique"),
        api.get("/produit/afficher"),
        api.get("/vendeur/commandes"),
      ]);

      this.setState({
        boutiques:
          boutiquesRes.status === "fulfilled"
            ? boutiquesRes.value.data.boutiques || []
            : [],
        allProducts:
          produitsRes.status === "fulfilled"
            ? produitsRes.value.data.produits || []
            : [],
        allOrders:
          commandesRes.status === "fulfilled"
            ? commandesRes.value.data.commandes || []
            : [],
        loading: false,
      });
    } catch (err) {
      console.error("Erreur de chargement :", err);
      this.setState({ loading: false });
    }
  };

  openBoutiqueDashboard = (boutique) => {
    this.setState({ selectedBoutique: boutique });
  };

  backToBoutiquesList = () => {
    this.setState({ selectedBoutique: null });
  };

  markAsDelivered = async (orderId) => {
    try {
      await api.put(`/commande/${orderId}/livrer`);
      this.setState((prevState) => ({
        allOrders: prevState.allOrders.map((order) =>
          order.id === orderId ? { ...order, statut: "Livrée" } : order
        ),
      }));
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
    }
  };

  deleteOrder = async (orderId) => {
    try {
      await api.delete(`/commande/${orderId}`);
      this.setState((prevState) => ({
        allOrders: prevState.allOrders.filter((o) => o.id !== orderId),
      }));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  render() {
    const {
      boutiques,
      allProducts,
      allOrders,
      selectedBoutique,
      hoveredMonth,
      loading,
    } = this.state;

    if (loading) {
      return (
        <div className="vd-container">
          <h3>Chargement des boutiques...</h3>
        </div>
      );
    }

    if (!selectedBoutique) {
      return (
        <div className="vd-container">
          <div className="vd-breadcrumb">
            <Link to="/">Home</Link> &gt; <span>Mes Boutiques</span>
          </div>

          <div className="vd-top-bar">
            <div className="vd-title-group">
              <span className="vd-vertical-bar"></span>
              <h2>Mes Boutiques ({boutiques.length})</h2>
            </div>

            <Link to="/boutiques" className="vd-shortcut-btn primary">
              <Plus size={18} />
              <span>Nouvelle Boutique</span>
            </Link>
          </div>

          {boutiques.length === 0 ? (
            <div className="vd-card" style={{ textAlign: "center", padding: "40px" }}>
              <h3>Aucune boutique trouvée.</h3>
              <p style={{ color: "#64748b", marginTop: "8px" }}>
                Créez votre première boutique pour accéder à son tableau de bord.
              </p>
            </div>
          ) : (
            <div className="vd-kpi-grid">
              {boutiques.map((boutique) => {
                const boutiqueProducts = allProducts.filter(
                  (p) => String(p.id_boutique) === String(boutique.id)
                );
                const dispoCount = boutiqueProducts.filter(
                  (p) => (p.status || "").toLowerCase() === "disponible"
                ).length;

                return (
                  <div
                    key={boutique.id}
                    className="vd-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="vd-kpi-icon blue">
                          <Store size={24} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "18px" }}>{boutique.nom}</h3>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>
                            {boutique.adresse || boutique.ville || "Boutique vérifiée"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`vd-store-status ${
                          (boutique.status || "Ouverte") === "Ouverte" ? "open" : "closed"
                        }`}
                      >
                        {boutique.status || "Ouverte"}
                      </span>
                    </div>

                    {boutique.description && (
                      <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>
                        {boutique.description}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: "#f8fafc",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    >
                      <span>
                        Produits : <strong>{boutiqueProducts.length}</strong>
                      </span>
                      <span>
                        Disponibles :{" "}
                        <strong style={{ color: "#16a34a" }}>{dispoCount}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => this.openBoutiqueDashboard(boutique)}
                      className="vd-shortcut-btn primary"
                      style={{ width: "100%", justifyContent: "center", border: "none", cursor: "pointer" }}
                    >
                      <LayoutDashboard size={18} />
                      <span>Voir Dashboard</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const currentBoutique = selectedBoutique;

    const boutiqueProducts = allProducts.filter(
      (p) => String(p.id_boutique) === String(currentBoutique.id)
    );
    const orders = allOrders.filter(
      (o) => String(o.id_boutique) === String(currentBoutique.id)
    );

    const totalProduits = boutiqueProducts.length;
    const disponiblesCount = boutiqueProducts.filter(
      (p) => (p.status || "").toLowerCase() === "disponible"
    ).length;
    const revisionCount = boutiqueProducts.filter(
      (p) => (p.status || "").toLowerCase() === "en-révision"
    ).length;

    const ventesTotales = orders
      .filter((o) => (o.statut || "").toLowerCase() === "livrée")
      .reduce((sum, o) => sum + Number(o.montant || 0), 0);

    const commandesAttente = orders.filter(
      (o) => (o.statut || "").toLowerCase().includes("attente")
    ).length;

    const monthlyRevenues = MOIS_NOMS.map((monthName, idx) => {
      const monthNumber = idx + 1;
      const totalMois = orders
        .filter(
          (o) =>
            o.mois === monthNumber &&
            (o.statut || "").toLowerCase() === "livrée"
        )
        .reduce((sum, o) => sum + Number(o.montant || 0), 0);
      return { month: monthName, value: totalMois };
    });

    const stars = Number(currentBoutique.stars) || 5;
    const avisCount = Number(currentBoutique.avis) || 0;
    const avisPositifsPercent = Math.min(100, Math.round((stars / 5) * 100));

    const chartWidth = 640;
    const chartHeight = 200;
    const maxVal = Math.max(...monthlyRevenues.map((m) => m.value), 1000);
    const points = monthlyRevenues.map((item, idx) => {
      const x = 30 + (idx * (chartWidth - 60)) / (monthlyRevenues.length - 1);
      const y = chartHeight - 25 - (item.value / maxVal) * (chartHeight - 50);
      return { ...item, x, y };
    });

    const linePath = points
      .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
      .join(" ");

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${
      chartHeight - 25
    } L ${points[0].x} ${chartHeight - 25} Z`;

    return (
      <div className="vd-container">
        <div className="vd-breadcrumb">
          <Link to="/">Home</Link> &gt;{" "}
          <span
            onClick={this.backToBoutiquesList}
            style={{ cursor: "pointer", color: "#0284c7" }}
          >
            Mes Boutiques
          </span>{" "}
          &gt; <span>Dashboard ({currentBoutique.nom})</span>
        </div>

        <div className="vd-top-bar">
          <div className="vd-title-group">
            <button
              type="button"
              onClick={this.backToBoutiquesList}
              className="vd-shortcut-btn secondary"
              style={{ padding: "8px 14px", marginRight: "12px", cursor: "pointer" }}
            >
              <ArrowLeft size={16} />
              <span>Retour</span>
            </button>

            <span className="vd-vertical-bar"></span>
            <h2>Dashboard : {currentBoutique.nom}</h2>
          </div>

          <div className="vd-store-pill">
            <span className="vd-store-title">{currentBoutique.nom}</span>
            <span
              className={`vd-store-status ${
                (currentBoutique.status || "Ouverte") === "Ouverte" ? "open" : "closed"
              }`}
            >
              {currentBoutique.status || "Ouverte"}
            </span>
          </div>
        </div>

        <div className="vd-kpi-grid">
          <div className="vd-kpi-card">
            <div className="vd-kpi-icon green">
              <Wallet size={24} />
            </div>
            <div className="vd-kpi-content">
              <span className="vd-kpi-label">Ventes Totales (Livrées)</span>
              <strong className="vd-kpi-value">
                {ventesTotales.toLocaleString("fr-FR")} DH
              </strong>
              <span className="vd-kpi-sub positive">
                <ArrowUpRight size={14} /> Synchronisé avec la BDD
              </span>
            </div>
          </div>

          <div className="vd-kpi-card">
            <div className="vd-kpi-icon blue">
              <ShoppingBag size={24} />
            </div>
            <div className="vd-kpi-content">
              <span className="vd-kpi-label">Commandes</span>
              <strong className="vd-kpi-value">{orders.length}</strong>
              <span className="vd-kpi-sub warning">
                {commandesAttente} en attente
              </span>
            </div>
          </div>

          <div className="vd-kpi-card">
            <div className="vd-kpi-icon amber">
              <Package size={24} />
            </div>
            <div className="vd-kpi-content">
              <span className="vd-kpi-label">Produits Actifs</span>
              <strong className="vd-kpi-value">{totalProduits}</strong>
              <span className="vd-kpi-sub">
                {disponiblesCount} disponibles, {revisionCount} en révision
              </span>
            </div>
          </div>

          <div className="vd-kpi-card">
            <div className="vd-kpi-icon gold">
              <Star size={24} />
            </div>
            <div className="vd-kpi-content">
              <span className="vd-kpi-label">Avis Positifs</span>
              <strong className="vd-kpi-value">{avisPositifsPercent}%</strong>
              <span className="vd-kpi-sub">{avisCount} avis clients</span>
            </div>
          </div>
        </div>

        <div className="vd-middle-grid">
          <div className="vd-card vd-chart-card">
            <div className="vd-card-header">
              <h3>Aperçu des Revenus - {currentBoutique.nom} (2026)</h3>
              {hoveredMonth && (
                <span className="vd-chart-tooltip">
                  {hoveredMonth.month} :{" "}
                  <strong>{hoveredMonth.value.toLocaleString("fr-FR")} DH</strong>
                </span>
              )}
            </div>

            <div className="vd-svg-wrapper">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="vd-svg-chart">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[0, 0.5, 1].map((ratio, idx) => {
                  const yPos = 25 + ratio * (chartHeight - 50);
                  return (
                    <line
                      key={idx}
                      x1="30"
                      y1={yPos}
                      x2={chartWidth - 30}
                      y2={yPos}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                <path d={areaPath} fill="url(#revGrad)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {points.map((pt, idx) => (
                  <g
                    key={idx}
                    onMouseEnter={() => this.setState({ hoveredMonth: pt })}
                    onMouseLeave={() => this.setState({ hoveredMonth: null })}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredMonth?.month === pt.month ? 6 : 4}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#64748b"
                    >
                      {pt.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="vd-card vd-shortcuts-card">
            <h3>Raccourcis Rapides</h3>

            <div className="vd-shortcuts-btns">
              <Link to="/mesproducts" className="vd-shortcut-btn primary">
                <Plus size={18} />
                <span>Ajouter un Produit</span>
              </Link>

              <Link
                to={`/boutique/${currentBoutique.id}`}
                className="vd-shortcut-btn secondary"
              >
                <Settings size={18} />
                <span>Configurer {currentBoutique.nom}</span>
              </Link>
            </div>

            <div className="vd-performance-box">
              <h4>Niveau de performance</h4>
              <p>
                Taux de disponibilité :{" "}
                <strong>
                  {totalProduits > 0
                    ? Math.round((disponiblesCount / totalProduits) * 100)
                    : 0}
                  %
                </strong>
              </p>
              <div className="vd-progress-bar">
                <div
                  className="vd-progress-fill"
                  style={{
                    width: `${
                      totalProduits > 0
                        ? Math.round((disponiblesCount / totalProduits) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="vd-perf-note">
                Données synchronisées pour {currentBoutique.nom}.
              </span>
            </div>
          </div>
        </div>

        <div className="vd-card vd-table-card">
          <div className="vd-card-header">
            <h3>Commandes Récentes ({orders.length})</h3>
          </div>

          <div className="vd-table-responsive">
            <table className="vd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                      Aucune commande trouvée pour cette boutique.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.numero}</strong>
                      </td>
                      <td>{order.client}</td>
                      <td>{order.date}</td>
                      <td className="vd-amount">
                        {Number(order.montant).toLocaleString("fr-FR")} DH
                      </td>
                      <td>
                        <span
                          className={`vd-badge ${
                            (order.statut || "").toLowerCase() === "livrée"
                              ? "delivered"
                              : "pending"
                          }`}
                        >
                          {order.statut}
                        </span>
                      </td>
                      <td>
                        <div className="vd-row-actions">
                          {(order.statut || "").toLowerCase() !== "livrée" && (
                            <button
                              type="button"
                              className="vd-action-btn confirm"
                              title="Marquer comme livrée"
                              onClick={() => this.markAsDelivered(order.id)}
                            >
                              <Check size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="vd-action-btn delete"
                            title="Supprimer"
                            onClick={() => this.deleteOrder(order.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default VendorDashboard;