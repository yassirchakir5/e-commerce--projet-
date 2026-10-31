import { Component } from "react";
import { CiSettings } from "react-icons/ci";
import { FiBox } from "react-icons/fi";
import { FaAddressCard } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
class Cardinfos extends Component{
    render(){
        return(
            <div className="card-btns">
                <button className="menu-icon active" onClick={() => {this.props.change("infos")}}><FaUser className="settings"/>Information Personnel</button>
                <button className="menu-icon" onClick={() => {this.props.change("adre")}}> <FaAddressCard className="settings"/> Mes Addresses</button>
                <button className="menu-icon" onClick={() => {this.props.change("commad")}}><FiBox className="settings"/> Mes commandes</button>
                <button className="menu-icon" onClick={() => {this.props.change("favo")}}><MdFavoriteBorder className="settings"/>Mes Favoris</button>
                <button className="menu-icon" onClick={() => {this.props.change("product")}}><FaShoppingCart className="settings" />Mes Products</button>
                <button className="menu-icon" onClick={() => {this.props.change("set")}}><CiSettings className="settings" />Settings</button>
            </div>
        )
    }
}

export default Cardinfos;