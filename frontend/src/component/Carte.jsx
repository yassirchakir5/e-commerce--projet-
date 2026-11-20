import { Component } from "react";
import { Star } from 'lucide-react';
import { Store } from "lucide-react";
import { Heart } from "lucide-react";
import { CartContext } from "../context/CartContext"; 
import { Link } from "react-router-dom";

class Carte extends Component{
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
        const { cartCount,cartItems, removeFromCart } = this.context;
        
        return(
            <div style={{textAlign: 'center'}}>
                <div className="carts-dern" style={{textAlign: 'center'}}>
                    <h2 className="msg-vide" style={{color: 'black'}}>Nombre produit dans le panier est : {cartCount}</h2>
                    {cartItems.map((p,index) => {
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
                                    <Link to={`/product/${p.id}`} className="btn-detail">
                                        Détails
                                    </Link>
                                    <button style={{backgroundColor: 'red'}} className="btn-detail" onClick={() => {removeFromCart(index)}}>Supprimer</button>
                                </div>
                                <div className="vendu">
                                    <Store /> &nbsp;&nbsp;
                                    <p >Vendu par : {p.vendupa}</p>
                                </div>
                            </div>
                        )
                    })}
                    {cartItems.length === 0 && <h3 className="msg-vide">Aucun produit existe dans le panier </h3>}
                </div>
                {cartItems.length !== 0 && <button style={{width: '80%'}} className="btn-detail">Payer</button>}
            </div>
        )
    }
}

export default Carte;