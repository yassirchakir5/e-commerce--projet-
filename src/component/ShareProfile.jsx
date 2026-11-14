import React, { Component } from 'react';
import '../assets/ShareProfile.css';

class ShareProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCopied: false
    };
    this.profileUrl = "http://localhost:3000/profile/Yassir%20Chakir";
  }

  handleCopyLink = () => {
    navigator.clipboard.writeText(this.profileUrl);
    this.setState({ isCopied: true });
    
    setTimeout(() => {
      this.setState({ isCopied: false });
    }, 2000);
  }

  render() {
    const { onClose, vendorName = "Yassir Chakir" } = this.props;

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
                value={this.profileUrl} 
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
              <div className="social-item">
                <div className="icon-circle whatsapp">
                  <i className="fab fa-whatsapp"></i> 
                  <span className="icon-text-fallback">W</span>
                </div>
                <span>WhatsApp</span>
              </div>
              
              <div className="social-item">
                <div className="icon-circle facebook">
                  <span className="icon-text-fallback">f</span>
                </div>
                <span>Facebook</span>
              </div>
              
              <div className="social-item">
                <div className="icon-circle twitter">
                  <span className="icon-text-fallback">𝕏</span>
                </div>
                <span>X / Twitter</span>
              </div>
              
              <div className="social-item">
                <div className="icon-circle linkedin">
                  <span className="icon-text-fallback">in</span>
                </div>
                <span>LinkedIn</span>
              </div>
              
              <div className="social-item">
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