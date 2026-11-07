import { Component } from "react";
import { FaPen, FaTrash } from "react-icons/fa"; 

class Mesadr extends Component {
    
    state = {
        iscardajoopen: false,
        iscardopen: false,
        a: null,
        editIndex: null
    };

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

    modifier = (e, field) => {
        const modif = e.target.value;
        this.setState((prevState) => ({
            a: {
                ...prevState.a,
                [field]: modif
            }
        }));
    }

    handleAjouter = () => {
        if (this.state.a) {
            this.props.ajouter(this.state.a); 
            this.setState({ iscardajoopen: false, a: null }); 
        }
    };

    handleModifier = () => {
        if (this.state.a && this.state.editIndex !== null) {
            this.props.modifier(this.state.a, this.state.editIndex); 
            this.setState({ iscardopen: false, a: null, editIndex: null }); 
        }
    };

    render() {
        const { addres, supprimer } = this.props; 

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

                            <div className="cardBody">
                                <input type="text" placeholder="Title" className="input" onChange={(e) => { this.ajouaddre(e, "title") }} />
                                <input type="text" placeholder="addresse" className="input" onChange={(e) => { this.ajouaddre(e, "addresse") }} />
                                <input type="text" placeholder="pays" className="input" onChange={(e) => { this.ajouaddre(e, "pays") }} />
                                <input type="text" placeholder="numéro de téléphone" className="input" onChange={(e) => { this.ajouaddre(e, "numtel") }} />
                                <button className="btnmodif" onClick={this.handleAjouter}>Ajouter</button> 
                                <button className="btnferm" onClick={this.togllecardaj}>Fermer</button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="carts-dern" style={{gridTemplateColumns: 'repeat(2,1fr)'}}>
                    {addres && addres.map((a, index) => {
                        if (!a) return null; 

                        return (
                            <div className="carts-der" style={{textAlign: 'center'}} key={index}>
                                <h3>{a.title}</h3>
                                <p className="pad">{a.addresse}</p>
                                <p className="pad">{a.pays}</p>
                                <p className="pad">{a.numtel}</p>
                                <div style={{display: 'flex',justifyContent: 'space-between'}}>
                                    <button className="btn-ajout" onClick={() => { this.togllecard(a, index) }}><FaPen /> Modifier</button>
                                    <button className="btn-detail" onClick={() => { supprimer(index) }}><FaTrash /> Supprimer</button>
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
                                    <input type="text" value={this.state.a.title || ''} className="input" onChange={(e) => { this.modifier(e, "title") }} />
                                    <input type="text" value={this.state.a.addresse || ''} className="input" onChange={(e) => { this.modifier(e, "addresse") }} />
                                    <input type="text" value={this.state.a.pays || ''} className="input" onChange={(e) => { this.modifier(e, "pays") }} />
                                    <input type="text" value={this.state.a.numtel || ''} className="input" onChange={(e) => { this.modifier(e, "numtel") }} />
                                    <button className="btnmodif" onClick={this.handleModifier}>Modifier</button>
                                    <button className="btnferm" onClick={() => { this.togllecard(null, null) }}>Fermer</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {addres && addres.length === 0 && (
                    <h2>Aucun address available</h2>
                )}
            </div>
        )
    }
}

export default Mesadr;