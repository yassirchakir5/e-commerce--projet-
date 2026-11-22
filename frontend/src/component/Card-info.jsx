import { Component } from "react";
import { CiSettings } from "react-icons/ci";
import { FiBox } from "react-icons/fi";
import { FaAddressCard } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { Store } from "lucide-react";
import { TbDashboardFilled } from "react-icons/tb";

// Card-info.jsx
class Cardinfos extends Component {
    render() {
        const { actuelle, change } = this.props;
        return (
            <div className="card-btns">
                <button className={`menu-icon ${actuelle === "dashboard" ? "active" : ""}`} onClick={() => change("dashboard")}>
                    <TbDashboardFilled className="settings" />Dashboard
                </button>
                <button className={`menu-icon ${actuelle === "infos" ? "active" : ""}`} onClick={() => change("infos")}>
                    <FaUser className="settings" />Information Personnel
                </button>
                <button className={`menu-icon ${actuelle === "adre" ? "active" : ""}`} onClick={() => change("adre")}>
                    <FaAddressCard className="settings" />Mes Addresses
                </button>
                <button className={`menu-icon ${actuelle === "commad" ? "active" : ""}`} onClick={() => change("commad")}>
                    <FiBox className="settings" />Mes commandes
                </button>
                <button className={`menu-icon ${actuelle === "favo" ? "active" : ""}`} onClick={() => change("favo")}>
                    <MdFavoriteBorder className="settings" />Mes Favoris
                </button>
                <button className={`menu-icon ${actuelle === "product" ? "active" : ""}`} onClick={() => change("product")}>
                    <FaShoppingCart className="settings" />Mes Products
                </button>
                <button className={`menu-icon ${actuelle === "boutique" ? "active" : ""}`} onClick={() => change("boutique")}>
                    <Store className="settings" />Ma Boutique
                </button>
                <button className={`menu-icon ${actuelle === "Cartes" ? "active" : ""}`} onClick={() => change("Cartes")}>
                    <CiBank className="settings" />Mes Cartes
                </button>
                <button className={`menu-icon ${actuelle === "set" ? "active" : ""}`} onClick={() => change("set")}>
                    <CiSettings className="settings" />Settings
                </button>
            </div>
        );
    }
}

export default Cardinfos;