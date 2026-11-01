import { Component } from "react";
import './Bar.css';
import { FaUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import mesinf from "../data/mesinfos.json"

function withRouter(Component){
    return(props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Bar extends Component{

    render(props){
        const {connected,navigate} = this.props;
        const info = mesinf;
        return(
            <div className="bar">
                <h2><a href="/" className="logo"><strong className="sb">E</strong>-commerce</a></h2>
                <div className="bar-btn">
                    <a href="/" className="bar-btn">Home</a>
                    <div className="dropdown">
                        <a className="dopdownbtn bar-btn categorie">Categorie <FaChevronDown size={12} /></a>
                        <div className="dropdown-content">
                            <h3>Technologie</h3>
                            <a href="/categorie/telephone">Phones</a>
                            <a href="/categorie/Computer">Computer</a>
                            <a href="/categorie/Casques">Casques</a>
                            <a href="/categorie/Vetements">Vétement</a>
                        </div>
                    </div>
                </div>
                
                <div className="icons">
                    
                    {connected && 
                        <div>
                            <a className="Shopicon"><CiShoppingCart /></a>
                            <div className="profile">
                                <a className="Usericon"><FaUser /></a>
                                <div className="profile-down">
                                    <img src={info.imgpro} className="img-pro"/>
                                    <h2>{info.name} {info.prenom}</h2>
                                    <a href="/infos">Information Personnel</a>
                                    <a href="/mesproduct">Mes Products</a>
                                    <button className="btn-deco">Déconnexion</button>
                                </div>
                            </div>
                        </div>
                    }
                    {connected === false &&
                    
                        <div className="in">
                            <a className="Shopicon"><CiShoppingCart /></a>
                            <button onClick={() => navigate("/login")} className="btn-inscrire">
                                Connect/inscrire
                            </button>
                            
                        </div>
                    }
                    
                </div>
                
            </div>
        );
    }
}

export default withRouter(Bar);

