import { Component } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { Store, Save, ExternalLink, Package, CheckCircle, Clock, X } from "lucide-react";

class GérerMaBoutique extends Component{
    render(){
        return(
            <div className="maboutique-container">
            <div className="maboutique-top">
              <h2>
                <Store size={24} /> Gestion de : {this.props.nomBoutique}
              </h2>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Link to="/shop" className="btn-voir-shop">
                  Voir la boutique <ExternalLink size={16} />
                </Link>
                <button
                  type="button"
                  onClick={this.props.toggleajoutcurrentpag}
                  style={{
                    background: "#e2e8f0",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                  title="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="boutique-stats">
              <div className="stat-box">
                <Package size={22} color="#2563eb" />
                <div>
                  <span>Total Produits</span>
                  <strong>{this.props.myProducts.length}</strong>
                </div>
              </div>
              <div className="stat-box">
                <CheckCircle size={22} color="#16a34a" />
                <div>
                  <span>Disponibles</span>
                  <strong>{this.props.dispoCount}</strong>
                </div>
              </div>
              <div className="stat-box">
                <Clock size={22} color="#d97706" />
                <div>
                  <span>En révision</span>
                  <strong>{this.props.revCount}</strong>
                </div>
              </div>
            </div>

            <form className="boutique-form" onSubmit={this.props.handleSave}>
              <div className="form-row-switch">
                <div>
                  <strong>Statut de la boutique : </strong>
                  <span className={this.props.isOpen ? "tag-open" : "tag-closed"}>
                    {this.props.isOpen ? "Ouverte" : "Fermée temporairement"}
                  </span>
                </div>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    name="isOpen"
                    checked={this.props.isOpen}
                    onChange={this.props.handleChange}
                  />
                  <span>Activer / Désactiver</span>
                </label>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Nom de la boutique</label>
                  <input
                    type="text"
                    name="nomBoutique"
                    value={this.props.nomBoutique}
                    onChange={this.props.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone / WhatsApp</label>
                  <input
                    type="text"
                    name="telephone"
                    value={this.props.telephone}
                    onChange={this.props.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ville / Adresse du magasin</label>
                  <input
                    type="text"
                    name="ville"
                    value={this.props.ville}
                    onChange={this.props.handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description de la boutique</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={this.props.description}
                    onChange={this.props.handleChange}
                  />
                </div>
              </div>

              <div style={{display: 'flex',justifyContent: 'space-between'}}>
                <button type="submit" className="btn-save-boutique">
                  <Save size={18} /> Enregistrer les modifications
                </button>
                <button type="button" onClick={this.props.handledelete} className="btn-save-boutique delete">
                  <MdDelete size={18} /> Supprimer la boutique
                </button>
              </div>
              {this.props.savedMessage && (
                <p className="save-success">
                  {this.props.message}
                </p>
                
              )}
            </form>

            <div className="boutique-products-control">
              <h3>Contrôle rapide des produits</h3>
              <table className="boutique-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.myProducts.map((prod, idx) => (
                    <tr key={prod.id || idx}>
                      <td>{prod.name}</td>
                      <td>{prod.prix ?? prod.price} DH</td>
                      <td>
                        <span
                          className={`status-pill ${
                            prod.status === "disponible" ? "ok" : "wait"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-toggle-status"
                          onClick={() => this.toggleProductStatus(prod.id)}
                        >
                          Changer statut
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
    }
}

export default GérerMaBoutique;