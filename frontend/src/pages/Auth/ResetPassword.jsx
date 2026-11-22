import { Component } from "react";
import '../../assets/Login.css';
import api from "../../api/api";
import { Navigate } from "react-router-dom";

class ResetPassword extends Component {
    state = {
        email: '',
        token: '',
        password: '',
        password_confirmation: '',
        message: '',
        success: false,
        loading: false,
        redirect: false
    };

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token') || '';
        const email = params.get('email') || '';
        this.setState({ token, email });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleReset = async (e) => {
        e.preventDefault();

        if (this.state.password !== this.state.password_confirmation) {
            this.setState({
                success: false,
                message: "Les deux mots de passe ne correspondent pas."
            });
            return;
        }

        this.setState({ loading: true, message: '' });

        try {
            const res = await api.post('/reset-password', {
                email: this.state.email,
                token: this.state.token,
                password: this.state.password,
                password_confirmation: this.state.password_confirmation
            });

            this.setState({
                success: true,
                message: res.data.message,
                loading: false
            });

            setTimeout(() => {
                this.setState({ redirect: true });
            }, 2500);
        } catch (err) {
            this.setState({
                success: false,
                message: err.response?.data?.message || "Lien invalide ou expiré.",
                loading: false
            });
        }
    };

    render() {
        return (
            <div className="card-l">
                {this.state.redirect && <Navigate to="/login" />}

                <div className="card-login">
                    <div className="connex">
                        <h1>Nouveau mot de passe</h1>
                    </div>

                    {this.state.message && (
                        <div className={`connexion-messge ${this.state.success ? "success" : "failed"}`}>
                            <h3>{this.state.message}</h3>
                        </div>
                    )}

                    <form onSubmit={this.handleReset}>
                        <div className="form-l">
                            <div className="label-group">
                                <label htmlFor="email">Adresse email</label>
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    readOnly
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-l">
                            <div className="label-group">
                                <label htmlFor="password">Nouveau mot de passe</label>
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    placeholder="Minimum 6 caractères"
                                    minLength="6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-l">
                            <div className="label-group">
                                <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={this.state.password_confirmation}
                                    onChange={this.handleChange}
                                    placeholder="Confirmez votre mot de passe"
                                    minLength="6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-con">
                            <button className="btn-connect" disabled={this.state.loading}>
                                {this.state.loading ? "Mise à jour..." : "Changer le mot de passe"}
                            </button>
                        </div>
                    </form>

                    <div className="form-a">
                        <a href="/login">Retour à la connexion</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ResetPassword;