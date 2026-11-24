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
        user: null,
        categorie: []
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

    componentDidMount(){
        this.handlegetcategorie();
        this.loadUser();
    }

    handlegetcategorie = async () => {
        try{
            const res = await api.get('/categorie');
            this.setState({ categorie: res.data.categorie });
        }catch(err){
            console.log(err);
        }
    }

    loadUser = () => {
        const user =  JSON.parse(localStorage.getItem('user'));
        this.setState({user: user});
        
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
        const { cartCount, cartItems, cartTotal, removeFromCart } = this.context;
        const info = this.state.user;
        return(
            <div className="bar">
                <h2><Link to="/" className="logo"><strong className="sb">Nex</strong>Market</Link></h2>
                <div className="bar-btn">
                    <Link to="/" className="bar-btn">Accueil</Link>
                    <Link to="/shop" className="bar-btn">Boutique</Link>
                    <div className="dropdown">
                        <a className="dopdownbtn bar-btn categorie">Categorie <FaChevronDown size={12} /></a>
                        <div className="dropdown-content">
                            {this.state.categorie.map((c,index) => {
                                return (
                                    <Link key={c.id || index} to={`/categorie/${c.nom}`}>{c.nom}</Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
                
                <div className="icons">
                    
                    {connected && 
                        <div>
                            <div className="cart-container cart-dropdown-wrapper">
                                <a className="Shopicon"><CiShoppingCart /></a>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                <div className="cart-dropdown-content" style={{ minWidth: '320px', textAlign: 'left' }}>
                                    {cartItems.length === 0 ? (
                                        <p style={{ textAlign: 'center', padding: '15px', margin: 0 }}>Votre panier est vide</p>
                                    ) : (
                                        <div>
                                            <div className="cart-items-list">
                                                {cartItems.map((item, index) => {
                                                    const qty = Number(item.quantity) || 1;
                                                    const subTotal = (Number(item.prix) || 0) * qty;
                                                    return (
                                                        <div key={item.id || index} className="cart-mini-item">
                                                            <img src={item.image} alt={item.name} className="cart-mini-img" style={{ width: '54px', height: '54px', objectFit: 'contain',  background: '#f8fafc',  border: '1px solid #e2e8f0', borderRadius: '8px', flexShrink: 0, }} />
                                                            <div className="cart-mini-info" style={{ flex: 1, minWidth: 0 }}>
                                                                <h4 style={{  margin: 0,  fontSize: '14px',  whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis',  }} >
                                                                    {item.name}
                                                                </h4>
                                                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 'normal' }}>
                                                                    {item.prix} DH × <strong style={{ color: '#0f172a' }}>{qty}</strong>
                                                                </p>
                                                                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#dc2626', fontWeight: '700' }}>
                                                                    {subTotal.toFixed(2)} DH
                                                                </p>
                                                            </div>
                                                            <button className="btn-remove-item"  onClick={() => removeFromCart(index)}  title="Retirer du panier"  >
                                                                ✖
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between',  alignItems: 'center', padding: '10px 4px',  marginTop: '8px',  borderTop: '1px solid #e2e8f0',  fontWeight: 'bold', fontSize: '15px',  color: '#0f172a',  }} >
                                                <span>Total :</span>
                                                <span style={{ color: '#dc2626' }}>{cartTotal.toFixed(2)} DH</span>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                                <button onClick={() => navigate("/Component/Carte")} className="btn-aller-panier">
                                                    Voir le panier
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