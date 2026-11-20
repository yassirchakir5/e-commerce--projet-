import { Component } from "react";
import { FaPen } from "react-icons/fa";
import Formatcar from "./Formaddcart";
import api from '../../api/api';
import Swal from "sweetalert2";

class Cartes extends Component{
    constructor(props){
        super(props);
        this.state = {
            mescart: [],
            current: "mescarte",
            iscardoopen: false,
            editIndex: undefined,
            a: null,
            nom: "",
            numC: "",
            dateEx: "",
            CVV: "",
            erreurs: {}
        }
    }

    setcurrent = () => {
        this.setState({
            current: this.state.current === "mescarte" ? "addc" : "mescarte"
        })
    }

    togllecard = (a, index) => {
        this.setState((prevState) => ({
            iscardoopen: !prevState.iscardoopen,
            a: a ? { ...a } : null,
            editIndex: index !== undefined ? index : null
        }));
    };
    componentDidMount(){
        this.handleafficherca();
    }
    modifier = (e, field) => {
        const modif = e.target.value;
        this.setState((prevState) => ({
            a: {
                ...prevState.a,
                [field]: modif
            }
        }));
    }
    saveChange = (carteModifiee, index) => {
        this.setState((prevState) => {
            const updatea = [...prevState.mescart];
            if (index !== null && index !== undefined) {
                updatea[index] = carteModifiee;
            }
            return {
                mescart: updatea
            };
        });
    } 

    handleadd = (e) =>{
        this.setState({ [e.target.name]: e.target.value });
    }

    handlesubmit = async (e) => {
        e.preventDefault();
        this.setState({ erreurs: {} });
       try{
            const formdata = new FormData();
            formdata.append('nom', this.state.nom);
            formdata.append('numC', this.state.numC);
            formdata.append('dateEx', this.state.dateEx);
            formdata.append('CVV', this.state.CVV);
            const res = await api.post('/carte/add',formdata);
            Swal.fire("Succès!", "La cartes a été ajouter avec succés.", "success");
            this.handleafficherca();
            this.setState({ current:  "mescarte"});
       }catch(err){
            if(err.response && err.response.status === 422){
                this.setState({ erreurs: err.response.data.errors });
            }else{
                console.log(err);
                
            }
       }
    }

    handleModifier = async (e) => {
        e.preventDefault();
        try{
            const res = api.put(`/carte/modifier/${this.state.a.id}`,this.state.a);
            this.handleafficherca();
            Swal.fire("Succès!", "La cartes a été modifier avec succés.", "success");
            this.setState({ iscardoopen: !this.state.iscardoopen });
        }catch(err){
            console.log(err);
        }
    };

    handleafficherca = async () => {
        try{
            const res = await api.get('/carte');
            this.setState({ mescart: res.data.cartes });
        }catch(err){
            console.log(err);
        }
    }

    deletecar = async (id) => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer cette carte ? Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer la carte",
            cancelButtonText: "Annuler",
        });

        if(result.isConfirmed){
             try{
                const res = await api.delete(`/carte/delete/${id}`);
                this.handleafficherca();
                Swal.fire("Succès!", "La cartes a été supprimer avec succés.", "success");
            }catch(err){
                console.log(err);
            }
        }
       
    }



    render(){
        return(
            <div className="mespr">
                <h1 style={{textAlign: 'center'}}>Mes Cartes</h1>
                <div className="cart-btn">
                    {this.state.current === "mescarte" ? <button id="btn-cart" style={{width: "250px"}} onClick={this.setcurrent}>Ajouter une nouvelle Carte</button> : <button id="btn-cart"  onClick={this.setcurrent}> &lt; Retour</button>}
                </div>
                {this.state.iscardoopen && (
                    <div className="overlay">
                        <div className="card">
                            <div className="carsHeader">
                                <h2 style={{ margin: 0, fontStyle: 'italic', color: '#333' }}>Modifier Les infos de carte</h2>
                            </div>

                            <div className="cardBody">
                                <input type="text" value={this.state.a.nom || ''} placeholder="nomC" className="input" onChange={(e) => { this.modifier(e, "nom") }} />
                                <input type="text" value={this.state.a.numC || ''} placeholder="numC" className="input" onChange={(e) => { this.modifier(e, "numC") }} />
                                <input type="text" value={this.state.a.dateEx || ''} placeholder="DateE" className="input" onChange={(e) => { this.modifier(e, "dateEx") }} />
                                <input type="text" value={this.state.a.CVV || ''} placeholder="CVV" className="input" onChange={(e) => { this.modifier(e, "CVV") }} />
                                <button className="btnmodif" onClick={this.handleModifier}>Modifier</button> 
                                <button className="btnferm" onClick={() => {this.togllecard(null, undefined)}}>Fermer</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="container-mespr" >
                    {this.state.current === "mescarte" && this.state.mescart &&
                    this.state.mescart.map((mesp,index) => {
                        return(
                            <div className="carts"  key={index}>
                                <div className="cart">
                                    <div style={{textAlign: 'center',alignItems: 'center',width: '100%'}}>
                                    <h3 >{mesp.nom}</h3>
                                        <h4 >{mesp.numC}</h4>
                                        <p >{mesp.dateEx}</p>  
                                    </div> 
                                </div>
                                <div className="cart-btn">
                                    <button className="btn btn-modifier" onClick={() => {this.togllecard(mesp,index)}}><FaPen/> Editer</button>
                                    <button className="btn btn-supprimer" onClick={() => {this.deletecar(mesp.id)}}> Supprimer La carte</button>
                                </div>
                            </div>
                        )
                    })}
                    
                    
                </div>
                {this.state.mescart.length === 0 && <h2 style={{textAlign: 'center'}}>Aucun Cartes existes</h2>}
                {this.state.current === "addc" && 
                    <Formatcar handlechange={this.handleadd} handlesubmit={this.handlesubmit} erreurs={this.state.erreurs}/>
                }
            </div>
        )
    }
}

export default Cartes;