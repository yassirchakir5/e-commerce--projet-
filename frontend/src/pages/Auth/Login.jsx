import { Component } from "react";
import '../../assets/Login.css'
import api from "../../api/api";
import { Navigate } from "react-router-dom";

class Login extends Component{
    state = {
        email: '',
        password: '',
        message: '',
        redirect: false,
        connect: false
    }
    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value});
    }

    handlelogin = async (e) => {
        e.preventDefault();
        try{
            const res = await api.post('/login',{
                email: this.state.email,
                password: this.state.password
            });

            
            this.setState({connect: true,message: res.data.message});
            
            setTimeout(() => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('login', true);
                this.props.setconnected(true);
                this.setState({ redirect: true});
            }, 2000);
        }catch(err){
            this.setState({ message: err.response.data.message});
        }
    }
    render(){
        return(
            <div className="card-l">
                {localStorage.getItem('login') === 'true' &&
                        <Navigate to="/" />
                }
                <div className="card-login">
                    <div className="connex">
                            <h1>Connexieon</h1>
                    </div>
                    {this.state.message && 
                        <div className={`connexion-messge ${this.state.connect ? "success" : "failed"}`}>
                            <h3>{this.state.message}</h3>
                        </div>
                    }
                    <form onSubmit={this.handlelogin}>
                        <div className="form-l"> 
                            <div className="label-group">
                                <label htmlFor="email">Adresse email</label>
                            </div>
                            <div className="input-group">
                                <input type="email" id="email" name="email" onChange={this.handlechange} placeholder="Adresse email" required/>
                            </div>
                        </div>
                        <div className="form-l">
                            <div className="label-group">
                                <label htmlFor="password">Mot de passe</label>
                            </div>
                            <div className="input-group">
                                <input type="password" id="password" name="password" onChange={this.handlechange} placeholder="Mot de passe" required/>
                            </div>
                        </div>
                        <div className="form-con">
                            <button className="btn-connect">Se connecter</button>
                        </div>
                    </form>
                    {this.state.redirect && 
                        <Navigate to="/" />
                    }
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
