import { Component } from "react";
import "../assets/infos.css";
import Infospe from "../component/InfosPersonnel/Infospe";
import Mesadr from "../component/InfosPersonnel/Mesadr";
import Commande from "../component/InfosPersonnel/Command";
import Favoris from "../component/InfosPersonnel/Favoris";
import Settings from "../component/InfosPersonnel/Settings";
import Cardinfos from "../component/Card-info";
import Mesproduct from "../component/InfosPersonnel/MesProduct";
import Cartes from "../component/InfosPersonnel/Cartes";
import MaBoutique from "../pages/profil/MaBoutique";
import VendorDashboard from "../component/VendorDashboard";
import { Navigate } from "react-router-dom";
import axios from "axios";

class Infos extends Component{
    constructor(props){
        super(props);
        const itemerge = 10;
        const currentPage = 1;
        const startindex = (currentPage - 1) * itemerge; 
        const endIndex = startindex + itemerge;
        this.state = {
            actuelle: "dashboard",
            iscardaction: false,
            commande : [],
            currentPage: currentPage,
            startindex: startindex,
            endIndex: endIndex,
            itemerge: itemerge,
            totalpage: 0,
            pagin: [],
            indexac: null,
            b: null
        };
    }
    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
            axios.get(`http://127.0.0.1:8000/api/client/${user.id}/commandes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
            .then(res => {
                const commandesList = Array.isArray(res.data) ? res.data : [];
                const { itemerge } = this.state;
                this.setState({
                    commande: commandesList,
                    totalpage: Math.ceil(commandesList.length / itemerge),
                    pagin: commandesList.slice(0, itemerge)
                });
            })
            .catch(err => console.error(err));
        }
    }

    change = (a) => {
        this.setState({
            actuelle: a
        });
    }

    suiv = () => {
        this.setState((prevState) => {
            if(prevState.currentPage < prevState.totalpage){
                const newcure = prevState.currentPage + 1;
                const starti = (newcure - 1) * prevState.itemerge;
                const endi = starti + prevState.itemerge;
                return{
                    currentPage: newcure,
                    startindex: starti,
                    endIndex: endi,
                    pagin: prevState.commande.slice(starti,endi)
                };
            }
        });
    }
    prec = () => {
        this.setState((prevState) => {
            if(prevState.currentPage > 1){
                const newcu = prevState.currentPage - 1;
                const startin = (newcu - 1) * prevState.itemerge;
                const endin = startin + prevState.itemerge;
                return{
                    currentPage: newcu,
                    startindex: startin,
                    endIndex: endin,
                    pagin: prevState.commande.slice(startin,endin)
                }
            }
        })
    }

    togleaction = (ba,index) => {
        this.setState(() => ({
            iscardaction: !this.state.iscardaction,
            b: ba ? {...ba} : null,
            indexac: index !== undefined ? index : null
        }))
    }

    render() {
    return (
        <div>
            {!localStorage.getItem('user') && <Navigate to="/login" />}
            <div className="info">
                <Cardinfos change={this.change} actuelle={this.state.actuelle} />
                <div className="second-card">
                    <div key={this.state.actuelle} className="info-tab-content">
                        {this.state.actuelle === "dashboard" && <VendorDashboard />}
                        {this.state.actuelle === "infos" && <Infospe />}
                        {this.state.actuelle === "adre" && <Mesadr />}
                        {this.state.actuelle === "commad" && (
                            <Commande
                                totalpage={this.state.totalpage}
                                currentPage={this.state.currentPage}
                                pagin={this.state.pagin}
                                togleaction={this.togleaction}
                                iscardaction={this.state.iscardaction}
                                b={this.state.b}
                                prec={this.prec}
                                suiv={this.suiv}
                            />
                        )}
                        {this.state.actuelle === "boutique" && <MaBoutique />}
                        {this.state.actuelle === "favo" && <Favoris />}
                        {this.state.actuelle === "set" && <Settings />}
                        {this.state.actuelle === "product" && <Mesproduct />}
                        {this.state.actuelle === "Cartes" && <Cartes />}
                    </div>
                </div>
            </div>
        </div>
    );
}
}

export default Infos;