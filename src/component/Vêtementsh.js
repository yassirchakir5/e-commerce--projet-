import { Component } from "react";
import { Store } from "lucide-react";
import { Star } from "lucide-react";
import { Heart } from "lucide-react";
import { CartContext } from "../context/CartContext";

class Vêtementsh extends Component{
    static contextType = CartContext;
    constructor(props){
        super(props);
        this.state = {
            search: "",
            sorto: "datep"
        }
    }

    setsearch = (e) => {
        this.setState({
            search: e.target.value
        })
    }
    
    setsort = (e) => {
        this.setState({
            sorto: e.target.value
        });
    }
    render(){
        const { addToCart } = this.context;
        const product = this.props.product.filter((p) => {
            return p.genre === "Homme"
        })

        const filterpro = product.filter((fil) => {
            const lowersear = this.state.search.toLowerCase();
            return fil.name.toLowerCase().includes(lowersear);
        })
        const { sorto } = this.state;

        if(sorto === "prixcr"){
            filterpro.sort((a, b) => a.prix - b.prix)
        }else if(sorto === "prixdecr"){
            filterpro.sort((a,b) => b.prix - a.prix)
        }else if(sorto === "datep"){
            filterpro.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        return(
            <div>
                <div className="input-searc">
                    <select onChange={this.setsort} className="sele-sort">
                        <option value="datep">Date publication</option>
                        <option value="prixcr">prix croissant</option>
                        <option value="prixdecr">prix decroissant</option>
                    </select>
                    <input type="text" placeholder="Search" className="input-sea" onChange={this.setsearch}/>
                </div>
                <div className="carts-dern">
                    {filterpro.map((p,index) => {
                            return(
                                <div className="carts-der" key={index}>
                                    <div className="image-container">
                                        <img src={p.image}/>
                                        <button className="heart-btn" > 
                                            <Heart className="heart"/>
                                        </button>
                                    </div>
                                    <h3>{p.name}</h3>
                                    <div className="stars">
                                        <Star className="st" />
                                        <p>{p.stars} ({p.countst})</p>
                                    </div>
                                    <h4><span className="span-pri"> {p.prix} </span> DH</h4>
                                    <div style={{display: 'flex',justifyContent: 'space-between'}}>
                                        <button  className="btn-ajout" onClick={() => {addToCart(p)}}>Ajouter au panier</button>
                                        <button  className="btn-ajout">Détails</button>
                                    </div>
                                    <div className="vendu">
                                        <Store /> &nbsp;&nbsp;
                                        <p >Vendu par : {p.vendupa}</p>
                                    </div>
                                </div>
                            )
                        })}
                        {filterpro.length === 0 && <h3 className="msg-vide">Aucun produit existe avec cette nom</h3>}
                </div>
            </div>
        )
    }
}

export default Vêtementsh;