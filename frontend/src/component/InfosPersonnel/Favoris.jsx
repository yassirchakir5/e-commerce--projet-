import { Component } from "react";
import Favori from '../../data/favorite.json';
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext"; 
import { Heart } from "lucide-react";
import { Star } from "lucide-react";
import { Store } from "lucide-react";

class Favoris extends Component{
    static contextType = CartContext;
    constructor(props){
        super(props);
        this.state = {
            mesfav: Favori
        }
    }
    supprif = (indexs) => {
        const nouvf = this.state.mesfav.filter((_,index) => index !== indexs);

        this.setState({
            mesfav: nouvf
        });
    };

    render(){
        const { addToCart } = this.context;
        return(
            <div className="az">
                <h1 style={{textAlign: 'center'}}>Mes favoris</h1>
                <div className="carts-dern" >
                    {this.state.mesfav.map((fa,index) => {
                        return (
                        <div className="carts-der" key={index}>
                                <div className="image-container">
                                    <img src={fa.image}/>
                                </div>
                                <h2 className={`badge-statut ${fa.status}`} style={{textAlign: 'center'}}>{fa.status}</h2>

                                <h3>{fa.name}</h3>
                                <div className="stars">
                                    <Star className="st" />
                                    <p>{fa.stars} ({fa.countst})</p>
                                </div>
                                <h4><span className="span-pri"> {fa.prix} </span> DH</h4>
                                <div style={{display: 'flex',justifyContent: 'space-between'}}>
                                    <button  className="btn-ajout" onClick={() => {addToCart(fa)}}>Ajouter au panier</button>
                                    <Link to={`/product/${fa.id}`} className="btn-detail">
                                            Détails
                                        </Link>
                                </div>
                                <div className="vendu">
                                    <Store /> &nbsp;
                                    Vendu par :  <Link to={`/profile/${fa.vendupa}`}><strong>{fa.vendupa}</strong></Link>
                                </div>
                            </div>)
                    })}
                </div>
                {Favori.length === 0 && <p className="aze">Aucun favoris available</p>}
            </div>
        )
    }
}

export default Favoris;