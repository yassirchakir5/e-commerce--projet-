import React, { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Store, Check, X } from 'lucide-react';
import '../assets/ProductDetails.css';
import { CartContext } from "../context/CartContext";
import api from "../api/api";

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
      imagesList: [],
      currentImageIndex: 0,
      quantity: 1,
      loading: true,
    };
  }

  componentDidMount() {
    this.handleafficher();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      this.handleafficher();
    }
  }

  handleafficher = async () => {
    this.setState({ loading: true });
    try {
      const res = await api.get(`/produit/${this.props.params.id}`);
      const prod = res.data.produit || null;

      let urls = [];
      let mainIdx = 0;

      if (prod && Array.isArray(prod.images) && prod.images.length > 0) {
        urls = prod.images.map(
          (img) => `http://127.0.0.1:8000/storage/${img.path}`
        );
        const foundMain = prod.images.findIndex((img) => img.is_main);
        mainIdx = foundMain >= 0 ? foundMain : 0;
      } else if (prod?.image) {
        urls = [prod.image];
      } else {
        urls = ['http://127.0.0.1:8000/storage/default-product.png'];
      }

      this.setState({
        product: prod,
        imagesList: urls,
        currentImageIndex: mainIdx,
        quantity: 1,
        loading: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({ product: null, imagesList: [], loading: false });
    }
  };

  handlePrevImage = () => {
    this.setState((prevState) => {
      const total = prevState.imagesList.length;
      if (total <= 1) return null;
      return {
        currentImageIndex: (prevState.currentImageIndex - 1 + total) % total,
      };
    });
  };

  handleNextImage = () => {
    this.setState((prevState) => {
      const total = prevState.imagesList.length;
      if (total <= 1) return null;
      return {
        currentImageIndex: (prevState.currentImageIndex + 1) % total,
      };
    });
  };

  handleQuantityChange = (type) => {
    this.setState((prevState) => {
      const maxStock = Math.max(1, Number(prevState.product?.stock) || 1);
      if (type === 'inc' && prevState.quantity < maxStock) {
        return { quantity: prevState.quantity + 1 };
      }
      if (type === 'dec' && prevState.quantity > 1) {
        return { quantity: prevState.quantity - 1 };
      }
      return null;
    });
  };

  handleQuantityInput = (e) => {
    const val = parseInt(e.target.value, 10);
    const maxStock = Math.max(1, Number(this.state.product?.stock) || 1);
    if (isNaN(val) || val < 1) {
      this.setState({ quantity: 1 });
    } else if (val > maxStock) {
      this.setState({ quantity: maxStock });
    } else {
      this.setState({ quantity: val });
    }
  };

  render() {
    const { product, imagesList, currentImageIndex, quantity, loading } = this.state;
    const { addToCart } = this.context || {};

    if (loading) return <div className="loading">Chargement...</div>;
    if (!product) return <div className="loading">Produit introuvable.</div>;

    const prodName = product.nom || product.name || 'Produit';
    const prodStatus = product.status || 'indisponible';
    const isDispo = String(prodStatus).toLowerCase() === 'disponible';
    const maxStock = Number(product.stock) || 0;
    const canBuy = isDispo && maxStock > 0;

    const validStars = Math.min(5, Math.max(0, Number(product.stars) || 0));
    const reviewsCount = product.countst ?? product.count_avis ?? 0;

    const categorieName =
      typeof product.categorie === 'object' && product.categorie !== null
        ? product.categorie.nom
        : product.categorie || 'Catégorie';

    const boutiqueName = product.boutique?.nom || product.vendupa || 'Boutique';
    const boutiqueId = product.boutique?.id || product.id_boutique;

    const pubDate = product.created_at
      ? new Date(product.created_at).toLocaleDateString('fr-FR')
      : product.date || '';

    const mainImageSrc = imagesList[currentImageIndex];

    const navBtnStyle = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      border: '1px solid #e2e8f0',
      background: 'rgba(255, 255, 255, 0.92)',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      zIndex: 3,
      transition: '0.2s',
    };

    return (
      <div className="product-details-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt;{' '}
          <Link to={`/categorie/${categorieName}`}>{categorieName}</Link> &gt;{' '}
          <span>{prodName}</span>
        </div>

        <div className="product-main-content">
          <div className="product-gallery" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              className="main-image-container"
              style={{
                position: 'relative',
                width: '100%',
                height: '360px',
                background: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '16px',
                boxSizing: 'border-box',
              }}
            >
              <div className="availability-badge top-left" style={{ zIndex: 3 }}>
                {prodStatus.toUpperCase()}
              </div>

              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={this.handlePrevImage}
                    title="Image précédente"
                    style={{ ...navBtnStyle, left: '12px' }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={this.handleNextImage}
                    title="Image suivante"
                    style={{ ...navBtnStyle, right: '12px' }}
                  >
                    <ChevronRight size={20} />
                  </button>

                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '12px',
                      background: 'rgba(15, 23, 42, 0.72)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      zIndex: 3,
                    }}
                  >
                    {currentImageIndex + 1} / {imagesList.length}
                  </span>
                </>
              )}

              <img
                src={mainImageSrc}
                alt={prodName}
                className="main-image"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            </div>

            {imagesList.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  padding: '4px 2px',
                  justifyContent: imagesList.length <= 5 ? 'center' : 'flex-start',
                }}
              >
                {imagesList.map((fullUrl, idx) => {
                  const isSelected = idx === currentImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => this.setState({ currentImageIndex: idx })}
                      style={{
                        flexShrink: 0,
                        width: '66px',
                        height: '66px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        boxShadow: isSelected ? '0 0 0 2px rgba(2, 132, 199, 0.2)' : 'none',
                        cursor: 'pointer',
                        opacity: isSelected ? 1 : 0.72,
                        transition: '0.2s',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={fullUrl}
                        alt={`${prodName} ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '6px',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{prodName}</h1>

            <div className="product-rating">
              {'⭐'.repeat(validStars)}
              {'☆'.repeat(5 - validStars)}
              <span className="reviews-count">
                {' '}
                {validStars} ({reviewsCount})
              </span>
            </div>

            <div className="product-price">{product.prix} DH</div>

            <div className="availability-badge inline">
              {prodStatus.toUpperCase()}
            </div>

            {product.desc && (
              <p style={{ margin: '12px 0', color: '#475569', lineHeight: '1.6' }}>
                {product.desc}
              </p>
            )}

            <div style={{ display: 'flex',  alignItems: 'center',  justifyContent: 'space-between',  gap: '12px',   padding: '12px 16px',  margin: '14px 0',  background: '#f8fafc',  border: '1px solid #e2e8f0',  borderRadius: '12px',  }}  >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div  style={{  width: '42px', height: '42px',   borderRadius: '10px',  background: '#0f172a',   color: '#ffffff',  display: 'flex',  alignItems: 'center', justifyContent: 'center', fontWeight: '700',  fontSize: '15px', flexShrink: 0,  }} >
                  {boutiqueName.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
                    Vendu par la boutique
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {boutiqueId ? (
                      <Link  to={`/Boutique/${boutiqueId}`} style={{  fontSize: '15px',  fontWeight: '700',  color: '#0284c7',  textDecoration: 'none',  }}  >
                        {boutiqueName}
                      </Link>
                    ) : (
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                        {boutiqueName}
                      </strong>
                    )}

                    {product.boutique && (
                      String(product.boutique.certifiée).toLowerCase() === 'true' ||
                      product.boutique.certifiée === true ? (
                        <span style={{  display: 'inline-flex', alignItems: 'center',  gap: '4px',  fontSize: '11px',  fontWeight: '600',  color: '#15803d', background: '#dcfce7',  padding: '2px 8px',  borderRadius: '999px',  }} >
                          <Check size={12} strokeWidth={3} /> Certifié
                        </span>
                      ) : (
                        <span style={{  display: 'inline-flex',   alignItems: 'center',  gap: '4px',  fontSize: '11px', fontWeight: '600',  color: '#64748b',   background: '#e2e8f0',  padding: '2px 8px',  borderRadius: '999px',  }}  >
                          <X size={12} strokeWidth={3} /> Non certifié
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {boutiqueId && (
                <Link  to={`/Boutique/${boutiqueId}`} style={{  display: 'inline-flex', alignItems: 'center',  gap: '6px',  padding: '7px 12px',  borderRadius: '8px',  background: '#ffffff',  border: '1px solid #cbd5e1',  color: '#0f172a',  fontSize: '13px', fontWeight: '600', textDecoration: 'none',  whiteSpace: 'nowrap',  }}  >
                  <Store size={15} color="#0284c7" />
                  Visiter
                </Link>
              )}
            </div>

            {pubDate && (
              <div className="product-date">
                Date de publication : {pubDate}
              </div>
            )}

            <div className="product-seller" style={{ marginTop: '10px' }}>
              Stock disponible : <strong>{maxStock}</strong>
            </div>

            <div  style={{  display: 'flex', alignItems: 'center', gap: '14px',  margin: '18px 0',   }} >
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Quantité :</span>
              <div  style={{ display: 'inline-flex', alignItems: 'center',  border: '1px solid #cbd5e1',  borderRadius: '10px',  overflow: 'hidden',  background: '#ffffff', }}  >
                <button type="button"  onClick={() => this.handleQuantityChange('dec')} disabled={!canBuy || quantity <= 1}
                  style={{  width: '36px',  height: '36px',   border: 'none',  background: '#f8fafc', cursor: !canBuy || quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex',  alignItems: 'center', justifyContent: 'center', color: '#0f172a',  }}  >
                  <Minus size={16} />
                </button>

                <input type="number" min={1}  max={maxStock} value={quantity} disabled={!canBuy}
                  onChange={this.handleQuantityInput} style={{  width: '52px',   height: '36px', border: 'none', borderLeft: '1px solid #e2e8f0',  borderRight: '1px solid #e2e8f0', textAlign: 'center',  fontWeight: '700', fontSize: '15px', outline: 'none',   }}  />

                <button type="button"  onClick={() => this.handleQuantityChange('inc')} disabled={!canBuy || quantity >= maxStock}
                  style={{  width: '36px', height: '36px',  border: 'none', background: '#f8fafc', cursor: !canBuy || quantity >= maxStock ? 'not-allowed' : 'pointer',  display: 'flex',  alignItems: 'center', justifyContent: 'center', color: '#0f172a',  }} >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button className="btn-add-cart"  disabled={!canBuy}
               style={{ opacity: canBuy ? 1 : 0.55, cursor: canBuy ? 'pointer' : 'not-allowed', }} 
               onClick={() => addToCart && addToCart( { ...product, name: prodName, image: mainImageSrc }, quantity  )  } >
                Ajouter au panier 🛒
              </button>

              <button type="button" className="btn-wishlist"> ♡ </button>

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