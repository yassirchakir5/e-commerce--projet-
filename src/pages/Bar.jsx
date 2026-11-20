import { Component } from "react";
import '../assets/Bar.css';
import { FaUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import {  Navigate, useNavigate } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import api from "../api/api";

function withRouter(Component){
    return(props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Bar extends Component{
    state = {
        redirecte: false,
        user: null
    };
    handlelogout = async () => {
        try{
            await api.post('/logout');
        }catch(err){
            console.log('token deja deleted');
        }finally{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.setItem('login','false');
            this.props.setconnected(false);
            this.setState({ redirecte: true});
        }
    };
    loadUser = () => {
        const user =  JSON.parse(localStorage.getItem('user'));
        this.setState({user: user});
        
    }
    componentDidMount(){
        this.loadUser();
    }
    componentDidUpdate(prevProps){
        if(prevProps.connected !== this.props.connected){
            this.loadUser();
        }
    }
    static contextType = CartContext;
    render(){
        if(this.state.redirecte){
            <Navigate to="/login"/>
        }
        const {connected,navigate} = this.props;
        const { cartCount,cartItems, removeFromCart } = this.context;
        const info = this.state.user;
        return(
            <div className="bar">
                <h2><Link to="/" className="logo"><strong className="sb">E</strong>-commerce</Link></h2>
                <div className="bar-btn">
                    <Link to="/" className="bar-btn">Home</Link>
                    <Link to="/shop" className="bar-btn">Boutique</Link>
                    <div className="dropdown">
                        <a className="dopdownbtn bar-btn categorie">Categorie <FaChevronDown size={12} /></a>
                        <div className="dropdown-content">
                            <h3>Electronique</h3>
                            <Link to="/categorie/telephone">Phones</Link>
                            <Link to="/categorie/Computer">Computer</Link>
                            <Link to="/categorie/Casques">Casques</Link>
                            <h3>Vétements</h3>
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
                                            <div style={{display: 'flex',justifyContent: 'space-between',gap: '10px'}}>
                                                <button onClick={() => navigate("/Component/Carte")} className="btn-aller-panier">
                                                Voir le panier
                                            </button>
                                            <button  className="btn-aller-panier">
                                                Payer
                                            </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="profile">
                                <a className="Usericon"><FaUser /></a>
                                <div className="profile-down">
                                    <img src={this.state.user?.path_img_profile ? encodeURI(`http://127.0.0.1:8000/storage/${this.state.user.path_img_profile}`) : 'http://127.0.0.1:8000/storage/profiles/default.png'} className="img-pro"/>
                                    <h2>{info?.name} {info?.prenom}</h2>
                                    <Link to="/infos">Information Personnel</Link>
                                    <Link to="/dashboard">Dashboard</Link>
                                    <Link to={`/boutiques`}>Mes Boutiques</Link>
                                    <button onClick={this.handlelogout} className="btn-deco">Déconnexion</button>
                                </div>
                            </div>
                        </div>
                    }
                    {connected === false &&
                        <div className="in">
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

