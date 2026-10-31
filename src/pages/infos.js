import { Component } from "react";
import './infos.css';
import Infospe from "../component/infospe";
import Mesadr from "../component/mesadr";
import Commande from "../component/command";
import Favoris from "../component/favoris";
import Settings from "../component/settings";
import Cardinfos from "../component/card-info";
import Mesproduct from "../component/mesproduct";
import mesadr from "../data/mesadress.json";
import mesinf from "../data/mesinfos.json"

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
            actuelle: "infos",
            addres: mesadr,
            mesinfos: mesinf,
            iscardaction: false,
            commande : commandes,
            currentPage: currentPage,
            startindex: startindex,
            endIndex: endIndex,
            itemerge: itemerge,
            totalpage: Math.ceil(commandes.length/itemerge),
            pagin: commandes.slice(startindex,endIndex),
            indexac: null,
            b: null,
            favo: [
                {
                    id: 1,
                    image: "images/product/redmi_note_15_4g.jpg",
                    name: "Redmi note 15 4g",
                    prix: "2000 DH"
                },
                {
                    id: 2,
                    image: "images/product/redmi_note_15_4g.jpg",
                    name: "Redmi note 15 4g",
                    prix: "2000 DH"
                }
            ]
        };
    }
    // supprimer les addresses
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

    modifierpro = (e,field) => {
        const valuep = e.target.value;
        this.setState((prevState) => ({
            mesinfos:{
                ...prevState.mesinfos,
                [field]: valuep
            }
        }));
    }

    savechangepro = (field) => {
        alert(`Change avec succes ${this.state.mesinfos[field]}`)
    }
    
    saveChange = (adresseModifiee, index) => {
        this.setState((prevState) => {
            const updatea = [...prevState.addres];
            if (index !== null) {
                updatea[index] = adresseModifiee;
            }
            return {
                addres: updatea
            };
        });
    }   

    saveajou = (nouvelleAdresse) => {
        this.setState((prevState) => ({
            addres: [...prevState.addres, nouvelleAdresse]
        }));
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

    supprif = (indexs) => {
        const nouvf = this.state.favo.filter((_,index) => index !== indexs);

        this.setState({
            favo: nouvf
        });
    };

    render(){
        return(
            <div>
                <div className="info">
                    {<Cardinfos
                        change = {this.change}
                    />}
                    <div className="second-card">
                        {this.state.actuelle === "infos" && (
                            <Infospe mesi ={this.state.mesinfos}/>
                        )}
                        {this.state.actuelle === "adre" && (
                            <Mesadr addres={this.state.addres} 
                                supprimer={this.supp} 
                                ajouter={this.saveajou}
                                modifier={this.saveChange}
                            />
                        )}
                        {this.state.actuelle === "commad" && (
                            <Commande totalpage = {this.state.totalpage}
                                currentPage = {this.state.currentPage}
                                pagin = {this.state.pagin}
                                togleaction = {this.togleaction}
                                iscardaction = {this.state.iscardaction}
                                b = {this.state.b}
                                prec = {this.prec}
                                suiv = {this.suiv}
                            />
                        )}
                        {this.state.actuelle === "favo" && (
                            <Favoris 
                                favo = {this.state.favo}
                                supprif = {this.supprif}
                            />
                        )}
                        {this.state.actuelle === "set" && (
                            <Settings 
                                mesinfos = {this.state.mesinfos}
                                savechangepro = {this.savechangepro}
                                modifierpro = {this.modifierpro}
                            />
                        )}
                        {this.state.actuelle === "product" && (
                            <Mesproduct />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Infos;