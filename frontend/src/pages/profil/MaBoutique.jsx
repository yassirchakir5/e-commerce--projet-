import { Component } from "react";
import Swal from "sweetalert2";
import api from "../../api/api";
import ChekingVendeur from "../../component/MesBoutiques/ChekingVendeur";
import FilteredBoutiques from "../../component/MesBoutiques/filteredBoutiques";
import Formajoutboutique from "../../component/MesBoutiques/Fomrajoutboutique";
import GérerMaBoutique from "../../component/MesBoutiques/Maboutique";
import "../../assets/MaBoutique.css";

class MaBoutique extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendeur: null,
      checkingVendeur: true,
      boutiques: [],
      allProducts: [],
      search: "",
      currentPage: "liste",
      loading: false,

      nom: "",
      desc: "",
      numtel: "",
      email: "",
      ville: "",
      horaire: "",
      categorie: null,
      logo_boutique: null,
      errors: {},
      errorMessage: "",

      selectedBoutiqueId: null,
      nomBoutique: "",
      telephone: "",
      description: "",
      isOpen: false,
      savedMessage: false,
      message: "",
    };
  }

  componentDidMount() {
    this.checkvendeur();
    this.handleafficher();
    this.fetchMyProducts();
  }

  getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  };

  checkvendeur = async () => {
    this.setState({ checkingVendeur: true });
    try {
      const res = await api.get("/vendeur/me", {
        headers: this.getAuthHeaders(),
      });
      this.setState({ vendeur: res.data.vendeur || res.data || null });
    } catch (err) {
      if (err.response?.status === 404) {
        this.setState({ vendeur: null });
      } else {
        console.error("Erreur checkvendeur:", err);
      }
    } finally {
      this.setState({ checkingVendeur: false });
    }
  };

  handledemandevendeur = async () => {
    this.setState({ loading: true });
    try {
      const res = await api.get("/vendeur/demande", {
        headers: this.getAuthHeaders(),
      });
      this.setState({
        vendeur: res.data.vendeur || res.data,
        loading: false,
      });
    } catch (err) {
      console.error("Erreur demande vendeur:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: err.response?.data?.message || "Erreur lors de l'envoi de la demande.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
      this.setState({ loading: false });
    }
  };

  handleafficher = async () => {
    try {
      const res = await api.get("/boutique", {
        headers: this.getAuthHeaders(),
      });
      this.setState({ boutiques: res.data.boutiques || [] });
    } catch (err) {
      console.error("Erreur affichage boutiques:", err);
      this.setState({ boutiques: [] });
    }
  };

  fetchMyProducts = async () => {
    try {
      const res = await api.get("/produit/afficher", {
        headers: this.getAuthHeaders(),
      });
      const list = res.data.produit || res.data.produits || [];
      this.setState({ allProducts: Array.isArray(list) ? list : [] });
    } catch (err) {
      if (err.response?.status === 404) {
        this.setState({ allProducts: [] });
      } else {
        console.error("Erreur produits:", err);
      }
    }
  };

  toggleAjoutForm = () => {
    this.setState((prev) => ({
      currentPage: prev.currentPage === "ajoute_boutique" ? "liste" : "ajoute_boutique",
      errors: {},
      errorMessage: "",
      horaire: "",
    }));
  };

  toggleajoutcurrentpag = () => {
    this.setState({
      currentPage: "liste",
      selectedBoutiqueId: null,
      savedMessage: false,
      message: "",
    });
  };

  handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      this.setState({ [name]: checked });
    } else if (type === "file") {
      this.setState({ [name]: files[0] || null });
    } else {
      this.setState({ [name]: value });
    }
  };

  handlecategoriechange = (selectedOption) => {
    this.setState({ categorie: selectedOption });
  };

  handlesubmit = async (e) => {
    e.preventDefault();
    this.setState({ errors: {}, errorMessage: "" });

    const formData = new FormData();
    formData.append("nom", this.state.nom);
    formData.append("desc", this.state.desc);
    formData.append("numtel", this.state.numtel);
    formData.append("email", this.state.email);
    formData.append("ville", this.state.ville);
    formData.append("horaire", this.state.horaire || "");
    formData.append("categorie", this.state.categorie ? this.state.categorie.value : "");
    if (this.state.logo_boutique) {
      formData.append("logo_boutique", this.state.logo_boutique);
    }

    try {
      await api.post("/boutique", formData, {
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Boutique ajoutée !",
        text: "Votre boutique a été créée avec succès.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0284c7",
      });

      this.setState({
        nom: "",
        desc: "",
        numtel: "",
        email: "",
        ville: "",
        horaire: "",
        categorie: null,
        logo_boutique: null,
        currentPage: "liste",
      });
      this.handleafficher();
    } catch (err) {
      if (err.response?.status === 422) {
        this.setState({
          errors: err.response.data.errors || {},
          errorMessage: err.response.data.message || "Veuillez vérifier les champs.",
        });
      } else {
        this.setState({
          errorMessage: err.response?.data?.message || "Erreur lors de l'ajout de la boutique.",
        });
      }
    }
  };

  openDetails = (b) => {
    this.setState({
      currentPage: "gerer_boutique",
      selectedBoutiqueId: b.id,
      nomBoutique: b.nom || "",
      telephone: b.numtel || "",
      ville: b.ville || "",
      horaire: b.horaire || "",
      description: b.desc || b.description || "",
      isOpen: String(b.status_boutique || "").toLowerCase() === "ouverte",
      savedMessage: false,
      message: "",
    });
  };

  handleSave = async (e) => {
    e.preventDefault();
    const { selectedBoutiqueId, nomBoutique, telephone, ville, horaire, description, isOpen } =
      this.state;

    try {
      const res = await api.put(
        `/boutique/modifier/${selectedBoutiqueId}`,
        {
          nom: nomBoutique,
          numtel: telephone,
          ville: ville,
          horaire: horaire,
          desc: description,
          status_boutique: isOpen ? "Ouverte" : "Fermée",
        },
        { headers: this.getAuthHeaders() }
      );

      this.setState({
        savedMessage: true,
        message: res.data.message || "Modifications enregistrées avec succès !",
      });
      this.handleafficher();
      setTimeout(() => this.setState({ savedMessage: false }), 3000);
    } catch (err) {
      console.error("Erreur modification boutique:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'enregistrement des modifications.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  handledelete = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer cette boutique ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/boutique/delete/${this.state.selectedBoutiqueId}`, {
        headers: this.getAuthHeaders(),
      });

      Swal.fire({
        icon: "success",
        title: "Supprimée !",
        text: "La boutique a été supprimée avec succès.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0284c7",
      });

      this.setState({
        currentPage: "liste",
        selectedBoutiqueId: null,
      });
      this.handleafficher();
    } catch (err) {
      console.error("Erreur suppression boutique:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la suppression de la boutique.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  toggleProductStatus = async (prod, newStatus) => {
    try {
      await api.put(
        `/produit/modifierstatus/${prod.id}`,
        { status: newStatus },
        { headers: this.getAuthHeaders() }
      );
      this.fetchMyProducts();
    } catch (err) {
      console.error("Erreur changement statut produit:", err);
    }
  };

  render() {
    const {
      vendeur,
      checkingVendeur,
      boutiques,
      allProducts,
      search,
      currentPage,
      loading,
      selectedBoutiqueId,
    } = this.state;

    const filteredBoutiques = boutiques
      .filter((b) => (b.nom || "").toLowerCase().includes(search.toLowerCase()))
      .map((b) => ({
        ...b,
        produitsCount: b.produits_count ?? b.produitsCount ?? 0,
      }));

    const myProducts = allProducts.filter(
      (p) => Number(p.id_boutique) === Number(selectedBoutiqueId)
    );
    const dispoCount = myProducts.filter(
      (p) => String(p.status || "").trim().toLowerCase() === "disponible"
    ).length;
    const revCount = myProducts.filter((p) => {
      const s = String(p.status || "").trim().toLowerCase();
      return s === "en-révision" || s === "en-revision" || s === "suspendu";
    }).length;

    return (
      <div className="maboutique-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2 style={{ margin: 0 }}>Mes Boutiques</h2>

          {!checkingVendeur && (
            <ChekingVendeur
              vendeur={vendeur}
              toggleAjoutForm={this.toggleAjoutForm}
              currentPage={currentPage}
              loading={loading}
              handledemandevendeur={this.handledemandevendeur}
            />
          )}
        </div>

        {currentPage === "ajoute_boutique" && (
          <Formajoutboutique
            nom={this.state.nom}
            desc={this.state.desc}
            numtel={this.state.numtel}
            email={this.state.email}
            ville={this.state.ville}
            horaire={this.state.horaire}
            categorie={this.state.categorie}
            errors={this.state.errors}
            errorMessage={this.state.errorMessage}
            handleChange={this.handleChange}
            handlecategoriechange={this.handlecategoriechange}
            handlesubmit={this.handlesubmit}
          />
        )}

        {currentPage === "gerer_boutique" && (
          <GérerMaBoutique
            selectedBoutiqueId={selectedBoutiqueId}
            nomBoutique={this.state.nomBoutique}
            telephone={this.state.telephone}
            ville={this.state.ville}
            horaire={this.state.horaire}
            description={this.state.description}
            isOpen={this.state.isOpen}
            myProducts={myProducts}
            dispoCount={dispoCount}
            revCount={revCount}
            savedMessage={this.state.savedMessage}
            message={this.state.message}
            handleChange={this.handleChange}
            handleSave={this.handleSave}
            handledelete={this.handledelete}
            toggleProductStatus={this.toggleProductStatus}
            toggleajoutcurrentpag={this.toggleajoutcurrentpag}
          />
        )}

        {currentPage === "liste" && (
          <>
            {boutiques.length > 0 && (
              <div style={{ marginBottom: "18px" }}>
                <input
                  type="text"
                  placeholder="Rechercher une boutique..."
                  value={search}
                  onChange={(e) => this.setState({ search: e.target.value })}
                  className="input-sea"
                />
              </div>
            )}

            <FilteredBoutiques
              filteredBoutiques={filteredBoutiques}
              openDetails={this.openDetails}
            />
          </>
        )}
      </div>
    );
  }
}

export default MaBoutique;