import { Component } from "react";

class Infospe extends Component{
    render(){
        const {name,prenom,email,addresse,CNE,numtel} = this.props.mesi;
        return(
            <div>
                <h1>Mes informations Personnel</h1>
                <p className="pad"><strong>Nom </strong> : {name}</p>
                <p className="pad"><strong>Prenom </strong> : {prenom}</p>
                <p className="pad"><strong>email </strong> :{email}</p>
                <p className="pad"><strong>adresse de livraison </strong> : {addresse}</p>
                <p className="pad"><strong>CNE </strong> : {CNE}</p>
                <p className="pad"><strong>Numéro de téléphone </strong> : {numtel}</p>
            </div>
        )
    }
}

export default Infospe