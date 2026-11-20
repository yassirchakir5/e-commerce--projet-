import { Component } from "react";
import '../assets/infos.css';
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


const genererCommandes = () => {
    const statuts = ['Livrée', 'En cours', 'Expédiée', 'Annulée'];
    let faussesCommandes = [];

    for (let i = 1; i <= 50; i++) {
        const statutAleatoire = statuts[Math.floor(Math.random() * statuts.length)];
        
        const totalAleatoire = (Math.random() * (1500 - 50) + 50).toFixed(2);
        
        const jour = Math.floor(Math.random() * 28) + 1;
        const mois = Math.floor(Math.random() * 12) + 1;
        const dateAleatoire = `${jour < 10 ? '0'+jour : jour}/${mois < 10 ? '0'+mois : mois}/2024`;

        faussesCommandes.push({
            numero: `#10025${300 + i}`,
            date: dateAleatoire,
            statut: statutAleatoire,
            total: `${totalAleatoire} MAD`,
            articlesQuantite: Math.floor(Math.random() * 4) + 1 
        });
    }
    return faussesCommandes;
};

class Infos extends Component{
    constructor(props){
        super(props);
        const commandes = genererCommandes();
        const itemerge = 10;
        const currentPage = 1;
        const startindex = (currentPage - 1) * itemerge; 
        const endIndex = startindex + itemerge;
        this.state = {
            actuelle: "dashboard",
            iscardaction: false,
            commande : commandes,
            currentPage: currentPage,
            startindex: startindex,
            endIndex: endIndex,
            itemerge: itemerge,
            totalpage: Math.ceil(commandes.length/itemerge),
            pagin: commandes.slice(startindex,endIndex),
            indexac: null,
            b: null
        };
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

    render(){
        return(
            <div>
                {!localStorage.getItem('user') && 
                    <Navigate to="/login" />
                }
                <div className="info">
                    {<Cardinfos change = {this.change} /> }
                    <div className="second-card">
                        {this.state.actuelle === "dashboard" && (
                            <VendorDashboard />
                        )}
                        {this.state.actuelle === "infos" && (
                            <Infospe />
                        )}
                        {this.state.actuelle === "adre" && (
                            <Mesadr />
                        )}
                        {this.state.actuelle === "commad" && (
                            <Commande totalpage = {this.state.totalpage} currentPage = {this.state.currentPage} pagin = {this.state.pagin}
                                togleaction = {this.togleaction} iscardaction = {this.state.iscardaction} b = {this.state.b}prec = {this.prec} suiv = {this.suiv} />
                        )}
                        {this.state.actuelle === "boutique" && <MaBoutique />}
                        {this.state.actuelle === "favo" && (
                            <Favoris  />
                        )}
                        {this.state.actuelle === "set" && (
                            <Settings />
                        )}
                        {this.state.actuelle === "product" && (
                            <Mesproduct />
                        )}
                        {this.state.actuelle === "Cartes" && (
                            <Cartes />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Infos;