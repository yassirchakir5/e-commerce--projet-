import { Component } from "react";
import { Star, Store, Heart } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import api from "../api/api";

class Derrniprodu extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      sorto: "datep",
      categorie: props.categorie || "all",
      categoriesList: [],
      products: [],
      favorisIds: [],
    };
  }

  componentDidMount() {
    this.handlecategorie();
    this.handleproduits();
    this.fetchFavorisIds();
  }

  fetchFavorisIds = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/favoris", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const favList = res.data.favoris || [];
      const ids = favList.map((item) => item.id);
      this.setState({ favorisIds: ids });
    } catch (err) {
      console.log("Erreur favoris:", err);
    }
  };

  handleToggleFavori = async (id_produit) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Veuillez vous connecter pour ajouter aux favoris.");
      return;
    }

    try {
      const res = await api.post(
        `/favoris/toggle/${id_produit}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.is_favori) {
        this.setState((prev) => ({
          favorisIds: [...prev.favorisIds, id_produit],
        }));
      } else {
        this.setState((prev) => ({
          favorisIds: prev.favorisIds.filter((id) => id !== id_produit),
        }));
      }
    } catch (err) {
      console.error("Erreur lors du toggle favori :", err);
    }
  };

  handleproduits = async () => {
    try {
      const res = await api.get("/produit/all");
      this.setState({ products: res.data.produit || [] });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.categorie !== this.props.categorie) {
      this.setState({ categorie: this.props.categorie || "all" });
    }
  }

  setsearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  setsort = (e) => {
    this.setState({
      sorto: e.target.value,
    });
  };

  handlecategorie = async () => {
    try {
      const res = await api.get("/categorie");
      this.setState({ categoriesList: res.data.categorie || [] });
    } catch (err) {
      console.log(err);
    }
  };

  setCategorie = (cat) => {
    this.setState({
      categorie: cat,
    });
  };

  getProductImage = (p) => {
    if (Array.isArray(p.images) && p.images.length > 0) {
      const mainObj = p.images.find((img) => img.is_main) || p.images[0];
      if (mainObj?.path) {
        return `http://127.0.0.1:8000/storage/${mainObj.path}`;
      }
    }
    return p.image || "https://via.placeholder.com/200?text=Produit";
  };

  render() {
    const { addToCart } = this.context;
    const { search, sorto, categorie, products, favorisIds } = this.state;

    let filterpros = products.filter((p) => {
      const catName =
        typeof p.categorie === "object" && p.categorie !== null
          ? p.categorie.nom
          : p.categorie || "";

      const matchCat =
        categorie.toLowerCase() === "all" ||
        catName.toLowerCase() === categorie.toLowerCase();

      const prodName = p.nom || p.name || "";
      const matchSearch = prodName.toLowerCase().includes(search.toLowerCase());

      return matchCat && matchSearch;
    });

    filterpros = [...filterpros].sort((a, b) => {
      const prixA = Number(a.prix ?? a.price ?? 0);
      const prixB = Number(b.prix ?? b.price ?? 0);

      if (sorto === "prixcr") return prixA - prixB;
      if (sorto === "prixdecr") return prixB - prixA;
      return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
    });

    return (
      <div>
        <div className="shop-categories" style={{ marginTop: "20px" }}>
          <button
            type="button"
            className={`cat-pill ${categorie.toLowerCase() === "all" ? "active" : ""}`}
            onClick={() => this.setCategorie("all")}
          >
            All
          </button>
          {this.state.categoriesList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${
                categorie.toLowerCase() === cat.nom.toLowerCase() ? "active" : ""
              }`}
              onClick={() => this.setCategorie(cat.nom)}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        <div className="input-searc">
          <select
            style={{ marginLeft: "40px" }}
            onChange={this.setsort}
            className="boutiques-select"
            value={sorto}
          >
            <option value="datep">Date publication</option>
            <option value="prixcr">Prix croissant</option>
            <option value="prixdecr">Prix décroissant</option>
          </select>
          <input
            type="text"
            placeholder="Search"
            className="input-sea"
            value={search}
            onChange={this.setsearch}
          />
        </div>

        <div className="carts-dern">
          {filterpros.map((p, index) => {
            const prodName = p.nom || p.name;
            const prodImg = this.getProductImage(p);
            const boutiqueName = p.boutique?.nom || p.vendupa || "Boutique";
            const isFavori = favorisIds.includes(p.id);

            const statusClean = String(p.status || "").trim().toLowerCase();
            const isDispo = statusClean === "disponible";
            const hasStock = p.stock === undefined || Number(p.stock) > 0;
            const canBuy = isDispo && hasStock;

            return (
              <div className="carts-der" key={p.id || index}>
                <div className="image-container">
                  <img src={prodImg} alt={prodName} />
                  <button
                    type="button"
                    className="heart-btn"
                    onClick={() => this.handleToggleFavori(p.id)}
                  >
                    <Heart
                      className="heart"
                      fill={isFavori ? "red" : "none"}
                      color={isFavori ? "red" : "currentColor"}
                    />
                  </button>
                </div>

                <h2
                  className={`badge-statut ${p.status}`}
                  style={{ textAlign: "center" }}
                >
                  {p.status}
                </h2>

                <h3>{prodName}</h3>

                <div className="stars">
                  <Star className="st" />
                  <p>
                    {p.stars || 0} ({p.count_avis ?? p.countst ?? 0})
                  </p>
                </div>

                <h4>
                  <span className="span-pri"> {p.prix} </span> DH
                </h4>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    type="button"
                    className="btn-ajout"
                    disabled={!canBuy}
                    onClick={() => {
                      if (canBuy) {
                        addToCart({ ...p, name: prodName, image: prodImg });
                      }
                    }}
                    style={{
                      opacity: canBuy ? 1 : 0.5,
                      backgroundColor: canBuy ? undefined : "#94a3b8",
                      cursor: canBuy ? "pointer" : "not-allowed",
                    }}
                    title={
                      !canBuy
                        ? `Produit ${p.status} - Indisponible à l'achat`
                        : "Ajouter au panier"
                    }
                  >
                    Ajouter au panier
                  </button>
                  <Link to={`/product/${p.id}`} className="btn-detail">
                    Détails
                  </Link>
                </div>

                <div className="vendu">
                  <Store /> &nbsp;&nbsp;
                  <p>Vendu par : <strong>{boutiqueName}</strong></p>
                </div>
              </div>
            );
          })}

          {filterpros.length === 0 && (
            <h3 className="msg-vide">Aucun produit existe avec ce nom</h3>
          )}
        </div>
      </div>
    );
  }
}

export default Derrniprodu;