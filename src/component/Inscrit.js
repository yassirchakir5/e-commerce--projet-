import { Component } from "react";
import './Inscrit.css';


class Inscrit extends Component{
    state = {
        step: 1,
        tempdata: {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            auth: ""
        },
        finaldata: null
    }
    handlechange = (e) => {
        const {name,value} = e.target;
        this.setState({
            tempdata: {
                ...this.state.tempdata,
                [name]: value
            }
        });
    }
    nextetap = () => {
        this.setState({
            step: this.state.step + 1
        });
    };
    previset = () => {
        this.setState({
            step: this.state.step - 1
        })
    }

    saveFinal = (e) => {
        e.preventDefault();
        this.setState({
            finaldata: this.state.tempdata
        }, () => {
            console.log(this.state.finaldata);
            
        })
    }
    
    render(){
        const {step,tempdata} = this.state;
        return(
            <div>
                {this.state.step === 1 && 
                    <div className="card-I">
                    <div className="card-Inscrit">
                    <div className="section-title">
                        <h1>Créer un compte</h1>
                    </div>
                    <form onSubmit={this.nextetap} method="POST">
                    <div className="section-no-pre">
                        
                        <div className="section-nom">
                            <div>
                                <label htmlFor="nom">Nom</label>
                            </div>
                            <div>
                                <input type="text" placeholder="name" id="nom" name="nom" onChange={this.handlechange}/>
                            </div>
                        </div>
                        <div className="section-prenom">
                            <div>
                                <label htmlFor="prenom">Prenom</label>
                            </div>
                            <div>
                                <input type="text" placeholder="prenom" id="prenom" name="prenom" onChange={this.handlechange}/>
                            </div>
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label htmlFor="email">Adresse email</label>
                        </div>
                        <div>
                            <input type="email" placeholder="Adresse email" id="email" name="email" onChange={this.handlechange}/>
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label htmlFor="password">Mot de passe</label>
                        </div>
                        <div>
                            <input type="password" minLength={8} placeholder="Mot de passe" name="password" id="password" onChange={this.handlechange} />
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label htmlFor="cpassword">Comfirmation le Mot de passe</label>
                        </div>
                        <div>
                            <input type="password" minLength={8} placeholder="Comfirmation le Mot de passe" id="cpassword" name="password" onChange={this.handlechange} />
                        </div>
                    </div>
                    <div className="form-con">
                        <input type="submit" className="btn-connect"   />
                    </div>
                    </form>
                    <div className="form-a">
                        <a href="/login">Vous avez already account ?</a>
                    </div>
                </div>
                </div>
                }
                {this.state.step === 2 && 
                    <form onSubmit={this.saveFinal} method="POST">
                        <h1 style={{textAlign: 'center'}}>Créer un compte</h1>
                        <div className="step2">
                            <div className="form2">
                                <div>
                                    <label htmlFor="nom">Nom</label>
                                </div>
                                <input type="text" id="nom" name="nom" placeholder="Nom" onChange={this.handlechange}/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="prenom">Prenom</label>
                                </div>
                                <input type="text" id="prenom" name="prenom" placeholder="Prenom" onChange={this.handlechange}/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="email">Adresse email</label>
                                </div>
                                <input type="email" id="email" name="email" placeholder="Adresse email" onChange={this.handlechange}/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="numtel">Numéro de téléphone</label>
                                </div>
                                <input type="number" id="numtel" name="numtel" placeholder="Numéro de téléphone" onChange={this.handlechange}/>
                            </div>
                            <select name="auth" onChange={this.handlechange} className="formse">
                                <option>Choisir methode de paiment</option>
                                <option value="CNI">CNI</option>
                                <option value="Passport">Passport</option>
                                <option value="Cart">Carte d'etudiant</option>
                            </select>
                            {this.state.tempdata.auth === "CNI" && 
                                <div className="form2">
                                    <div>
                                        <label htmlFor="CNI">CNI</label>
                                    </div>
                                    <input type="text" id="CNI" placeholder="CNI" name="CNI" onChange={this.handlechange}/>
                                    <div>
                                        <label htmlFor="CNIfr">Saisir l'image recto de CNI</label>
                                    </div>
                                    <input type="file" id="CNIfr" accept=".jpg,.png,.pdf"/>
                                    <div style={{marginTop: '20px'}}>
                                        <label htmlFor="CNIfv">Saisir l'image verso de CNI</label>
                                    </div>
                                    <input type="file" id="CNIfv" accept=".jpg,.png,.pdf"/>
                                </div>
                                
                            }
                            {this.state.tempdata.auth === "Passport" && 
                                <div className="form2">
                                    <div>
                                        <label htmlFor="Passport">Passport</label>
                                    </div>
                                    <input type="text" id="Passport" name="passport" placeholder="Passport" onChange={this.handlechange}/>
                                        <div>
                                        <label htmlFor="Passporti">Saisir l'image  de Passport</label>
                                    </div>
                                    <input type="file" id="Passporti" accept=".jpg,.png,.pdf"/>
                                </div>
                            }
                            {this.state.tempdata.auth === "Cart" && 
                                <div className="form2">
                                <div>
                                    <label htmlFor="Cart">Carte d'etudiant</label>
                                </div>
                                <input type="text" id="Cart" name="cartE" placeholder="Carte d'etudiant" onChange={this.handlechange}/>
                                 <div>
                                        <label htmlFor="CNEfr">Saisir l'image recto de la Carte d'etudiant</label>
                                    </div>
                                    <input type="file" id="CNEfr" accept=".jpg,.png,.pdf"/>
                                    <div style={{marginTop: '20px'}}>
                                        <label htmlFor="CNEfv">Saisir l'image verso de la Carte d'etudiant</label>
                                    </div>
                                    <input type="file" id="CNEfv" accept=".jpg,.png,.pdf"/>
                            </div>
                            }
                            <div className="form2">
                                <div>
                                    <label htmlFor="adrl">Adrresse local : </label>
                                </div>
                                <input type="text" id="adrl" name="adrl" placeholder="Adrresse local" onChange={this.handlechange}/>
                            </div>
                            
                        </div>
                        <div className="btn-prsu">
                                <button onClick={this.previset}>Precedent</button>
                                <input type="submit" className="btn-connect"/>
                            </div>
                    </form>
                }
                </div>
            
        )
    }
}

export default Inscrit;