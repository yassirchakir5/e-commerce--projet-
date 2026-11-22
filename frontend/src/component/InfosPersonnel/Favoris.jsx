import { Component } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { Heart, Star, Store, Trash2 } from "lucide-react";
import axios from "axios";

class Favoris extends Component {
    static contextType = CartContext;

    constructor(props) {
        super(props);
        this.state = {
            mesfav: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchFavoris();
    }

    fetchFavoris = async () => {
        try {
            const token = localStorage.getItem("token"); 
            const response = await axios.get("http://127.0.0.1:8000/api/favoris", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });

            this.setState({
                mesfav: response.data.favoris,
                loading: false
            });
        } catch (err) {
            console.error("Erreur lors du chargement des favoris :", err);
            this.setState({
                error: "Impossible de charger vos favoris.",
                loading: false
            });
        }
    };

    supprif = async (id_produit) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://127.0.0.1:8000/api/favoris/toggle/${id_produit}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                }
            );

            this.setState((prevState) => ({
                mesfav: prevState.mesfav.filter((item) => item.id !== id_produit)
            }));
        } catch (err) {
            console.error("Erreur lors de la suppression du favori :", err);
        }
    };

    getMainImage = (produit) => {
        if (produit.images && produit.images.length > 0) {
            const mainImg = produit.images.find((img) => img.is_main) || produit.images[0];
            return `http://127.0.0.1:8000/storage/${mainImg.path}`;
        }
        return "/placeholder.png"; 
    };

    render() {
        const { addToCart } = this.context;
        const { mesfav, loading, error } = this.state;

        if (loading) {
            return <p style={{ textAlign: "center", marginTop: "2rem" }}>Chargement des favoris...</p>;
        }

        if (error) {
            return <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>{error}</p>;
        }

        return (
            <div className="az">
                <h1 style={{ textAlign: "center" }}>Mes favoris</h1>

                <div className="carts-dern">
                    {mesfav.map((fa, index) => (
                        <div
                            className="carts-der"
                            key={fa.id}
                            style={{ animationDelay: `${index * 0.07}s`, position: "relative" }}
                        >
                            <button
                                onClick={() => this.supprif(fa.id)}
                                title="Retirer des favoris"
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    background: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    padding: "6px",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                    zIndex: 2
                                }}
                            >
                                <Heart size={20} fill="red" color="red" />
                            </button>

                            <div className="image-container">
                                <img src={this.getMainImage(fa)} alt={fa.nom} />
                            </div>

                            <h2 className={`badge-statut ${fa.status}`} style={{ textAlign: "center" }}>
                                {fa.status}
                            </h2>

                            <h3>{fa.nom}</h3>

                            <div className="stars">
                                <Star className="st" />
                                <p>{fa.stars || 0} ({fa.countst || 0})</p>
                            </div>

                            <h4>
                                <span className="span-pri"> {fa.prix} </span> DH
                            </h4>

                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <button
                                    className="btn-ajout"
                                    onClick={() => addToCart(fa)}
                                >
                                    Ajouter au panier
                                </button>
                                <Link to={`/product/${fa.id}`} className="btn-detail">
                                    Détails
                                </Link>
                            </div>

                            <div className="vendu">
                                <Store /> &nbsp;
                                Vendu par :{" "}
                                {fa.boutique ? (
                                    <Link to={`/profile/${fa.boutique.id}`}>
                                        <strong>{fa.boutique.nom}</strong>
                                    </Link>
                                ) : (
                                    <strong>Boutique inconnue</strong>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {mesfav.length === 0 && (
                    <p className="aze" style={{ textAlign: "center", marginTop: "2rem" }}>
                        Aucun favori disponible
                    </p>
                )}
            </div>
        );
    }
}

export default Favoris;