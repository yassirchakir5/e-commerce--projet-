import { Component } from "react";
import "./MaBoutique.css";
import api from "../../api/api";
import Swal from "sweetalert2";
import Formajoutboutique from "../../component/MesBoutiques/Fomrajoutboutique";
import ChekingVendeur from "../../component/MesBoutiques/ChekingVendeur";
import FilteredBoutiques from "../../component/MesBoutiques/filteredBoutiques";
import GérerMaBoutique from "../../component/MesBoutiques/Maboutique";

const showAlert = () => {
  Swal.fire({
    title: "Demande envoyée",
    text: "Votre demande pour devenir vendeur a été sauvegardée avec succès",
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "#007bff",
  });
};

class MaBoutique extends Component {
  constructor(props) {
    super(props);
    this.state = { boutiques: [], search: "", filterType: "all", checkingVendeur: true,
      loading: false, vendeur: null, currentPage: "", nom: "", desc: "",
      ville: "", email: "", numtel: "", categorie: null, logo_boutique: null,
      selectedBoutiqueId: null, nomBoutique: "", description: "", telephone: "",
      isOpen: false, savedMessage: false, message: "", myProducts: [],
      errors: {}, errormessage: ""
    };
  }

  handleproduitboutique = async () => {
    
  }

  checkvendeur = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ checkingVendeur: false });
      return;
    }

    try {
      const res = await api.get("/vendeur/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.existe) {
        this.setState({ vendeur: res.data, checkingVendeur: false });
      } else {
        this.setState({ vendeur: null, checkingVendeur: false });
      }
    } catch (err) {
      console.error("Erreur checkvendeur:", err);
      this.setState({ checkingVendeur: false });
    }
  };

  componentDidMount() {
    this.checkvendeur();
    this.handleafficher();
    this.handleproduitboutique();
  }

  handleChange = (e) => {
  if (e.target.type === "file") {
    this.setState({ [e.target.name]: e.target.files[0] });
  } else if (e.target.type === "checkbox") {
    this.setState({ [e.target.name]: e.target.checked });
  } else {
    this.setState({ [e.target.name]: e.target.value });
  }
};

  handleafficher = async () => {
    try {
      const res = await api.get("/boutique");
      const list = res.data.boutiques || res.data || [];
      this.setState({ boutiques: Array.isArray(list) ? list : [] });
    } catch (err) {
      console.error("Erreur affichage boutiques:", err);
    }
  };

  handlesubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formdata = new FormData();
    formdata.append("nom", this.state.nom);
    formdata.append("desc", this.state.desc);
    formdata.append("ville", this.state.ville);
    formdata.append("email", this.state.email);
    formdata.append("numtel", this.state.numtel);
    formdata.append(
      "categorie",
      this.state.categorie ? this.state.categorie.value : ""
    );
    if (this.state.logo_boutique) {
      formdata.append("logo_boutique", this.state.logo_boutique);
    }

    try {
      await api.post("/boutique", formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await Swal.fire("Succès!", "La boutique a été ajoutée avec succès", "success");
      this.handleafficher();
      this.setState({ currentPage: "",  nom: "",
        desc: "", ville: "", email: "",
        numtel: "", categorie: null, logo_boutique: null,
      });
    } catch (err) {
      if(err.response && err.response.data){
        this.setState({
          errors: err.response.data.errors || {},
          errormessage: err.response.data.message || "Erreur de validation"
        });
      }else{
        Swal.fire("Erreur", "Impossible d'ajouter la boutique", "error");
      }
    }
  };

  handlecategoriechange = (selectoption) => {
    this.setState({ categorie: selectoption });
  };

  handledemandevendeur = async () => {
    if (this.state.loading) return;
    this.setState({ loading: true });

    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/vendeur/demande", {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.setState({
        vendeur: { existe: true, status: "en attente", ...res.data },
        loading: false,
      });

      showAlert();
    } catch (err) {
      console.error("Erreur demande:", err);
      this.setState({ loading: false });
    }
  };

  openDetails = async (boutique) => {
  const currentStatus = boutique.status_boutique || "ouverte";
  this.setState({
    currentPage: "mesboutiques", selectedBoutiqueId: boutique.id,
    nomBoutique: boutique.nom || "", description: boutique.desc || boutique.description || "",
    telephone: boutique.numtel || boutique.telephone || "", ville: boutique.ville || "",
    isOpen: currentStatus.toLowerCase() === "ouverte", savedMessage: false,
  });
  try{
      const res = await api.get('/boutique/produit/' + boutique.id);
      this.setState({ myProducts: res.data.produit });
    }catch(err){
      console.log(err);
    }
};

  handleSave = async (e) => {
  e.preventDefault();
  const { selectedBoutiqueId, boutiques, nomBoutique, description, telephone, ville, isOpen, } = this.state;
  const statusb = this.state.isOpen ? "Ouverte" : "Fermée";

  try{
    const res = await api.put(`/boutique/modifier/${selectedBoutiqueId}`,{
      nom: nomBoutique, desc: description, status_boutique: statusb, numtel: telephone, ville: ville
    });
  }catch(err){
    console.log(err);
    
    
  }

  const updatedBoutiques = boutiques.map((b) =>
    b.id === selectedBoutiqueId
      ? {
          ...b, nom: nomBoutique, desc: description,
          description: description, numtel: telephone, telephone: telephone,
          ville: ville, status_boutique: isOpen ? "ouverte" : "fermée",
        }
      : b
   );

    localStorage.setItem("mes_boutiques", JSON.stringify(updatedBoutiques));
    this.setState({
      boutiques: updatedBoutiques,
      savedMessage: true,
      message: "✓ Paramètres de la boutique enregistrés avec succès !"
    });

    setTimeout(() => this.setState({ savedMessage: false,currentPage: "" }), 3000);
  };

  handledelete = async () => {
    const { selectedBoutiqueId } = this.state;
    try{
      const res = await api.delete(`/boutique/delete/${selectedBoutiqueId}`);
      this.setState({ 
        message: "✓ La boutique a été supprimer avec succes",
        savedMessage: true 
      });
      
    }catch(err){
      console.log(err);
    }
    setTimeout(() => {this.setState({ savedMessage: false,currentPage: "" })}, 3000);
    setTimeout(() => {this.handleafficher()},2500);
  }

  toggleProductStatus = async (prod, selectedStatus) => {
    const newStatus =
      selectedStatus ||
      ((prod.status || "").toLowerCase() === "disponible" ? "En-révision" : "disponible");

    try {
      await api.put(`/produit/modifierstatus/${prod.id}`, {
        status: newStatus,
      });

      this.setState((prevState) => ({
        myProducts: prevState.myProducts.map((p) =>
          p.id === prod.id ? { ...p, status: newStatus } : p
        ),
      }));
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
    }
  };

  toggleajoutcurrentpag = () => {
    this.setState({ currentPage: "" });
  }

  toggleAjoutForm = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage === "ajoute_boutique" ? "" : "ajoute_boutique",
    }));
  };

  render() {
    const { boutiques, search, filterType, nomBoutique,
      description, telephone, ville, isOpen, savedMessage,
      myProducts, currentPage, } = this.state;

    const filteredBoutiques = boutiques.filter((b) => {
      const nom = (b.nom || "").toLowerCase();
      const desc = (b.description || b.desc || "").toLowerCase();
      const vend = (typeof b.vendeur === "string" ? b.vendeur : b.vendeur?.name || "").toLowerCase();
      const term = (search || "").toLowerCase();

      const matchSearch =
        nom.includes(term) || desc.includes(term) || vend.includes(term);

      const status = (b.status_boutique || "").toLowerCase();
      const isCertifie = b.certifiée === true || b.certifiée === "true";

      if (filterType === "all") return matchSearch;
      if (filterType === "ouverte") return matchSearch && status === "ouverte";
      if (filterType === "certifie") return matchSearch && isCertifie;
      return (
        matchSearch &&
        (b.categorie || "").toLowerCase() === filterType.toLowerCase()
      );
    });

    const dispoCount = myProducts.filter(
      (p) => p.status === "disponible"
    ).length;
    const revCount = myProducts.length - dispoCount;

    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          {!this.state.checkingVendeur && (
            <ChekingVendeur vendeur={this.state.vendeur} currentPage = {this.state.currentPage} loading={this.state.loading}
            handledemandevendeur = {this.handledemandevendeur} toggleAjoutForm = {this.toggleAjoutForm} />
          )}
        </div>

        {currentPage === "ajoute_boutique" && (
          <Formajoutboutique  errorMessage={this.state.errormessage} errors={this.state.errors}
          handlesubmit = {this.handlesubmit} nom = {this.state.nom} handleChange = {this.handleChange} 
          desc = {this.state.desc} numtel = {this.state.numtel} email = {this.state.email}
          ville = {this.state.ville} categorie = {this.state.categorie} handlecategoriechange = {this.handlecategoriechange} />
          )}

        <FilteredBoutiques filteredBoutiques={filteredBoutiques} openDetails={this.openDetails}/>

        {filteredBoutiques.length === 0 && (
          <div className="boutiques-empty">
            <h3>Aucune boutique ne correspond à votre recherche.</h3>
          </div>
        )}

        {currentPage === "mesboutiques" && (
          <GérerMaBoutique toggleajoutcurrentpag={this.toggleajoutcurrentpag}  myProducts={myProducts} 
          dispoCount={dispoCount} revCount={revCount} handleSave={this.handleSave} isOpen={isOpen}
          handleChange={this.handleChange} nomBoutique={nomBoutique} telephone={telephone} ville={ville} description={description} 
          handledelete={this.handledelete} savedMessage={savedMessage} selectedBoutiqueId={this.state.selectedBoutiqueId}
          message={this.state.message} toggleProductStatus={this.toggleProductStatus}/>
        )}
      </div>
    );
  }
}

export default MaBoutique;