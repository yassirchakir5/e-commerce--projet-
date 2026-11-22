import { Component } from "react";
import '../../assets/Inscrit.css';
import SelectProvince from "../../component/component-inscrit/select-province";
import SelectPays from "../../component/component-inscrit/select-pays";
import api from '../../api/api';
import { Navigate } from 'react-router-dom';

class Inscrit extends Component {
    state = {
        step: 1,
        nom: "",
        prenom: "",
        email: "",
        password: "",
        cpassword: "",
        numtel: "",
        CNI: "",
        adresselocal: "",
        province: "",
        pays: "",
        date_naissance: "",
        path_img_profile: null,
        path_CNIfr: null,
        path_CNIfv: null,
        message: "",
        passwordError: "",
        redirect: false
    };

    handlechange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            this.setState({ [name]: files[0] });
        } else {
            this.setState({ [name]: value, passwordError: "" });
        }
    };

    handleRegister = async (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.cpassword) {
            this.setState({
                message: "Les deux mots de passe ne correspondent pas."
            });
            return;
        }

        const formdata = new FormData();
        formdata.append('name', this.state.nom || '');
        formdata.append('prenom', this.state.prenom || '');
        formdata.append('email', this.state.email || '');
        formdata.append('password', this.state.password || '');
        formdata.append('password_confirmation', this.state.cpassword || '');
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
            this.setState({
                message: res.data.message || 'Inscription réussie ! Vérifiez votre email.'
            });
            setTimeout(() => {
                this.setState({ redirect: true });
            }, 3500);
        } catch (err) {
            console.error("Erreur complète:", err);
            this.setState({
                message: err.response?.data?.message || "Erreur de connexion au serveur"
            });
        }
    };

    nextetap = (e) => {
        e.preventDefault();

        if (this.state.password !== this.state.cpassword) {
            this.setState({
                passwordError: "Les deux mots de passe ne correspondent pas !"
            });
            return;
        }

        this.setState({
            passwordError: "",
            step: this.state.step + 1
        });
    };

    previset = (e) => {
        e.preventDefault();
        this.setState({
            step: this.state.step - 1
        });
    };

    render() {
        return (
            <div>
                {localStorage.getItem('login') === 'true' && <Navigate to="/" />}

                {this.state.step === 1 && (
                    <div className="card-I">
                        <div className="card-Inscrit">
                            <div className="section-title">
                                <h1>Créer un compte</h1>
                            </div>

                            {this.state.passwordError && (
                                <div className="connexion-messge failed">
                                    <p>{this.state.passwordError}</p>
                                </div>
                            )}

                            <form onSubmit={this.nextetap}>
                                <div className="section-no-pre">
                                    <div className="section-nom">
                                        <div>
                                            <label htmlFor="nom">Nom</label>
                                        </div>
                                        <div className="input-i">
                                            <input
                                                type="text"
                                                placeholder="Nom"
                                                id="nom"
                                                name="nom"
                                                value={this.state.nom}
                                                onChange={this.handlechange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="section-prenom">
                                        <div>
                                            <label htmlFor="prenom">Prénom</label>
                                        </div>
                                        <div className="input-i">
                                            <input
                                                type="text"
                                                placeholder="Prénom"
                                                id="prenom"
                                                name="prenom"
                                                value={this.state.prenom}
                                                onChange={this.handlechange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="section-form">
                                    <div>
                                        <label htmlFor="email">Adresse email</label>
                                    </div>
                                    <div className="input-i">
                                        <input
                                            type="email"
                                            placeholder="Adresse email"
                                            id="email"
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="section-form">
                                    <div>
                                        <label htmlFor="password">Mot de passe</label>
                                    </div>
                                    <div className="input-i">
                                        <input
                                            type="password"
                                            minLength={8}
                                            placeholder="Mot de passe"
                                            name="password"
                                            id="password"
                                            value={this.state.password}
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="section-form">
                                    <div>
                                        <label htmlFor="cpassword">Confirmation du mot de passe</label>
                                    </div>
                                    <div className="input-i">
                                        <input
                                            type="password"
                                            minLength={8}
                                            placeholder="Confirmation du mot de passe"
                                            name="cpassword"
                                            id="cpassword"
                                            value={this.state.cpassword}
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-con">
                                    <input type="submit" value="Suivant" className="btn-connect" />
                                </div>
                            </form>

                            <div className="form-a">
                                <a href="/login">Vous avez déjà un compte ?</a>
                            </div>
                        </div>
                    </div>
                )}

                {this.state.step === 2 && (
                    <div className="card-I-2">
                        <div className="card-Inscrit-2">
                            <form onSubmit={this.handleRegister}>
                                <h1 style={{ textAlign: 'center' }}>Créer un compte</h1>
                                <div className="step2">
                                    <div className="form2">
                                        <div>
                                            <label htmlFor="nom2">Nom</label>
                                        </div>
                                        <input
                                            type="text"
                                            id="nom2"
                                            name="nom"
                                            value={this.state.nom}
                                            placeholder="Nom"
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>

                                    <div className="form2">
                                        <div>
                                            <label htmlFor="prenom2">Prénom</label>
                                        </div>
                                        <input
                                            type="text"
                                            id="prenom2"
                                            name="prenom"
                                            value={this.state.prenom}
                                            placeholder="Prénom"
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>

                                    <div className="form2">
                                        <div>
                                            <label htmlFor="email2">Adresse email</label>
                                        </div>
                                        <input
                                            type="email"
                                            id="email2"
                                            name="email"
                                            value={this.state.email}
                                            placeholder="Adresse email"
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>

                                    <div className="form2">
                                        <div>
                                            <label htmlFor="path_img_profile">Photo de profil :</label>
                                        </div>
                                        <input
                                            type="file"
                                            id="path_img_profile"
                                            name="path_img_profile"
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>

                                    <div className="form2">
                                        <div>
                                            <label htmlFor="numtel">Numéro de téléphone</label>
                                        </div>
                                        <input
                                            type="number"
                                            id="numtel"
                                            name="numtel"
                                            value={this.state.numtel}
                                            placeholder="Numéro de téléphone"
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>

                                    <div className="form2">
                                        <div>
                                            <label htmlFor="CNI">CNI</label>
                                        </div>
                                        <input
                                            type="text"
                                            id="CNI"
                                            placeholder="CNI"
                                            name="CNI"
                                            value={this.state.CNI}
                                            onChange={this.handlechange}
                                            required
                                        />

                                        <div>
                                            <label htmlFor="CNIfr">Saisir l'image recto de CNI</label>
                                        </div>
                                        <input
                                            type="file"
                                            id="CNIfr"
                                            name="path_CNIfr"
                                            onChange={this.handlechange}
                                            accept=".jpg,.png,.pdf"
                                            required
                                        />

                                        <div style={{ marginTop: '20px' }}>
                                            <label htmlFor="CNIfv">Saisir l'image verso de CNI</label>
                                        </div>
                                        <input
                                            type="file"
                                            id="CNIfv"
                                            name="path_CNIfv"
                                            onChange={this.handlechange}
                                            accept=".jpg,.png,.pdf"
                                            required
                                        />
                                    </div>

                                    <div className="form2">
                                        <div>
                                            <label htmlFor="adrl">Adresse locale :</label>
                                        </div>
                                        <input
                                            type="text"
                                            id="adrl"
                                            name="adresselocal"
                                            value={this.state.adresselocal}
                                            placeholder="Adresse locale"
                                            onChange={this.handlechange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="province" className="label-select">Province</label>
                                        <SelectProvince handlechange={this.handlechange} province={this.state.province} />
                                    </div>

                                    <div>
                                        <label htmlFor="pays" className="label-select">Pays</label>
                                        <SelectPays handlechange={this.handlechange} pays={this.state.pays} />
                                    </div>

                                    <div className="form2">
                                        <label htmlFor="daten">Date de naissance :</label><br />
                                        <input
                                            type="date"
                                            onChange={this.handlechange}
                                            id="daten"
                                            name="date_naissance"
                                            value={this.state.date_naissance}
                                        />
                                    </div>
                                </div>

                                {this.state.message && (
                                    <div className={`connexion-messge ${this.state.message.includes('réussi') ? 'success' : 'failed'}`}>
                                        <p>{this.state.message}</p>
                                    </div>
                                )}

                                {this.state.redirect && <Navigate to="/login" />}

                                <div className="btn-prsu">
                                    <button type="button" onClick={this.previset}>Précédent</button>
                                    <input type="submit" value="S'inscrire" className="btn-connect" />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Inscrit;