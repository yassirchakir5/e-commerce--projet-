import { Component } from "react";
import './Inscrit.css';


class Inscrit extends Component{
    render(){
        return(
            <div className="card-I">
                <div className="card-Inscrit">
                    <div className="section-title">
                        <h1>Créer un compte</h1>
                    </div>
                    <div className="section-no-pre">
                        <div className="section-nom">
                            <div>
                                <label for="nom">Nom</label>
                            </div>
                            <div>
                                <input type="text" placeholder="name" id="nom" />
                            </div>
                        </div>
                        <div className="section-prenom">
                            <div>
                                <label for="prenom">Prenom</label>
                            </div>
                            <div>
                                <input type="text" placeholder="prenom" id="prenom" />
                            </div>
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label for="email">Adresse email</label>
                        </div>
                        <div>
                            <input type="email" placeholder="Adresse email" id="email" />
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label for="password">Mot de passe</label>
                        </div>
                        <div>
                            <input type="password" placeholder="Mot de passe" id="password" />
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label for="cpassword">Comfirmation le Mot de passe</label>
                        </div>
                        <div>
                            <input type="password" minLength={8} placeholder="Comfirmation le Mot de passe" id="cpassword" />
                        </div>
                    </div>
                    <div className="form-con">
                        <button className="btn-connect">S'inscrire</button>
                    </div>
                    <div className="form-a">
                        <a href="/login">Vous avez already account ?</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Inscrit;