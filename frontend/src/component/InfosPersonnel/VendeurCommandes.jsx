import { Component } from "react";
import axios from "axios";
import { Package, User, Mail, Phone, CheckCircle, Clock, Truck, FileDown } from "lucide-react";

class VendeurCommandes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commandes: [],
      boutiqueNom: "",
      loading: true,
      filterStatus: "TOUS",
      debugInfo: null,
    };
  }

  getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `http://127.0.0.1:8000/storage/${img.replace(/^\/?(storage\/)?/, "")}`;
  };

  fetchCommandesVendeur = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/vendeur/commandes", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("Réponse API vendeur/commandes :", res.data);
        this.setState({
          commandes: res.data.commandes || [],
          boutiqueNom: res.data.boutique || "",
          debugInfo: res.data.debug || null,
          loading: false,
        });
      })
      .catch((err) => {
        console.error("Erreur chargement commandes vendeur:", err);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.fetchCommandesVendeur();
  }

  

  handleStatusChange = (commandeId, newStatus) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://127.0.0.1:8000/api/vendeur/commandes/${commandeId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )
      .then(() => {
        this.setState((prev) => ({
          commandes: prev.commandes.map((cmd) =>
            cmd.id === commandeId ? { ...cmd, status: newStatus } : cmd
          ),
        }));
      })
      .catch((err) => console.error("Erreur mise à jour statut:", err));
  };

  getBadgeStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("livrée") || s.includes("payée")) {
      return { background: "#dcfce7", color: "#15803d" };
    }
    if (s.includes("cours") || s.includes("expédiée")) {
      return { background: "#e0f2fe", color: "#0369a1" };
    }
    if (s.includes("annulée")) {
      return { background: "#fee2e2", color: "#b91c1c" };
    }
    return { background: "#fef9c3", color: "#a16207" };
  };

  render() {
    const { commandes, boutiqueNom, loading, filterStatus } = this.state;

    const filteredCommandes =
      filterStatus === "TOUS"
        ? commandes
        : commandes.filter((c) => c.status === filterStatus);

    return (
      <div style={{ padding: "10px", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "22px" }}>
              Commandes reçues {boutiqueNom ? `(${boutiqueNom})` : ""}
            </h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
              Suivez et gérez les commandes passées par vos clients
            </p>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => this.setState({ filterStatus: e.target.value })}
            style={{
              padding: "9px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontWeight: "600",
              color: "#334155",
            }}
          >
            <option value="TOUS">Toutes les commandes ({commandes.length})</option>
            <option value="Payée">Payée</option>
            <option value="En attente">En attente</option>
            <option value="En cours de livraison">En cours de livraison</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
            Chargement des commandes...
          </p>
        ) : filteredCommandes.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}
          >
            <Package size={42} style={{ marginBottom: "10px", opacity: 0.5 }} />
            <h3 style={{ margin: 0 }}>Aucune commande trouvée</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredCommandes.map((cmd) => (
              <div
                key={cmd.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    paddingBottom: "14px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "800", fontSize: "17px", color: "#0f172a" }}>
                      Commande N° #{cmd.id}
                    </span>
                    <span style={{ marginLeft: "12px", fontSize: "13px", color: "#64748b" }}>
                      {cmd.date_commande}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        ...this.getBadgeStyle(cmd.status),
                        padding: "5px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {cmd.status}
                    </span>

                    <select
                      value={cmd.status}
                      onChange={(e) => this.handleStatusChange(cmd.id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      <option value="En attente">En attente</option>
                      <option value="Payée">Payée</option>
                      <option value="En cours de livraison">En cours de livraison</option>
                      <option value="Livrée">Livrée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "18px",
                    background: "#f8fafc",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    margin: "14px 0",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <User size={15} color="#0284c7" /> <strong>Client :</strong> {cmd.client_nom}
                  </span>
                  {cmd.client_email && (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={15} color="#0284c7" /> {cmd.client_email}
                    </span>
                  )}
                  {cmd.client_tel && (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={15} color="#0284c7" /> {cmd.client_tel}
                    </span>
                  )}
                  {cmd.client_adresse && (
                    <span>
                        <strong>Adresse :</strong> {cmd.client_adresse}
                    </span>
                    )}
                  <span>
                    <strong>Paiement :</strong> {cmd.mode_paiement}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(cmd.articles || []).map((art, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px dashed #e2e8f0",
                        fontSize: "14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {art.image && (
                            <img
                                src={this.getImageUrl(art.image)}
                                alt={art.nom}
                                onError={(e) => { e.target.style.display = "none"; }}
                                style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px" }}
                            />
                            )}
                        <div>
                          <strong style={{ color: "#0f172a" }}>{art.nom}</strong>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            Quantité : {art.quantite} × {Number(art.prix_unitaire).toFixed(2)} DH
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: "700", color: "#0f172a" }}>
                        {(Number(art.prix_unitaire) * Number(art.quantite)).toFixed(2)} DH
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "14px",
                    paddingTop: "10px",
                  }}
                >
                  <a
                    href={`http://127.0.0.1:8000/api/commande/${cmd.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#0284c7",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    <FileDown size={16} /> Télécharger le bon de commande (PDF)
                  </a>

                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#dc2626" }}>
                    Total : {Number(cmd.total).toFixed(2)} DH
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default VendeurCommandes;