import { Component } from "react";
import './Bar.css';
import { FaUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";



function withRouter(Component){
    return(props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Bar extends Component{
    constructor(props){
        super(props);
        this.state = {
            connected: false
        }
    }
    render(){
        return(
            <div className="bar">
                <h2><a href="/" className="logo"><strong className="sb">E</strong>-commerce</a></h2>
                <div className="bar-btn">
                    <a href="/" className="bar-btn home">Home</a>
                    <div className="dropdown">
                        <a className="dopdownbtn bar-btn categorie">Categorie</a>
                        <div className="dropdown-content">
                            <h3>Technologie</h3>
                            <a href="#">Phones</a>
                            <a href="#">Computer</a>
                            <a href="#">Casques</a>
                            <h3>Vétement</h3>
                            <a href="#">Home</a>
                            <a href="#">Women</a>
                        </div>
                    </div>
                </div>
                <div className="icons">
                    {this.state.connected && 
                        <div>
                            <div className="profile">
                                <a className="Usericon"><FaUser /></a>
                                <div className="profile-down">
                                    <img src="images/ya.jpeg" className="img-pro"/>
                                    <h2>Yassir Chakir</h2>
                                    <a href="/infos">Information Personnel</a>
                                    <button className="btn-deco">Déconnexion</button>
                                </div>
                            </div>
                        <a className="Shopicon"><CiShoppingCart /></a>
                        </div>
                    }
                    {this.state.connected === false &&
                        <div className="in">
                            <button onClick={() => this.props.navigate("/login")} className="btn-inscrire">
                                Connect/inscrire
                            </button>
                            <a className="Shopicon"><CiShoppingCart /></a>
                        </div>
                    }
                    
                </div>
                
            </div>
        );
    }
}

export default withRouter(Bar);

