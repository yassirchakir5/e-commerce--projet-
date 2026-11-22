import { Component } from "react";
import '../../assets/Login.css';
import api from "../../api/api";

class ForgotPassword extends Component {
    state = {
        email: '',
        message: '',
        success: false,
        loading: false
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, message: '', success: false });

        try {
            const res = await api.post('/forgot-password', {
                email: this.state.email
            });

            this.setState({
                success: true,
                message: res.data.message,
                loading: false
            });
        } catch (err) {
            this.setState({
                success: false,
                message: err.response?.data?.message || "Erreur lors de l'envoi du lien.",
                loading: false
            });
        }
    };

    render() {
        return (
            <div className="card-l">
                <div className="card-login">
                    <div className="connex">
                        <h1>Mot de passe oublié</h1>
                    </div>

                    {this.state.message && (
                        <div className={`connexion-messge ${this.state.success ? "success" : "failed"}`}>
                            <h3>{this.state.message}</h3>
                        </div>
                    )}

                    <form onSubmit={this.handleSubmit}>
                        <div className="form-l">
                            <div className="label-group">
                                <label htmlFor="email">Adresse email de votre compte</label>
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    placeholder="Entrez votre adresse email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-con">
                            <button className="btn-connect" disabled={this.state.loading}>
                                {this.state.loading ? "Envoi en cours..." : "Envoyer le lien"}
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

export default ForgotPassword;