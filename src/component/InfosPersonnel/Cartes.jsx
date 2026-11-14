import { Component } from "react";
import Cartese from '../../data/mescartes.json'
import { FaPen } from "react-icons/fa";
import Formatcar from "./Formaddcart";


class Cartes extends Component{
    constructor(props){
        super(props);
        this.state = {
            mescart: Cartese,
            current: "mescarte",
            iscardoopen: false,
            editIndex: undefined,
            a: null
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

    handleModifier = () => {
        if (this.state.a && this.state.editIndex !== null) {
            this.saveChange(this.state.a, this.state.editIndex); 
            this.setState({ iscardoopen: false, a: null, editIndex: null }); 
        }
    };

    deletecar = (index) => {
        this.setState((prevState) => {
            const updatea = [...prevState.mescart];
            updatea.splice(index,1);
            return {mescart: updatea};
        })
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
                                <input type="text" value={this.state.a?.nomC || ''} placeholder="nomC" className="input" onChange={(e) => { this.modifier(e, "nomC") }} />
                                <input type="text" value={this.state.a?.numC || ''} placeholder="numC" className="input" onChange={(e) => { this.modifier(e, "numC") }} />
                                <input type="text" value={this.state.a?.DateE || ''} placeholder="DateE" className="input" onChange={(e) => { this.modifier(e, "DateE") }} />
                                <input type="text" value={this.state.a?.CVV || ''} placeholder="CVV" className="input" onChange={(e) => { this.modifier(e, "CVV") }} />
                                <button className="btnmodif" onClick={this.handleModifier}>Modifier</button> 
                                <button className="btnferm" onClick={() => {this.togllecard(null, undefined)}}>Fermer</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="container-mespr" >
                    {this.state.current === "mescarte" && 
                    this.state.mescart.map((mesp,index) => {
                        return(
                            <div className="carts"  key={index}>
                                <div className="cart">
                                    <div style={{textAlign: 'center',alignItems: 'center',width: '100%'}}>
                                    <h3 >{mesp.nomC}</h3>
                                        <h4 >{mesp.numC}</h4>
                                        <p >{mesp.DateE}</p>  
                                    </div> 
                                </div>
                                <div className="cart-btn">
                                    <button className="btn btn-modifier" onClick={() => {this.togllecard(mesp,index)}}><FaPen/> Editer</button>
                                    <button className="btn btn-supprimer" onClick={() => {this.deletecar(index)}}> Supprimer La carte</button>
                                </div>
                            </div>
                        )
                    })}
                    
                    
                </div>
                {this.state.mescart.length === 0 && <h2 style={{textAlign: 'center'}}>Aucun Cartes existes</h2>}
                {this.state.current === "addc" && 
                    <Formatcar />
                }
            </div>
        )
    }
}

export default Cartes;