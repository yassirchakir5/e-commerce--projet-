import { Component } from "react";
import { Star, Store, Heart, Trash2, Eye } from 'lucide-react';
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../assets/carte.css"

class Carte extends Component {
    static contextType = CartContext;

    constructor(props) {
        super(props);
        this.state = {
            removingIndex: null,
            likedIds: [],
        };
    }

    handleRemoveAnimated = (index) => {
        this.setState({ removingIndex: index });
        setTimeout(() => {
            this.context.removeFromCart(index);
            this.setState({ removingIndex: null });
        }, 260);
    };

    toggleLike = (id) => {
        this.setState((prev) => ({
            likedIds: prev.likedIds.includes(id)
                ? prev.likedIds.filter((item) => item !== id)
                : [...prev.likedIds, id],
        }));
    };

    render() {
        const { cartCount, cartItems, cartTotal, updateQuantity } = this.context;
        const { removingIndex, likedIds } = this.state;

        return (
            <div className="carte-page">
                <h2 className="carte-header">
                    Nombre de produits dans le panier :{' '}
                    <span key={cartCount} className="carte-pop" style={{ color: '#0284c7' }}>
                        {cartCount}
                    </span>
                </h2>

                {cartItems.length === 0 ? (
                    <div style={{ background: '#ffffff', padding: '40px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b', animation: 'cardFadeUp 0.4s ease-out both' }}>
                        <h3>Aucun produit existe dans le panier</h3>
                    </div>
                ) : (
                    <>
                        <div className="carte-grid">
                            {cartItems.map((p, index) => {
                                const qty = Number(p.quantity) || 1;
                                const unitPrice = Number(p.prix) || 0;
                                const lineTotal = unitPrice * qty;
                                const boutiqueName = p.boutique?.nom || p.vendupa || 'Boutique';
                                const isLiked = likedIds.includes(p.id);

                                return (
                                    <div key={p.id || index} className={`carte-card ${removingIndex === index ? 'removing' : ''}`} style={{ animationDelay: `${index * 0.08}s` }}>
                                        <div>
                                            <div className="carte-img-box">
                                                <img src={p.image} alt={p.name || p.nom} />
                                                <button type="button" className="carte-heart-btn" onClick={() => this.toggleLike(p.id)}>
                                                    <Heart size={16} color={isLiked ? '#ef4444' : '#64748b'} fill={isLiked ? '#ef4444' : 'none'} />
                                                </button>
                                            </div>

                                            <h3 style={{ margin: '0 0 6px', fontSize: '17px', color: '#0f172a', textAlign: 'center' }}>
                                                {p.name || p.nom}
                                            </h3>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>
                                                <Star size={15} fill="#facc15" color="#facc15" />
                                                <span>{p.stars || 0} ({p.countst || 0})</span>
                                            </div>

                                            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '800', color: '#dc2626', marginBottom: '10px' }}>
                                                {unitPrice.toFixed(2)} DH
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                                                <button type="button" className="carte-qty-btn" onClick={() => updateQuantity(index, qty - 1)} disabled={qty <= 1}>
                                                    -
                                                </button>
                                                <span key={qty} className="carte-pop" style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                                                    Quantité : {qty}
                                                </span>
                                                <button type="button" className="carte-qty-btn" onClick={() => updateQuantity(index, qty + 1)} disabled={p.stock !== undefined && qty >= Number(p.stock)}>
                                                    +
                                                </button>
                                            </div>

                                            <p style={{ textAlign: 'center', fontWeight: '700', fontSize: '14px', color: '#334155', margin: '8px 0 14px' }}>
                                                Sous-total :{' '}
                                                <span key={lineTotal} className="carte-pop" style={{ color: '#dc2626' }}>
                                                    {lineTotal.toFixed(2)} DH
                                                </span>
                                            </p>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link to={`/product/${p.id}`} className="carte-action-btn" style={{ background: '#f59e0b' }}>
                                                    <Eye size={15} /> Détails
                                                </Link>
                                                <button type="button" className="carte-action-btn" style={{ background: '#ef4444' }} onClick={() => this.handleRemoveAnimated(index)}>
                                                    <Trash2 size={15} /> Supprimer
                                                </button>
                                            </div>

                                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                                                <Store size={15} color="#0284c7" />
                                                <span>
                                                    Vendu par : <strong style={{ color: '#0f172a' }}>{boutiqueName}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="carte-summary">
                            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>
                                Total des produits :{' '}
                                <span key={cartTotal} className="carte-pop" style={{ color: '#dc2626' }}>
                                    {cartTotal.toFixed(2)} DH
                                </span>
                            </h2>
                            <Link to="/checkout" className="btn-payer" style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}>
                                Payer ({cartTotal.toFixed(2)} DH)
                            </Link>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default Carte;