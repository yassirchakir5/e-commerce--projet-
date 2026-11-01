import { Component } from "react";
import { Star } from 'lucide-react';
import Products from '../data/product.json'
import { Store } from "lucide-react";
import { Heart } from "lucide-react";
import { ChevronDown } from "lucide-react";

class Derrniprodu extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: ""
        }
    }

    setsearch = (e) => {
        this.setState({
            search: e.target.value
        })
    }
    render(){
        const filterpro = Products.filter((fil) => {
            const lowersear = this.state.search.toLowerCase();
            return fil.name.toLowerCase().includes(lowersear);
        })
        return(
            <div>
                <div className="input-searc">
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
                                <button  className="btn-ajout">Ajouter au panier</button>
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

export default Derrniprodu;