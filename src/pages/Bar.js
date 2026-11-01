import { Component } from "react";
import './Bar.css';
import { FaUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import mesinf from "../data/mesinfos.json"
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";


function withRouter(Component){
    return(props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Bar extends Component{
    static contextType = CartContext;
    render(props){
        const {connected,navigate} = this.props;
        const { cartCount,cartItems, removeFromCart } = this.context;
        const info = mesinf;
        return(
            <div className="bar">
                <h2><a href="/" className="logo"><strong className="sb">E</strong>-commerce</a></h2>
                <div className="bar-btn">
                    <Link to="/" className="bar-btn">Home</Link>
                    <div className="dropdown">
                        <a className="dopdownbtn bar-btn categorie">Categorie <FaChevronDown size={12} /></a>
                        <div className="dropdown-content">
                            <h3>Technologie</h3>
                            <Link to="/categorie/telephone">Phones</Link>
                            <Link to="/categorie/Computer">Computer</Link>
                            <Link to="/categorie/Casques">Casques</Link>
                            <Link to="/categorie/Vetements">Vétement</Link>
                        </div>
                    </div>
                </div>
                
                <div className="icons">
                    
                    {connected && 
                        <div>
                            <div className="cart-container cart-dropdown-wrapper">
                                <a className="Shopicon"><CiShoppingCart /></a>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                <div className="cart-dropdown-content">
                                    {cartItems.length === 0 ? (
                                        <p style={{textAlign: 'center', padding: '15px', margin: 0}}>Votre panier est vide</p>
                                    ) : (
                                        <div>
                                            <div className="cart-items-list">
                                                {cartItems.map((item, index) => (
                                                    <div key={index} className="cart-mini-item">
                                                        <img src={item.image} alt={item.name} className="cart-mini-img"/>
                                                        <div className="cart-mini-info">
                                                            <h4>{item.name}</h4>
                                                            <p>{item.prix} DH</p>
                                                        </div>
                                                        <button 
                                                            className="btn-remove-item" 
                                                            onClick={() => removeFromCart(index)}
                                                            title="Retirer du panier"
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => navigate("/cart")} className="btn-aller-panier">
                                                Voir le panier
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="profile">
                                <a className="Usericon"><FaUser /></a>
                                <div className="profile-down">
                                    <img src={info.imgpro} className="img-pro"/>
                                    <h2>{info.name} {info.prenom}</h2>
                                    <Link to="/infos">Information Personnel</Link>
                                    <Link to="/mesproduct">Mes Products</Link>
                                    <Link to="/mesfavoris">Mes Favoris</Link>
                                    <button className="btn-deco">Déconnexion</button>
                                </div>
                            </div>
                        </div>
                    }
                    {connected === false &&
                    
                        <div className="in">
                            <a className="Shopicon"><CiShoppingCart /></a>
                            <button onClick={() => navigate("/login")} className="btn-inscrire">
                                Connect/inscrire
                            </button>
                            
                        </div>
                    }
                    
                </div>
                
            </div>
        );
    }
}

export default withRouter(Bar);

