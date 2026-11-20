import { Component } from "react";

class ChekingVendeur extends Component{
    
    render(){
        return(
            <>
              {this.props.vendeur && this.props.vendeur.status === "accepte" && (
                <button
                  type="button"
                  className="btnajoa"
                  onClick={this.props.toggleAjoutForm}
                >
                  {this.props.currentPage === "ajoute_boutique"
                    ? "Fermer le formulaire"
                    : "Ajouter une Boutique"}
                </button>
              )}

              {this.props.vendeur && this.props.vendeur.status !== "accepte" && (
                <button type="button" disabled className="btnajoa">
                  Statut : {this.props.vendeur.status}
                </button>
              )}

              {!this.props.vendeur && (
                <button
                  type="button"
                  className="btnajoa"
                  disabled={this.props.loading}
                  onClick={this.props.handledemandevendeur}
                >
                  {this.props.loading ? "Envoi..." : "Demande devenir vendeur"}
                </button>
              )}
            </>
        )
    }
}

export default ChekingVendeur;