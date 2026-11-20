import { Component } from "react";
import { Navigate } from "react-router-dom";

class Infospe extends Component{
    render(){
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        return(
            <div>
                {!localStorage.getItem('user') && 
                    <Navigate to="/login" />
                }
                <h1>Mes informations Personnel</h1>
                <p className="pad"><strong>Nom </strong> : {user.name}</p>
                <p className="pad"><strong>Prenom </strong> : {user.prenom}</p>
                <p className="pad"><strong>email </strong> :{user.email}</p>
                <p className="pad"><strong>adresse de livraison </strong> : {user.addresselocal}</p>
                <p className="pad"><strong>CNE </strong> : {user.CNI}</p>
                <p className="pad"><strong>Numéro de téléphone </strong> : {user.numtel}</p>
            </div>
        )
    }
}

export default Infospe