import { Component } from "react";
import Cartese from '../../data/mescartes.json'
import { FaPen } from "react-icons/fa";
import Formatcar from "./Formaddcart";


class Cartes extends Component{
    constructor(props){
        super(props);
        this.state = {
            current: "mescarte"
        }
    }

    setcurrent = () => {
        this.setState({
            current: this.state.current === "mescarte" ? "addc" : "mescarte"
        })
    }
    render(){
        return(
            <div className="mespr">
                <h1 style={{textAlign: 'center'}}>Mes Cartes</h1>
                <div className="cart-btn">
                    {this.state.current === "mescarte" ? <button id="btn-cart" style={{width: "250px"}} onClick={this.setcurrent}>Ajouter une nouvelle Carte</button> : <button id="btn-cart"  onClick={this.setcurrent}> &lt; Retour</button>}
                </div>
                <div className="container-mespr" >
                    {this.state.current === "mescarte" && 
                    Cartese.map((mesp,index) => {
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
                                    <button className="btn btn-modifier"><FaPen/> Editer</button>
                                    <button className="btn btn-supprimer"> Supprimer La carte</button>
                                </div>
                            </div>
                        )
                    })}
                    
                </div>
                {this.state.current === "addc" && 
                    <Formatcar />
                }
            </div>
        )
    }
}

export default Cartes;