import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Wallet, Package, ShoppingBag, Star, Plus, Settings,  Check, ArrowUpRight, Trash2, } from "lucide-react";
import boutiquesData from "../data/Boutiques.json";
import "./VendorDashboard.css";

const DEFAULT_ORDERS = [
  {
    id: "CMD-2389",
    client: "yassirchakir5@gmail.com",
    date: "14/11/2026 10:30",
    montant: 9500,
    statut: "Livrée",
  },
  {
    id: "CMD-2390",
    client: "amine.bennani@gmail.com",
    date: "14/11/2026 14:15",
    montant: 2000,
    statut: "En attente",
  },
  {
    id: "CMD-2391",
    client: "sara.elidrissi@gmail.com",
    date: "13/11/2026 18:45",
    montant: 1800,
    statut: "Livrée",
  },
  {
    id: "CMD-2392",
    client: "karim.tazi@gmail.com",
    date: "12/11/2026 11:20",
    montant: 500,
    statut: "En attente",
  },
  {
    id: "CMD-2393",
    client: "nadia.mansouri@gmail.com",
    date: "10/11/2026 16:05",
    montant: 1620,
    statut: "Livrée",
  },
];

const MONTHLY_REVENUES = [
  { month: "Jan", value: 1800 },
  { month: "Fév", value: 3200 },
  { month: "Mar", value: 4100 },
  { month: "Avr", value: 3900 },
  { month: "Mai", value: 5600 },
  { month: "Juin", value: 7800 },
  { month: "Juil", value: 7400 },
  { month: "Août", value: 10200 },
  { month: "Sept", value: 11800 },
  { month: "Oct", value: 13100 },
  { month: "Nov", value: 15420 },
];

class VendorDashboard extends Component {
  constructor(props) {
    super(props);

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
    const boutiqueId = props.boutiqueId || 1;
    const currentBoutique =
      allBoutiques.find((b) => String(b.id) === String(boutiqueId)) ||
      allBoutiques[0] ||
      {};

    const savedOrders = JSON.parse(sessionStorage.getItem("vendor_orders"));
    const orders =
      Array.isArray(savedOrders) && savedOrders.length > 0
        ? savedOrders
        : DEFAULT_ORDERS;

    if (!savedOrders) {
      sessionStorage.setItem("vendor_orders", JSON.stringify(orders));
    }

    this.state = {
      boutique: currentBoutique,
      orders,
      hoveredMonth: null,
    };
  }

  markAsDelivered = (orderId) => {
    this.setState((prevState) => {
      const updatedOrders = prevState.orders.map((order) =>
        order.id === orderId ? { ...order, statut: "Livrée" } : order
      );
      sessionStorage.setItem("vendor_orders", JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    });
  };

  deleteOrder = (orderId) => {
    this.setState((prevState) => {
      const updatedOrders = prevState.orders.filter((o) => o.id !== orderId);
      sessionStorage.setItem("vendor_orders", JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    });
  };

  render() {
    const { boutique, orders, hoveredMonth } = this.state;

    const products = Array.isArray(boutique.products) ? boutique.products : [];
    const totalProduits = products.length;
    const disponiblesCount = products.filter(
      (p) => p.status === "disponible"
    ).length;
    const revisionCount = totalProduits - disponiblesCount;

    const ventesTotales = orders
      .filter((o) => o.statut === "Livrée")
      .reduce((sum, o) => sum + Number(o.montant || 0), 0);

    const commandesAttente = orders.filter(
      (o) => o.statut === "En attente"
    ).length;

    const stars = Number(boutique.stars) || 5;
    const avisCount = Number(boutique.avis) || 0;
    const avisPositifsPercent = Math.min(100, Math.round((stars / 5) * 100));

    const chartWidth = 640;
    const chartHeight = 200;
    const maxVal = 18000;
    const points = MONTHLY_REVENUES.map((item, idx) => {
      const x = 30 + (idx * (chartWidth - 60)) / (MONTHLY_REVENUES.length - 1);
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
          <Link to="/">Home</Link> &gt; <span>Dashboard</span>
        </div>

        <div className="vd-top-bar">
          <div className="vd-title-group">
            <span className="vd-vertical-bar"></span>
            <h2>Tableau de bord (Dashboard)</h2>
          </div>

          <div className="vd-store-pill">
            <span className="vd-store-title">
              {boutique.nom || "Yassir Store"}
            </span>
            <span
              className={`vd-store-status ${
                boutique.status === "Ouverte" ? "open" : "closed"
              }`}
            >
              {boutique.status || "Ouverte"}
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
                <ArrowUpRight size={14} /> +12.4% vs mois dernier
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
              <h3>Aperçu des Revenus (2026)</h3>
              {hoveredMonth && (
                <span className="vd-chart-tooltip">
                  {hoveredMonth.month} :{" "}
                  <strong>{hoveredMonth.value.toLocaleString("fr-FR")} DH</strong>
                </span>
              )}
            </div>

            <div className="vd-svg-wrapper">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="vd-svg-chart"
              >
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

              <Link to="/boutique/1" className="vd-shortcut-btn secondary">
                <Settings size={18} />
                <span>Configurer ma Boutique</span>
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
                Les données sont synchronisées avec votre session actuelle.
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>{order.client}</td>
                    <td>{order.date}</td>
                    <td className="vd-amount">
                      {Number(order.montant).toLocaleString("fr-FR")} DH
                    </td>
                    <td>
                      <span
                        className={`vd-badge ${
                          order.statut === "Livrée" ? "delivered" : "pending"
                        }`}
                      >
                        {order.statut}
                      </span>
                    </td>
                    <td>
                      <div className="vd-row-actions">
                        {order.statut !== "Livrée" && (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default VendorDashboard;