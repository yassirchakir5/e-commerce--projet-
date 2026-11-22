import { Component } from 'react';
import '../assets/ShareProfile.css';

class ShareProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCopied: false
    };
  }

  handleCopyLink = () => {
    const url = this.props.profileUrl || window.location.href;
    navigator.clipboard.writeText(url);
    this.setState({ isCopied: true });

    setTimeout(() => {
      this.setState({ isCopied: false });
    }, 2000);
  };

  shareOnSocial = (platform) => {
    const url = encodeURIComponent(this.props.profileUrl || window.location.href);
    const text = encodeURIComponent(`Découvrez le profil de ${this.props.vendorName || 'ce vendeur'} :`);
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${text}&body=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  render() {
    const { onClose, vendorName = "Vendeur", profileUrl } = this.props;
    const currentUrl = profileUrl || window.location.href;

    return (
      <div className="share-overlay">
        <div className="share-card">
          <div className="share-header">
            <h2>🔗 Partager le profil</h2>
          </div>

          <div className="share-body">
            <p className="share-desc">Partagez le profil de {vendorName} avec vos amis</p>

            <div className="share-link-box">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="share-input"
              />
              <button
                className={`btn-copier ${this.state.isCopied ? 'copied' : ''}`}
                onClick={this.handleCopyLink}
              >
                {this.state.isCopied ? 'Copié !' : '📄 Copier'}
              </button>
            </div>

            <p className="share-via-text">Partager via :</p>

            <div className="social-icons-container">
              <div className="social-item" onClick={() => this.shareOnSocial('whatsapp')} style={{ cursor: 'pointer' }}>
                <div className="icon-circle whatsapp">
                  <i className="fab fa-whatsapp"></i>
                  <span className="icon-text-fallback">W</span>
                </div>
                <span>WhatsApp</span>
              </div>

              <div className="social-item" onClick={() => this.shareOnSocial('facebook')} style={{ cursor: 'pointer' }}>
                <div className="icon-circle facebook">
                  <span className="icon-text-fallback">f</span>
                </div>
                <span>Facebook</span>
              </div>

              <div className="social-item" onClick={() => this.shareOnSocial('twitter')} style={{ cursor: 'pointer' }}>
                <div className="icon-circle twitter">
                  <span className="icon-text-fallback">𝕏</span>
                </div>
                <span>X / Twitter</span>
              </div>

              <div className="social-item" onClick={() => this.shareOnSocial('linkedin')} style={{ cursor: 'pointer' }}>
                <div className="icon-circle linkedin">
                  <span className="icon-text-fallback">in</span>
                </div>
                <span>LinkedIn</span>
              </div>

              <div className="social-item" onClick={() => this.shareOnSocial('email')} style={{ cursor: 'pointer' }}>
                <div className="icon-circle email">
                  <span className="icon-text-fallback">✉</span>
                </div>
                <span>Email</span>
              </div>
            </div>

            <button className="btn-fermer-share" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ShareProfileModal;