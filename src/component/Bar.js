import { Component } from "react";
import './Bar.css';
import { FaUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";


class Bar extends Component{
    
    render(){
        return(
            <div className="bar">
                <h2 className="logo"><strong>E</strong>-commerce</h2>
                <div className="bar-btn">
                    <a href="#" className="bar-btn">Home</a>
                    <div className="dropdown">
                        <a className="dopdownbtn bar-btn">Categorie</a>
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
                    <div className="profile">
                        <a className="Usericon"><FaUser /></a>
                        <div className="profile-down">
                            <img src="images/ya.jpeg" className="img-pro"/>
                            <h2>Yassir Chakir</h2>
                            <a href="#">Information Personnel</a>
                            <a>errf</a>
                            <button className="btn-deco">Déconnexion</button>
                        </div>
                    </div>
                    <a className="Shopicon"><CiShoppingCart /></a>
                </div>
                
            </div>
        );
    }
}
export default Bar;