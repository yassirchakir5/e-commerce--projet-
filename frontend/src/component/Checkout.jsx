import { Component } from "react";
import { CartContext } from "../context/CartContext";
import { Navigate, Link } from "react-router-dom";
import {
  CreditCard,
  Truck,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  FileDown,
} from "lucide-react";
import api from "../api/api";

class Checkout extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      adresses: [],
      cartes: [],
      selectedAdresseId: "",
      customAdresse: "",
      methodePaiement: "carte",
      selectedCarteId: "",
      numeroCarte: "",
      nomTitulaire: "",
      dateExpiration: "",
      cvv: "",
      loading: false,
      error: "",
      success: false,
      commandesIds: [],
      pdfUrl: "",
      redirectLogin: false,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ redirectLogin: true });
      return;
    }
    this.fetchUserData();
  }

  fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await api.get("/checkout/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const listAdr = res.data.adresses || [];
      const listCartes = res.data.cartes || [];

      let defaultAdrText = [user.addresselocal, user.province, user.pays]
        .filter(Boolean)
        .join(", ");
      let defaultAdrId = "custom";

      if (listAdr.length > 0) {
        defaultAdrId = String(listAdr[0].id);
        defaultAdrText = `${listAdr[0].title ? listAdr[0].title + " - " : ""}${listAdr[0].adresse}, ${listAdr[0].pays}`;
      }

      let cardState = {
        selectedCarteId: "new",
        numeroCarte: "",
        nomTitulaire: "",
        dateExpiration: "",
        cvv: "",
      };

      if (listCartes.length > 0) {
        const firstCard = listCartes[0];
        cardState = {
          selectedCarteId: String(firstCard.id),
          numeroCarte: firstCard.numC || "",
          nomTitulaire: firstCard.nom || "",
          dateExpiration: firstCard.dateEx || "",
          cvv: firstCard.CVV || "",
        };
      }

      this.setState({
        adresses: listAdr,
        cartes: listCartes,
        selectedAdresseId: defaultAdrId,
        customAdresse: defaultAdrText,
        ...cardState,
      });
    } catch (err) {
      console.error("Erreur chargement adresses/cartes:", err);
    }
  };

  handleSelectAdresse = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      this.setState({ selectedAdresseId: "custom", customAdresse: "" });
    } else {
      const adr = this.state.adresses.find((a) => String(a.id) === String(val));
      if (adr) {
        this.setState({
          selectedAdresseId: val,
          customAdresse: `${adr.title ? adr.title + " - " : ""}${adr.adresse}, ${adr.pays}`,
        });
      }
    }
  };

  handleSelectCarte = (e) => {
    const val = e.target.value;
    if (val === "new") {
      this.setState({
        selectedCarteId: "new",
        numeroCarte: "",
        nomTitulaire: "",
        dateExpiration: "",
        cvv: "",
      });
    } else {
      const card = this.state.cartes.find((c) => String(c.id) === String(val));
      if (card) {
        this.setState({
          selectedCarteId: val,
          numeroCarte: card.numC || "",
          nomTitulaire: card.nom || "",
          dateExpiration: card.dateEx || "",
          cvv: card.CVV || "",
        });
      }
    }
  };

  handleSubmitPayment = async (e) => {
    e.preventDefault();
    const { cartItems = [], clearCart } = this.context || {};
    const {
      methodePaiement,
      customAdresse,
      numeroCarte,
      nomTitulaire,
      dateExpiration,
      cvv,
    } = this.state;

    if (cartItems.length === 0) {
      this.setState({ error: "Votre panier est vide." });
      return;
    }

    if (!customAdresse.trim()) {
      this.setState({ error: "Veuillez saisir une adresse de livraison." });
      return;
    }

    this.setState({ loading: true, error: "" });

    try {
      const token = localStorage.getItem("token");

      const payload = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantite: Number(item.quantity || item.quantite || 1),
        })),
        methode_paiement: methodePaiement,
        adresse_livraison: customAdresse,
        numero_carte:
          methodePaiement === "carte" ? numeroCarte.replace(/\s+/g, "") : null,
        nom_titulaire: methodePaiement === "carte" ? nomTitulaire : null,
        date_expiration: methodePaiement === "carte" ? dateExpiration : null,
        cvv: methodePaiement === "carte" ? cvv : null,
      };

      const res = await api.post("/checkout/payer", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (clearCart) {
        clearCart();
      } else {
        localStorage.removeItem("cart");
      }

      this.setState({
        loading: false,
        success: true,
        commandesIds: res.data.commandes_id || [],
        pdfUrl: res.data.pdf_url || "",
      });
    } catch (err) {
      console.error("Erreur paiement:", err);
      this.setState({
        loading: false,
        error:
          err.response?.data?.message ||
          "Échec du paiement. Vérifiez vos informations.",
      });
    }
  };

  render() {
    if (this.state.redirectLogin) {
      return <Navigate to="/login" />;
    }

    const { cartItems = [], cartTotal } = this.context || {};
    const {
      adresses,
      cartes,
      selectedAdresseId,
      customAdresse,
      methodePaiement,
      selectedCarteId,
      numeroCarte,
      nomTitulaire,
      dateExpiration,
      cvv,
      loading,
      error,
      success,
      commandesIds,
      pdfUrl,
    } = this.state;

    const totalAmount =
      typeof cartTotal === "number"
        ? cartTotal
        : cartItems.reduce(
            (sum, item) =>
              sum +
              Number(item.prix || 0) * Number(item.quantity || item.quantite || 1),
            0
          );

    if (success) {
      return (
        <div
          style={{
            maxWidth: "560px",
            margin: "60px auto",
            padding: "36px",
            background: "#fff",
            borderRadius: "16px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <CheckCircle2
            size={64}
            color="#16a34a"
            style={{ margin: "0 auto 16px" }}
          />
          <h2 style={{ color: "#0f172a", marginBottom: "10px" }}>
            Commande confirmée !
          </h2>
          <p style={{ color: "#475569", marginBottom: "16px", lineHeight: "1.6" }}>
            Votre commande (N° #{commandesIds.join(", #")}) a été enregistrée. Un
            email de confirmation avec le reçu PDF a été envoyé à votre adresse
            Gmail ainsi qu'au vendeur.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "12px 20px",
                  background: "#dc2626",
                  color: "#fff",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FileDown size={18} /> Télécharger le reçu PDF
              </a>
            )}

            <Link
              to="/"
              style={{
                padding: "12px 24px",
                background: "#0284c7",
                color: "#fff",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          maxWidth: "1080px",
          margin: "30px auto",
          padding: "0 16px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <Link
          to="/carte"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#0284c7",
            textDecoration: "none",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          <ArrowLeft size={18} /> Retour au panier
        </Link>

        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            marginBottom: "24px",
            color: "#0f172a",
          }}
        >
          Finaliser ma commande
        </h1>

        {error && (
          <div
            style={{
              padding: "14px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "10px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <form
            onSubmit={this.handleSubmitPayment}
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: 0,
                color: "#0f172a",
              }}
            >
              <MapPin size={20} color="#dc2626" /> 1. Adresse de livraison
            </h3>

            {adresses.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#475569",
                  }}
                >
                  Mes adresses enregistrées :
                </label>
                <select
                  value={selectedAdresseId}
                  onChange={this.handleSelectAdresse}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  {adresses.map((adr) => (
                    <option key={adr.id} value={adr.id}>
                      {adr.title ? `[${adr.title}] ` : ""}
                      {adr.adresse}, {adr.pays}
                    </option>
                  ))}
                  <option value="custom">+ Saisir une autre adresse</option>
                </select>
              </div>
            )}

            <input
              type="text"
              placeholder="Adresse complète (Rue, Quartier, Ville, Pays...)"
              value={customAdresse}
              onChange={(e) => this.setState({ customAdresse: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                marginBottom: "24px",
                boxSizing: "border-box",
              }}
            />

            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#0f172a",
              }}
            >
              <CreditCard size={20} color="#0284c7" /> 2. Mode de paiement
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => this.setState({ methodePaiement: "carte" })}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  border:
                    methodePaiement === "carte"
                      ? "2px solid #0284c7"
                      : "1px solid #cbd5e1",
                  background: methodePaiement === "carte" ? "#f0f9ff" : "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: "700",
                }}
              >
                <CreditCard size={18} /> Carte Bancaire
              </button>

              <button
                type="button"
                onClick={() => this.setState({ methodePaiement: "livraison" })}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  border:
                    methodePaiement === "livraison"
                      ? "2px solid #16a34a"
                      : "1px solid #cbd5e1",
                  background:
                    methodePaiement === "livraison" ? "#f0fdf4" : "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: "700",
                }}
              >
                <Truck size={18} /> Paiement à la livraison
              </button>
            </div>

            {methodePaiement === "carte" && (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "18px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "20px",
                }}
              >
                {cartes.length > 0 && (
                  <div style={{ marginBottom: "14px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#0f172a",
                      }}
                    >
                      Mes cartes bancaires enregistrées :
                    </label>
                    <select
                      value={selectedCarteId}
                      onChange={this.handleSelectCarte}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                      }}
                    >
                      {cartes.map((c) => (
                        <option key={c.id} value={c.id}>
                          **** **** **** {String(c.numC || "").slice(-4)} —{" "}
                          {c.nom} (Exp: {c.dateEx})
                        </option>
                      ))}
                      <option value="new">+ Utiliser une nouvelle carte</option>
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4532 1234 5678 8890"
                    value={numeroCarte}
                    onChange={(e) =>
                      this.setState({ numeroCarte: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Nom du titulaire
                  </label>
                  <input
                    type="text"
                    placeholder="YASSIR CHAKIR"
                    value={nomTitulaire}
                    onChange={(e) =>
                      this.setState({ nomTitulaire: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      Date d'expiration (MM/AA)
                    </label>
                    <input
                      type="text"
                      placeholder="08/29"
                      maxLength={7}
                      value={dateExpiration}
                      onChange={(e) =>
                        this.setState({ dateExpiration: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => this.setState({ cvv: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#94a3b8" : "#0284c7",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ShieldCheck size={20} />
              {loading
                ? "Traitement en cours..."
                : `Confirmer et Payer (${totalAmount.toFixed(2)} DH)`}
            </button>
          </form>

          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>
              Résumé de la commande ({cartItems.length} article
              {cartItems.length > 1 ? "s" : ""})
            </h3>

            {cartItems.length === 0 ? (
              <p style={{ color: "#64748b" }}>Aucun produit dans le panier.</p>
            ) : (
              cartItems.map((item, idx) => {
                const qte = Number(item.quantity || item.quantite || 1);
                const prixUnitaire = Number(item.prix || 0);
                const sub = prixUnitaire * qte;
                return (
                  <div
                    key={item.id || idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 0",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.nom || item.name}
                          style={{
                            width: "52px",
                            height: "52px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>
                          {item.nom || item.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748b" }}>
                          Quantité : {qte} × {prixUnitaire.toFixed(2)} DH
                        </div>
                        {(item.boutique?.nom || item.vendupa) && (
                          <div style={{ fontSize: "12px", color: "#0284c7" }}>
                            Boutique : {item.boutique?.nom || item.vendupa}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ fontWeight: "700", color: "#dc2626" }}>
                      {sub.toFixed(2)} DH
                    </div>
                  </div>
                );
              })
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "18px",
                paddingTop: "14px",
                borderTop: "2px solid #e2e8f0",
                fontSize: "18px",
                fontWeight: "800",
              }}
            >
              <span>Total à payer :</span>
              <span style={{ color: "#dc2626" }}>
                {totalAmount.toFixed(2)} DH
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Checkout;