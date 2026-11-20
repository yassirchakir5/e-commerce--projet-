import { Component } from "react";
import { Star, Store, Heart } from "lucide-react";
import Products from "../data/product.json";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

class Derrniprodu extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      sorto: "datep",
      categorie: props.categorie || "all",
    };
  }

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

  setCategorie = (cat) => {
    this.setState({
      categorie: cat,
    });
  };

  render() {
    const { addToCart } = this.context;
    const { search, sorto, categorie } = this.state;

    const categoriesList = [
      { id: "all", label: "Tout" },
      { id: "Phones", label: "Téléphones" },
      { id: "Computer", label: "Ordinateurs" },
      { id: "Electronique", label: "Électronique" },
      { id: "casques", label: "Casques" },
      { id: "Vêtements", label: "Vêtements" },
    ];

    let filterpros = Products.filter((p) => {
      const matchCat =
        categorie === "all" ||
        (p.categorie && p.categorie.toLowerCase() === categorie.toLowerCase());
      const matchSearch =
        p.name && p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });

    filterpros = [...filterpros].sort((a, b) => {
      const prixA = a.prix ?? a.price ?? 0;
      const prixB = b.prix ?? b.price ?? 0;

      if (sorto === "prixcr") return prixA - prixB;
      if (sorto === "prixdecr") return prixB - prixA;
      return new Date(b.date || b.data || 0) - new Date(a.date || a.data || 0);
    });

    return (
      <div>
        
        <div className="shop-categories" style={{ marginTop: "20px" }}>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${
                categorie.toLowerCase() === cat.id.toLowerCase() ? "active" : ""
              }`}
              onClick={() => this.setCategorie(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="input-searc">
          <select style={{marginLeft: '40px'}} onChange={this.setsort} className="boutiques-select" value={sorto}>
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
          {filterpros.map((p, index) => (
            <div className="carts-der" key={p.id || index}>
              <div className="image-container">
                <img src={p.image} alt={p.name} />
                <button type="button" className="heart-btn">
                  <Heart className="heart" />
                </button>
              </div>

              <h2
                className={`badge-statut ${p.status}`}
                style={{ textAlign: "center" }}
              >
                {p.status}
              </h2>

              <h3>{p.name}</h3>

              <div className="stars">
                <Star className="st" />
                <p>
                  {p.stars} ({p.countst})
                </p>
              </div>

              <h4>
                <span className="span-pri"> {p.prix} </span> DH
              </h4>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="btn-ajout"
                  onClick={() => addToCart(p)}
                >
                  Ajouter au panier
                </button>
                <Link to={`/product/${p.id}`} className="btn-detail">
                  Détails
                </Link>
              </div>

              <div className="vendu">
                <Store /> &nbsp;&nbsp;
                <p>Vendu par : {p.vendupa}</p>
              </div>
            </div>
          ))}

          {filterpros.length === 0 && (
            <h3 className="msg-vide">Aucun produit existe avec ce nom</h3>
          )}
        </div>
      </div>
    );
  }
}

export default Derrniprodu;