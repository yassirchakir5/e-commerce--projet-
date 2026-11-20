import { Component } from "react";
import '../../assets/Inscrit.css';
import SelectProvince from "../../component/component-inscrit/select-province";
import SelectPays from "../../component/component-inscrit/select-pays";
import api from '../../api/api';
import { Navigate, redirect } from 'react-router-dom';

class Inscrit extends Component{
    state = {
        step: 1,
        tempdata: {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            auth: "",
            numtel: "",
            CNI: "",
            adresselocal: "",
            province: "",
            pays: "",
            date_naissance: "",
            progress: 0,
            message: "",
            path_img_profile: "",
            path_CNIfr: "",
            path_CNIfv: "",
            redirect: false
        },
        finaldata: null
    }
    handlechange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            this.setState({ [name]: files[0] });
        } else {
            this.setState({ [name]: value });
        }
    }

    handleRegister = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('name', this.state.nom || ''); 
        formdata.append('prenom', this.state.prenom || '');
        formdata.append('email', this.state.email || '');
        formdata.append('password', this.state.password || '');
        formdata.append('numtel', this.state.numtel || '');
        formdata.append('CNI', this.state.CNI || '');
        formdata.append('addresselocal', this.state.adresselocal || '');
        formdata.append('province', this.state.province || '');
        formdata.append('pays', this.state.pays || '');
        formdata.append('date_naissance', this.state.date_naissance || '');
        if (this.state.path_img_profile) {
            formdata.append('path_img_profile', this.state.path_img_profile);
        }
        if (this.state.path_CNIfv) {
            formdata.append('path_CNIfv', this.state.path_CNIfv);
        }

        if (this.state.path_CNIfr) {
            formdata.append('path_CNIfr', this.state.path_CNIfr);
        }

        try {
            const res = await api.post('/inscrit', formdata);
            this.setState({ message: 'Inscription réussi' });
            localStorage.setItem('token', res.data.token);
            setTimeout(() => {
                this.setState({ redirect: true});
            }, 3000);
        } catch (err) {
            console.error("Erreur complète:", err);
            console.log(err.response?.data);
            this.setState({ 
                message: err.response?.data?.message || "Erreur de connexion au serveur" 
            });
        }
    }

    nextetap = (e) => {
        e.preventDefault();
        this.setState({
            step: this.state.step + 1
        });
    };
    previset = (e) => {
        e.preventDefault();
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
                {localStorage.getItem('login') === 'true' &&
                        <Navigate to="/" />
                }
                {this.state.step === 1 && 
                    <div className="card-I">
                        <div className="card-Inscrit">
                            <div className="section-title">
                                <h1>Créer un compte</h1>
                            </div>
                            <form onSubmit={this.nextetap}>
                            <div className="section-no-pre">
                                <div className="section-nom">
                                    <div>
                                        <label htmlFor="nom">Nom</label>
                                    </div>
                                    <div className="input-i">
                                        <input type="text" placeholder="name" id="nom" name="nom" onChange={this.handlechange} required/>
                                    </div>
                                </div>
                                <div className="section-prenom">
                                    <div>
                                        <label htmlFor="prenom">Prenom</label>
                                    </div>
                                    <div className="input-i">
                                        <input type="text" placeholder="prenom" id="prenom" name="prenom" onChange={this.handlechange} required/>
                                    </div>
                                </div>
                            </div>
                            <div className="section-form">
                                <div>
                                    <label htmlFor="email">Adresse email</label>
                                </div>
                                <div className="input-i">
                                    <input type="email" placeholder="Adresse email" id="email" name="email" onChange={this.handlechange} required/>
                                </div>
                            </div>
                            <div className="section-form">
                                <div>
                                    <label htmlFor="password">Mot de passe</label>
                                </div>
                                <div className="input-i">
                                    <input type="password" minLength={8} placeholder="Mot de passe" name="password" id="password" onChange={this.handlechange} required/>
                                </div>
                            </div>
                            <div className="section-form">
                                <div>
                                    <label htmlFor="cpassword">Comfirmation le Mot de passe</label>
                                </div>
                                <div className="input-i">
                                    <input type="password" minLength={8} placeholder="Comfirmation le Mot de passe" name="cpassword" id="cpassword" onChange={this.handlechange} required/>
                                </div>
                            </div>
                            <div className="form-con">
                                <input type="submit" className="btn-connect"/>
                            </div>
                            </form>
                            <div className="form-a">
                                <a href="/login">Vous avez already account ?</a>
                            </div>
                        </div>
                    </div>
                }
                {this.state.step === 2 && 
                <div className="card-I-2">
                <div className="card-Inscrit-2">
                    <form onSubmit={this.handleRegister}>
                        <h1 style={{textAlign: 'center'}}>Créer un compte</h1>
                        <div className="step2">
                            <div className="form2">
                                <div>
                                    <label htmlFor="nom">Nom</label>
                                </div>
                                <input type="text" id="nom" name="nom" value={ this.state.nom } placeholder="Nom" onChange={this.handlechange} required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="prenom">Prenom</label>
                                </div>
                                <input type="text" id="prenom" name="prenom" value={this.state.prenom} placeholder="Prenom" onChange={this.handlechange} required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="email">Adresse email</label>
                                </div>
                                <input type="email" id="email" name="email" value={this.state.email} placeholder="Adresse email" onChange={this.handlechange} required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="nom">Photo Profile : </label>
                                </div>
                                <input type="file" id="nom" name="path_img_profile" placeholder="Nom" onChange={this.handlechange} required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="numtel">Numéro de téléphone</label>
                                </div>
                                <input type="number" id="numtel" name="numtel" placeholder="Numéro de téléphone" onChange={this.handlechange} required/>
                            </div>
                                <div className="form2">
                                <div>
                                    <label htmlFor="CNI">CNI</label>
                                </div>
                                <input type="text" id="CNI" placeholder="CNI" name="CNI" onChange={this.handlechange} required/>
                                <div>
                                    <label htmlFor="CNIfr">Saisir l'image recto de CNI</label>
                                </div>
                                <input type="file" id="CNIfr" name="path_CNIfr" onChange={this.handlechange}  accept=".jpg,.png,.pdf" required/>
                                <div style={{marginTop: '20px'}}>
                                    <label htmlFor="CNIfv">Saisir l'image verso de CNI</label>
                                </div>
                                <input type="file" id="CNIfv" name="path_CNIfv" onChange={this.handlechange}  accept=".jpg,.png,.pdf" required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="adrl">Adrresse local : </label>
                                </div>
                                <input type="text" id="adrl" name="adresselocal" placeholder="Adrresse local" onChange={this.handlechange} required/>
                            </div>
                            <div>
                                <label htmlFor="province" className="label-select">Province</label>
                                {<SelectProvince handlechange={this.handlechange} province={this.state.province}/>}
                            </div>
                            <div>
                                <label htmlFor="pays" className="label-select">Pays</label>
                                {<SelectPays handlechange={this.handlechange} pays={this.state.pays}/>}
                            </div>
                            <div className="form2">
                                <label for="daten">Date naissance : </label><br/>
                                <input type="date" onChange={this.handlechange} id="daten" name="date_naissance"/>
                            </div>
                        </div>
                        {this.state.message && (
                            <div className={`connexion-messge ${this.state.message.includes('réussi') ? 'success' : 'failed'}`}>
                             <p>
                                {this.state.message}
                            </p></div>
                           
                        )}
                        {this.state.redirect && 
                            <Navigate to="/login" />
                        }
                        <div className="btn-prsu">
                            <button onClick={this.previset}>Precedent</button>
                            <input type="submit" className="btn-connect"/>
                        </div>
                    </form>
                    </div>
                    </div>
                }
                
                </div>
        )
    }
}

export default Inscrit;