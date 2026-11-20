import { Component } from "react";
import { FaPen, FaTrash } from "react-icons/fa"; 
import api from '../../api/api';
import Swal from "sweetalert2";

class Mesadr extends Component {
    state = {
        mesadre: [],
        iscardajoopen: false,
        iscardopen: false,
        a: null,
        title: "",
        adresse: "",
        pays: "",
        utilisateur_id: "",
        editIndex: null
    };

    componentDidMount(){
        this.handlemesadre();
    }

    ajouaddre = (e, field) => {
        const newa = e.target.value;
        this.setState((prevState) => ({
            a: {
                ...prevState.a,
                [field]: newa
            }
        }));
    }

    togllecardaj = () => {
        this.setState((prevState) => ({
            iscardajoopen: !prevState.iscardajoopen
        }));
    };

    togllecard = (a, index) => {
        this.setState((prevState) => ({
            iscardopen: !prevState.iscardopen,
            a: a ? { ...a } : null,
            editIndex: index !== undefined ? index : null
        }));
    };


    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value});
    }

    handlemesadre = async () => {
        try{
            const users = localStorage.getItem('user');
            const user = JSON.parse(users);
            const id = user.id;
            const res = await api.get(`/utilisateur/${id}/adresse`);
            this.setState({ mesadre: res.data });
        }catch(err){
            console.log(err);
            
        }
    }

    handleaddre = async (e) => {
        e.preventDefault();

        const user = localStorage.getItem('user');

        const users = JSON.parse(user);

        const formdata = new FormData();
        formdata.append('title',this.state.title);
        formdata.append('adresse',this.state.adresse);
        formdata.append('pays',this.state.pays);
        formdata.append('utilisateur_id', users.id);

        try{
            const res = await api.post('/addadresse',formdata);
            this.setState({ iscardajoopen: false});
            Swal.fire("Succès!", "L'adresse a été ajouter avec succes", "success");
            this.handlemesadre();
        }catch(err){
            console.log(err);
            
        }
    }

    adredelete = async (id) => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer cette adresse ? Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer l'adresse",
            cancelButtonText: "Annuler",
        });

        if(result.isConfirmed){
            try{
                const res = await api.delete(`/adresse/${id}`);
                Swal.fire("Succès!", "L'addresse a été supprimer avec succes", "success");
                this.handlemesadre();
            }catch(err){
                console.log(err);
                
            }
        }
       
    }



    handleModifier = async (a) => {
        try{
            const res = await api.put(`/adresse/${a.id}`, {
                title: a.title,
                adresse: a.adresse,
                pays: a.pays
            });
            this.setState({ iscardopen: false, a: null, editIndex: null });
            Swal.fire("Succès!", "L'adresse a été modifiée avec succès", "success");
            this.handlemesadre();
        }catch(err){
            console.log(err);
            
        }
    };

    render() {

        return (
            <div>
                <h1>Mes Addresses</h1>
                <button className="btnajoa" onClick={this.togllecardaj}>Ajoute une nouvelle addresse</button>
                
                {this.state.iscardajoopen && (
                    <div className="overlay">
                        <div className="card">
                            <div className="carsHeader">
                                <h2 style={{ margin: 0, fontStyle: 'italic', color: '#333' }}>Ajouter une addresse</h2>
                            </div>

                            
                                <form onSubmit={this.handleaddre}>
                            <div className="cardBody">
                                    <input type="text" name="title" placeholder="Title" className="input" onChange={this.handlechange } />
                                    <input type="text" name="adresse" placeholder="addresse" className="input" onChange={this.handlechange} />
                                    <input type="text" name="pays" placeholder="pays" className="input" onChange={this.handlechange} />
                                    <button className="btnmodif" type="submit">Ajouter</button> 
                                </div>
                            </form>
                                <button className="btnferm" onClick={this.togllecardaj}>Fermer</button>
                            
                        </div>
                    </div>
                )}
                
                <div className="carts-dern" style={{gridTemplateColumns: 'repeat(2,1fr)'}}>
                    {this.state.mesadre && this.state.mesadre.map((a, index) => {
                        if (!a) return null; 

                        return (
                            <div className="carts-der" style={{textAlign: 'center'}} key={index}>
                                <h3>{a.title}</h3>
                                <p className="pad">{a.adresse}</p>
                                <p className="pad">{a.pays}</p>
                                <div style={{display: 'flex',justifyContent: 'space-between'}}>
                                    <button className="btn-ajout" onClick={() => { this.togllecard(a, index) }}><FaPen /> Modifier</button>
                                    <button className="btn-detail" onClick={() => { this.adredelete(a.id) }}><FaTrash /> Supprimer</button>
                                </div>
                            </div>
                        )
                    })}

                    {this.state.iscardopen && this.state.a && (
                        <div className="overlay">
                            <div className="card">
                                <div className="carsHeader">
                                    <h2 style={{ margin: 0, fontStyle: 'italic', color: '#333' }}>Modifier L'addresse</h2>
                                </div>

                                <div className="cardBody">
                                    <input type="text" name="title" value={this.state.a.title || ''} className="input" onChange={(e) => {this.setState({a: {...this.state.a,title: e.target.value}})}} />
                                    <input type="text" name="adresse" value={this.state.a.adresse || ''} className="input" onChange={(e) => {this.setState({a: {...this.state.a,adresse: e.target.value}})}} />
                                    <input type="text" name="pays" value={this.state.a.pays || ''} className="input" onChange={(e) => {this.setState({a: {...this.state.a,pays: e.target.value}})}} />
                                    <button className="btnmodif" onClick={() => {this.handleModifier(this.state.a)}}>Modifier</button>
                                    <button className="btnferm" onClick={() => { this.togllecard(null, null) }}>Fermer</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {this.state.mesadre.length === 0 && (
                    <h2>Aucun address available</h2>
                )}
            </div>
        )
    }
}

export default Mesadr;