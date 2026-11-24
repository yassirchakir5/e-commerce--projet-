import { Component } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { Store, Save, ExternalLink, Package, CheckCircle, Clock, X } from "lucide-react";
import "../../assets/MaBoutique.css";

class GérerMaBoutique extends Component {
  normalizeStatus = (status) => {
    const clean = (status || "disponible").toString().trim().toLowerCase();
    if (clean === "en-révision" || clean === "en-revision" || clean === "suspendu" || clean === "suspendue") {
      return "En-révision";
    }
    if (clean === "vendue") {
      return "Vendue";
    }
    return "disponible";
  };

  render() {
    const inputStyle = {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      color: "#1e293b",
      backgroundColor: "#fff",
      boxSizing: "border-box",
      outline: "none",
    };

    const labelStyle = {
      fontSize: "14px",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "6px",
      display: "block",
    };

    return (
      <div
        className="maboutique-container"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          padding: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <div
          className="maboutique-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            paddingBottom: "16px",
            marginBottom: "20px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: 0,
              fontSize: "20px",
              color: "#0f172a",
            }}
          >
            <Store size={24} color="#2563eb" />
            <span>Gestion de : {this.props.nomBoutique}</span>
          </h2>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link
              to={`/boutique/${this.props.selectedBoutiqueId}`}
              className="btn-voir-shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                border: "1px solid #bfdbfe",
              }}
            >
              Voir la boutique <ExternalLink size={16} />
            </Link>

            <button
              type="button"
              onClick={this.props.toggleajoutcurrentpag}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569",
              }}
              title="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className="boutique-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            className="stat-box"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Package size={24} color="#2563eb" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>Total Produits</span>
              <strong style={{ fontSize: "20px", color: "#0f172a" }}>
                {this.props.myProducts.length}
              </strong>
            </div>
          </div>

          <div
            className="stat-box"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            <CheckCircle size={24} color="#16a34a" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>Disponibles</span>
              <strong style={{ fontSize: "20px", color: "#0f172a" }}>
                {this.props.dispoCount}
              </strong>
            </div>
          </div>

          <div
            className="stat-box"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Clock size={24} color="#d97706" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>En révision</span>
              <strong style={{ fontSize: "20px", color: "#0f172a" }}>
                {this.props.revCount}
              </strong>
            </div>
          </div>
        </div>

        <form className="boutique-form" onSubmit={this.props.handleSave}>
          <div
            className="form-row-switch"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "14px 16px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong style={{ fontSize: "14px", color: "#334155" }}>
                Statut de la boutique :
              </strong>
              <span
                className={this.props.isOpen ? "tag-open" : "tag-closed"}
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "700",
                  backgroundColor: this.props.isOpen ? "#dcfce7" : "#fee2e2",
                  color: this.props.isOpen ? "#15803d" : "#b91c1c",
                }}
              >
                {this.props.isOpen ? "Ouverte" : "Fermée temporairement"}
              </span>
            </div>

            <label
              className="switch-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              <input
                type="checkbox"
                name="isOpen"
                checked={this.props.isOpen}
                onChange={this.props.handleChange}
                style={{ width: "17px", height: "17px", cursor: "pointer" }}
              />
              <span>Activer / Désactiver</span>
            </label>
          </div>

          <div
            className="form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div className="form-group">
              <label style={labelStyle}>Nom de la boutique</label>
              <input
                type="text"
                name="nomBoutique"
                value={this.props.nomBoutique}
                onChange={this.props.handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div className="form-group">
              <label style={labelStyle}>Téléphone / WhatsApp</label>
              <input
                type="text"
                name="telephone"
                value={this.props.telephone}
                onChange={this.props.handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div className="form-group">
              <label style={labelStyle}>Ville / Adresse du magasin</label>
              <input
                type="text"
                name="ville"
                value={this.props.ville}
                onChange={this.props.handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label style={labelStyle}>Horaires d'ouverture</label>
              <input
                type="text"
                name="horaire"
                value={this.props.horaire || ""}
                onChange={this.props.handleChange}
                placeholder="Ex: Lun - Sam : 09h00 - 20h00"
                style={inputStyle}
              />
            </div>

            <div className="form-group full-width" style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description de la boutique</label>
              <textarea
                name="description"
                rows="3"
                value={this.props.description}
                onChange={this.props.handleChange}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <button
              type="submit"
              className="btn-save-boutique"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <Save size={18} /> Enregistrer les modifications
            </button>

            <button
              type="button"
              onClick={this.props.handledelete}
              className="btn-save-boutique delete"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <MdDelete size={18} /> Supprimer la boutique
            </button>
          </div>

          {this.props.savedMessage && (
            <p
              className="save-success"
              style={{
                marginTop: "14px",
                padding: "10px 14px",
                backgroundColor: "#dcfce7",
                color: "#15803d",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {this.props.message}
            </p>
          )}
        </form>

        <div
          className="boutique-products-control"
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ marginBottom: "14px", fontSize: "17px", color: "#0f172a" }}>
            Contrôle rapide des produits
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table
              className="boutique-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: "12px", color: "#475569" }}>
                    Produit
                  </th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#475569" }}>
                    Prix
                  </th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#475569" }}>
                    Statut
                  </th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#475569" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.myProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "18px",
                        color: "#64748b",
                      }}
                    >
                      Aucun produit dans cette boutique.
                    </td>
                  </tr>
                ) : (
                  this.props.myProducts.map((prod, idx) => {
                    const currentStatus = this.normalizeStatus(prod.status);
                    return (
                      <tr
                        key={prod.id || idx}
                        style={{ borderBottom: "1px solid #e2e8f0" }}
                      >
                        <td style={{ padding: "12px", fontWeight: "500", color: "#1e293b" }}>
                          {prod.nom}
                        </td>
                        <td style={{ padding: "12px", color: "#334155" }}>
                          {prod.prix ?? prod.price} DH
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            className={`status-pill ${
                              currentStatus === "disponible" ? "ok" : "wait"
                            }`}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: "600",
                              backgroundColor:
                                currentStatus === "disponible"
                                  ? "#dcfce7"
                                  : currentStatus === "Vendue"
                                  ? "#fee2e2"
                                  : "#fef3c7",
                              color:
                                currentStatus === "disponible"
                                  ? "#15803d"
                                  : currentStatus === "Vendue"
                                  ? "#b91c1c"
                                  : "#b45309",
                            }}
                          >
                            {currentStatus === "disponible"
                              ? "Disponible"
                              : currentStatus === "Vendue"
                              ? "Vendue"
                              : "En-révision"}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <select
                            className="role-select"
                            value={currentStatus}
                            onChange={(e) =>
                              this.props.toggleProductStatus(prod, e.target.value)
                            }
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              backgroundColor: "#f8fafc",
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            <option value="disponible">Disponible</option>
                            <option value="Vendue">Épuisé (Vendue)</option>
                            <option value="En-révision">En-révision</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default GérerMaBoutique;