import { Component } from "react";
import '../../assets/Login.css';
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Navigate } from "react-router-dom";

class Login extends Component {
    state = {
        email: '',
        password: '',
        message: '',
        redirect: false,
        connect: false,
        notVerified: false,
        resending: false
    };

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('verified') === '1') {
            this.setState({
                connect: true,
                message: 'Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.'
            });
        }
    }

    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handlelogin = async (e) => {
        e.preventDefault();
        this.setState({ notVerified: false, message: '', connect: false });

        try {
            const res = await api.post('/login', {
                email: this.state.email,
                password: this.state.password
            });

            this.setState({ connect: true , message: res.data.message });

            setTimeout(() => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('login', true);
                this.props.setconnected(true);
                this.setState({ redirect: true });
            }, 2000);
        } catch (err) {
            const errData = err.response?.data || {};
            this.setState({
                connect: false,
                message: errData.message || "Erreur de connexion",
                notVerified: Boolean(errData.not_verified)
            });
        }
    };

    handleResendVerification = async () => {
        if (!this.state.email || this.state.resending) return;
        this.setState({ resending: true });

        try {
            const res = await api.post('/email/resend', { email: this.state.email });
            this.setState({
                connect: true,
                notVerified: false,
                message: res.data.message,
                resending: false
            });
        } catch (err) {
            this.setState({
                connect: false,
                message: err.response?.data?.message || "Erreur lors de l'envoi de l'email.",
                resending: false
            });
        }
    };

    render() {
        return (
            <div className="card-l">
                {localStorage.getItem('login') === 'true' && <Navigate to="/" />}

                <div className="card-login">
                    <div className="connex">
                        <h1>Connexion</h1>
                    </div>

                    {this.state.message && (
                        <div className={`connexion-messge ${this.state.connect ? "success" : "failed"}`}>
                            <h3>{this.state.message}</h3>
                            {this.state.notVerified && (
                                <button
                                    type="button"
                                    onClick={this.handleResendVerification}
                                    disabled={this.state.resending}
                                    style={{
                                        marginTop: '10px',
                                        padding: '8px 14px',
                                        backgroundColor: '#0284c7',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    {this.state.resending ? 'Envoi en cours...' : "Renvoyer l'email de vérification"}
                                </button>
                            )}
                        </div>
                    )}

                    <form onSubmit={this.handlelogin}>
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
                                    onChange={this.handlechange}
                                    placeholder="Adresse email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-l">
                            <div className="label-group">
                                <label htmlFor="password">Mot de passe</label>
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handlechange}
                                    placeholder="Mot de passe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-con">
                            <button className="btn-connect">Se connecter</button>
                        </div>
                    </form>

                    {this.state.redirect && <Navigate to="/" /> }
                    <div className="form-a">
                        <Link to="/forgot-password">Mot de passe oublié ?</Link>
                        <br />
                        <br />
                        <Link to="/inscrit">Vous n'avez pas de compte ?</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;