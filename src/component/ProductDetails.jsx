import React, { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/ProductDetails.css';
import products from '../data/product.json';
import { CartContext } from "../context/CartContext"; 

const withRouter = (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
};

class ProductDetails extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      quantity: 1
    };
  }

  componentDidMount() {
    const { id } = this.props.params; 
    const fetchedProduct = products.find(p => p.id === parseInt(id));
    
    if (fetchedProduct) {
      this.setState({ product: fetchedProduct });
    }
  }

  handleQuantityChange = (type) => {
    this.setState((prevState) => {
      if (type === 'inc') return { quantity: prevState.quantity + 1 };
      if (type === 'dec' && prevState.quantity > 1) return { quantity: prevState.quantity - 1 };
      return null;
    });
  };

  render() {
    const { product, quantity } = this.state;
    
    const { addToCart } = this.context;

    if (!product) return <div className="loading">Chargement...</div>;

    return (
      <div className="product-details-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to={`/categorie/${product.categorie}`}>{product.categorie}</Link> &gt; <Link to={`/categorie/${product.genre}`}>{product.genre}</Link>
        </div>

        <div className="product-main-content">
          <div className="product-gallery">
            <div className="availability-badge top-left">{product.status.toUpperCase()}</div>
            <div className="main-image-container">
              <img src={product.image} alt={product.name} className="main-image" />
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              {'⭐'.repeat(product.stars)}{'☆'.repeat(5 - product.stars)} 
              <span className="reviews-count"> {product.stars} ({product.countst})</span>
            </div>

            <div className="product-price">{product.prix} DH</div>
            
            <div className="availability-badge inline">{product.status.toUpperCase()}</div>

            <div className="product-seller">
              Vendu par : <strong>{product.vendupa}</strong>
            </div>
            
            <div className="product-date">
              Date de publication : {product.date}
            </div>
            <br/>
            <div className="product-seller">
              Stock : <strong>{product.stock}</strong>
            </div>

            <br />

            <div className="product-actions">
              <button className="btn-add-cart" onClick={() => addToCart(product, quantity)}>
                Ajouter au panier 🛒
              </button>
              
              <button className="btn-wishlist"> ♡ </button>
              
              <Link to="/" className="btn-return">
                Retour aux produits
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductDetails);