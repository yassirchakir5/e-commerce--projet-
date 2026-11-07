import { Component } from "react";
import '../../assets/Login.css'

class Login extends Component{
    render(){
        return(
            <div className="card-l">
                <div className="card-login">
                    <div className="connex">
                            <h1>Connexieon</h1>
                    </div>
                    <div className="form-l"> 
                        <div className="label-group">
                            <label for="email">Adresse email</label>
                        </div>
                        <div className="input-group">
                            <input type="email" id="email" placeholder="Adresse email" required/>
                        </div>
                    </div>
                    <div className="form-l">
                        <div className="label-group">
                            <label for="password">Mot de passe</label>
                        </div>
                        <div className="input-group">
                            <input type="password" id="password" placeholder="Mot de passe" required/>
                        </div>
                    </div>
                    <div className="form-con">
                        <button className="btn-connect">Se connecter</button>
                    </div>
                    <div className="form-a">
                        <a href="#">Mot de passe oublié ?</a>
                        <br />
                        <br />
                        <a href="/inscrit">Vous n'aves pas account ?</a>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Login;
