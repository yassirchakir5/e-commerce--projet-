import { Component } from "react";
import { FaUser } from "react-icons/fa";
import './infos.css';
import { FaAddressCard } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FiBox } from "react-icons/fi";
import { FaPen } from "react-icons/fa"; 
import { FaTrash } from "react-icons/fa";
class Infos extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            actuelle: "infos",
            
            addres: [
                {
                    title : "Domicile",
                    addresse: "Ouled teima dounia 2",
                    pays: "Maroc",
                    numtel: "0777040217" 
                },
                {
                    title : "Home",
                    addresse: "agadir dcheira",
                    pays: "Maroc",
                    numtel: "0679593058" 
                },
                {
                    title : "Home",
                    addresse: "agadir dcheira",
                    pays: "Maroc",
                    numtel: "0679593058" 
                }
            ]
        };
    }
    supp = (indexs) => {
        const nova = this.state.addres.filter((_,index) => index !== indexs);

        this.setState({
            addres : nova
        });
    }
    change = (a) => {
        this.setState({
            actuelle: a
        });
    }
    render(){
        return(
            <div>
                <div className="info">
                    <div className="card-btns">
                        <button className="menu-icon active" onClick={() => {this.change("infos")}}><FaUser className="settings"/> Information Personnel</button>
                        <button className="menu-icon" onClick={() => {this.change("adre")}}> <FaAddressCard className="settings"/> Mes Addresses</button>
                        <button className="menu-icon" onClick={() => {this.change("commad")}}><FiBox className="settings"/> Mes commandes</button>
                        <button className="menu-icon" onClick={() => {this.change("favo")}}><MdFavoriteBorder className="settings"/>Mes Favoris</button>
                        <button className="menu-icon" onClick={() => {this.change("set")}}><CiSettings className="settings" />Settings</button>
                    </div>
                    <div className="second-card">
                        {this.state.actuelle === "infos" && (
                            <div>
                                <h1>Mes informations Personnel</h1>
                                <p><strong>Nom </strong> : Yassir</p>
                                <p><strong>Prenom </strong> : Chakir</p>
                                <p><strong>email </strong> : yassirchakir5@gmail.com</p>
                                <p><strong>adresse de livraison </strong> : Ouled teima dounia 2</p>
                                <p><strong>CNE </strong> : JT117484</p>
                                <p><strong>Numéro de téléphone </strong> : 0777040217</p>
                            </div>
                        )}
                        {this.state.actuelle === "adre" && (
                            <div>
                                <h1>Mes Addresses</h1>
                                <div className="adre">
                                    {this.state.addres.map((a,index) => {
                                        return <div className="cardadr">
                                                <h3 key={index}>{a.title}</h3>
                                                <p key={index}>{a.addresse}</p>
                                                <p key={index}>{a.pays}</p>
                                                <p key={index}>{a.numtel}</p>
                                                <button><FaPen /> Modifier</button>
                                                <button onClick={() => {this.supp(index)}}><FaTrash /> Supprimer</button>
                                            </div>
                                    })}
                                </div>
                                
                                
                            </div>
                        )}
                        {this.state.actuelle === "commad" && (
                            <div>
                                <h1>Mes commandes</h1>
                            </div>
                        )}
                        {this.state.actuelle === "favo" && (
                            <div>
                                <h1>Mes favoris</h1>
                            </div>
                        )}
                        {this.state.actuelle === "set" && (
                            <div>
                                <h1>Settings</h1>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Infos;