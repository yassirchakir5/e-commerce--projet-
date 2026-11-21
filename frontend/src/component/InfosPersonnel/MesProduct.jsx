import { Component } from "react";
import FormAddProduct from "./FormAddProduct";
import api from "../../api/api";
import FormModifierProduct from "./FormModifierProduct";
import Swal from "sweetalert2";

class Mesproduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mesproduct: [], 
            search: "",
            current: "mesprod",
            nomp: "",
            prixp: "",
            descp: "",
            stockp: "",
            editIndex: null,
            categorie: "",
            status: "",
            selectedproduit: null
        };
    }

    componentDidMount() {
        this.handleafficher();
    }

    handleafficher = async () => {
        try {
            const res = await api.get('/produit/afficher');
            if (res.data.produits) {
                this.setState({ mesproduct: res.data.produits });
            }
        } catch (err) {
            console.log(err);
        }
    }

    supprimerpro = async (index) => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Cette action est irréversible ! Votre compte et toutes vos données seront définitivement supprimés.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",   
            cancelButtonColor: "#3085d6",  
            confirmButtonText: "Oui, supprimer mon compte",
            cancelButtonText: "Annuler",
        });
        if(result.isConfirmed){
            try{
                const res = await api.delete(`/produit/delete/${index}`);
                await Swal.fire("Succès!", "Le produit a été supprimer avec succès", "success");
                this.handleafficher();
            }catch(err){
                console.log(err);
            }
        }

    }

    setsear = (e) => {
        this.setState({ search: e.target.value });
    }

    setselectprod = (mespr) => {
        this.setState({
            selectedproduit: mespr,
            current: "modifpro"
        });
    }

    updatestatus = async (index, newstatus) => {
        try{
            const res = await api.put(`/produit/modifierstatus/${index}`,{
                'status': newstatus
            });
            await Swal.fire("Succès!", `Le produit est maintenant ${newstatus}`, "success");
            this.handleafficher();
        }catch(err){
            console.log(err);            
        }
    }

    setcourant = () => {
        this.setState({ current: "mesprod" });
        this.handleafficher();
    }

    getProductImage = (mesp) => {
        if (mesp.images && mesp.images.length > 0) {
            const mainImg = mesp.images.find(img => img.is_main === 1 || img.is_main === true) || mesp.images[0];
            return `http://127.0.0.1:8000/storage/${mainImg.path}`;
        } 
    }

    render() {
        const filtrerproduc = (this.state.mesproduct || []).filter((mespr) => {
            const lowersearch = this.state.search.toLowerCase();
            const productName = (mespr.nom || "").toLowerCase();
            return productName.includes(lowersearch);
        });

        return (
            <div className="mespr">
                <h1 style={{ textAlign: 'center' }}>Mes Products</h1>
                <div className="input-search">
                    {this.state.current === "mesprod" ? (
                        <button id="btn-prod" style={{ width: '250px' }} onClick={() => {this.setState({ current: "addpro" })}}>
                            Add product
                        </button>
                    ) : (
                        <button id="btn-prod" onClick={() => this.setState({ current: "mesprod" })}>
                            Retour
                        </button>
                    )}
                    <h4>Nombre de produit : {this.state.mesproduct.length}</h4>
                    {this.state.current === "mesprod" && (
                        <input
                            type="text"
                            placeholder="Search product"
                            style={{ marginRight: '20px', height: '20px', width: '200px' }}
                            onChange={this.setsear}
                        />
                    )}
                </div>

                {this.state.current === "mesprod" && (
                    <>
                        <div className="container-mespr">
                            {filtrerproduc.map((mesp, index) => {
                                const status = (mesp.status || "disponible").toLowerCase();

                                return (
                                    <div className="carts" key={mesp.id || index}>
                                        <div className="cart">
                                            <div>
                                                <img src={this.getProductImage(mesp)} alt={mesp.nom} />
                                            </div>
                                            <div>
                                                <h3 className={`badge-statut ${status}`}>{status}</h3>
                                                <h3 className="detail">{mesp.nom}</h3>
                                                <h3 className="detail">
                                                    Stock : <span style={{ color: 'red', fontSize: '25px' }}>{mesp.stock}</span>
                                                </h3>
                                                <div className="detail">
                                                    <span className="label">Prix : </span>
                                                    <span className="valeur prix">{mesp.prix} DH</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cart-btn">
                                            {status === "disponible" && (
                                                <>
                                                    <button className="btn btn-modifier" onClick={() => {this.setselectprod(mesp)}}>modifier</button>
                                                    <button className="btn btn-revision" onClick={() => this.updatestatus(mesp.id, "En-révision")}>Révision</button>
                                                    <button className="btn" onClick={() => this.updatestatus(mesp.id, "Vendue")}>Vendre</button>
                                                </>
                                            )}
                                            {status === "en-révision" && (
                                                <>
                                                    <button className="btn btn-modifier" onClick={() => {this.setselectprod(mesp)}}>modifier</button>
                                                    <button className="btn btn-disponible" onClick={() => this.updatestatus(mesp.id, "disponible")}>Disponible</button>
                                                    <button className="btn" onClick={() => this.updatestatus(mesp.id, "Vendue")}>Vendre</button>
                                                </>
                                            )}
                                            {status === "vendue" && (
                                                <button className="btn btn-modifier" onClick={() => {this.setselectprod(mesp)}}>modifier</button>
                                            )}
                                            <button className="btn btn-supprimer" onClick={() => this.supprimerpro(mesp.id)}>Supprimer</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {filtrerproduc.length === 0 && <h4 className="aucunp">Aucun produit publié</h4>}
                    </>
                )}

                {this.state.current === "addpro" && (
                    <div>
                        <FormAddProduct setcourant={this.setcourant}/>
                    </div>
                )}
                {this.state.current === "modifpro" && (
                    <div>
                        <FormModifierProduct setcourant={this.setcourant} produit={this.state.selectedproduit} />
                    </div>
                )}
            </div>
        );
    }
}

export default Mesproduct;