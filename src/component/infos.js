import { Component } from "react";
import { FaUser } from "react-icons/fa";
import './infos.css';
import { FaAddressCard } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FiBox } from "react-icons/fi";
import { FaPen } from "react-icons/fa"; 
import { FaTrash } from "react-icons/fa";

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
            iscardopen: false,
            iscardajoopen: false,
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
            ],
            a: null,
            editIndex: null,
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

    togllecardaj = () => {
        this.setState(() => ({
            iscardajoopen: !this.state.iscardajoopen
        }));
    };

    togllecard = (a,index) => {
        this.setState(() => ({
            iscardopen: !this.state.iscardopen,
            a: a ? {...a}: null,
            editIndex: index !== undefined ? index : null
        }));
    };
    
    modifier = (e,field) => {
        const modif = e.target.value;
        this.setState((prevState) => ({
            a:{
                ...prevState.a,
                [field] : modif
            }
        }));
    }
    
    saveChange = () => {
        this.setState((prevState) => {
            const updatea = [...prevState.addres];
            if(prevState.editIndex !== null){
                updatea[prevState.editIndex] = prevState.a;
            }
            return {
                addres: updatea,
                iscardopen: false,
                a: null,
                editIndex: null
            };
        });
    }

    ajouaddre = (e,field) => {
        const newa = e.target.value;
        this.setState((prevState) => ({
            a:{
                ...prevState.a,
                [field]: newa
            }
        }));
    }

    saveajou = () => {
        this.setState((prevState) => ({
            addres: [...prevState.addres,prevState.a],
            a: null,
            iscardajoopen: false
        }))
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
                <div className="info">
                    <div className="card-btns">
                        <button className="menu-icon active" onClick={() => {this.change("infos")}}><FaUser className="settings"/>Information Personnel</button>
                        <button className="menu-icon" onClick={() => {this.change("adre")}}> <FaAddressCard className="settings"/> Mes Addresses</button>
                        <button className="menu-icon" onClick={() => {this.change("commad")}}><FiBox className="settings"/> Mes commandes</button>
                        <button className="menu-icon" onClick={() => {this.change("favo")}}><MdFavoriteBorder className="settings"/>Mes Favoris</button>
                        <button className="menu-icon" onClick={() => {this.change("set")}}><CiSettings className="settings" />Settings</button>
                    </div>
                    <div className="second-card">
                        {this.state.actuelle === "infos" && (
                            <div>
                                <h1>Mes informations Personnel</h1>
                                <p className="pad"><strong>Nom </strong> : Yassir</p>
                                <p className="pad"><strong>Prenom </strong> : Chakir</p>
                                <p className="pad"><strong>email </strong> :yassirchakir5@gmail.com</p>
                                <p className="pad"><strong>adresse de livraison </strong> : Ouled teima dounia 2</p>
                                <p className="pad"><strong>CNE </strong> : JT117484</p>
                                <p className="pad"><strong>Numéro de téléphone </strong> : 0777040217</p>
                            </div>
                        )}
                        {this.state.actuelle === "adre" && (
                            <div>
                                <h1>Mes Addresses</h1>
                                <button className="btnajoa" onClick={this.togllecardaj}>Ajoute une nouvelle addresse</button>
                                {this.state.iscardajoopen && (
                                        <div className="overlay">
                                            <div className="card">
                                                <div className="carsHeader">
                                                    <h2 style={{margin: 0,fontStyle: 'italic', color: '#333'}}>Modifier L'addresse</h2>
                                                </div>

                                                <div className="cardBody">
                                                        <input type="text" placeholder="Title"  className="input" onChange={(e) => {this.ajouaddre(e,"title")}}/>
                                                        <input type="text" placeholder="addresse" className="input" onChange={(e) => {this.ajouaddre(e,"addresse")}}/>
                                                        <input type="text" placeholder="pays" className="input" onChange={(e) => {this.ajouaddre(e,"pays")}}/>
                                                        <input type="text" placeholder="numéro de téléphone" className="input" onChange={(e) => {this.ajouaddre(e,"numtel")}}/>
                                                        <button className="btnmodif" onClick={this.saveajou}>Modifier</button>
                                                        <button className="btnferm" onClick={this.togllecardaj}>Fermer</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                <div className="adre">
                                    
                                    {this.state.addres.map((a,index) => {
                                        return <div className="cardadr">
                                                <h3 key={index}>{a.title}</h3>
                                                <p key={index} className="pad">{a.addresse}</p>
                                                <p key={index} className="pad">{a.pays}</p>
                                                <p key={index} className="pad">{a.numtel}</p>
                                                <button onClick={() => {this.togllecard(a,index)}}><FaPen /> Modifier</button>
                                                <button onClick={() => {this.supp(index)}}><FaTrash /> Supprimer</button>
                                            </div>
                                    })}
                                    {this.state.iscardopen && (
                                        <div className="overlay">
                                            <div className="card">
                                                <div className="carsHeader">
                                                    <h2 style={{margin: 0,fontStyle: 'italic', color: '#333'}}>Modifier L'addresse</h2>
                                                </div>

                                                <div className="cardBody">
                                                        <input type="text" value={this.state.a.title} className="input" onChange={(e) => {this.modifier(e,"title")}} />
                                                        <input type="text" value={this.state.a.addresse} className="input" onChange={(e) => {this.modifier(e,"addresse")}}/>
                                                        <input type="text" value={this.state.a.pays} className="input" onChange={(e) => {this.modifier(e,"pays")}}/>
                                                        <input type="text" value={this.state.a.numtel} className="input" onChange={(e) => {this.modifier(e,"numtel")}}/>
                                                        <button className="btnmodif" onClick={this.saveChange}>Modifier</button>
                                                        <button className="btnferm" onClick={() => {this.togllecard(null,null)}}>Fermer</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {this.state.addres.length === 0 && (
                                        <h2>Aucun address available</h2>
                                    )}
                                
                            </div>
                        )}
                        {this.state.actuelle === "commad" && (
                            <div>
                                <h1>Mes commandes</h1>
                                <table border={1} className="tab">
                                    <thead className="table-head">
                                        <tr>
                                            <th className="tco">Numéro de la commandes</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {this.state.pagin.map((com,index) => {
                                            return (<tr key={index}>
                                                <td>{com.numero}</td>
                                                <td>{com.date}</td>
                                                <td>{com.statut}</td>
                                                <td>{com.total}</td>
                                                <td><button onClick={() => {this.togleaction(com,index)}}>Voir détaille</button></td>
                                            </tr>
                                            )
                                        })}
                                        
                                    </tbody>
                                </table>
                                {this.state.iscardaction && this.state.b && (
                                    <div className="overlay">
                                        <div className="card" style={{ width: '450px' }}>
                                            <div className="carsHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h2 style={{margin: 0, color: '#333'}}>Détails de la commande</h2>
                                                <button onClick={() => {this.togleaction(null)}} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✖</button>
                                            </div>

                                            <div className="cardBozdy" style={{marginTop: '15px' }}>
                                                <p style={{ margin: '5px 0' }}><strong>Commande :</strong> {this.state.b.numero}</p>
                                                <p style={{ margin: '5px 0' }}><strong>Date :</strong> {this.state.b.date}</p>
                                                <p style={{ margin: '15px 0' }}>
                                                    <strong>Statut : </strong> 
                                                    <span style={{ padding: '4px 10px', borderRadius: '15px', backgroundColor: '#e2e3e5', fontWeight: 'bold' }}>
                                                        {this.state.b.statut}
                                                    </span>
                                                </p>
                                                
                                                <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '15px 0' }} />
                                                
                                                <p style={{ margin: '5px 0' }}><strong>Quantité d'articles :</strong> {this.state.b.articlesQuantite}</p>
                                                
                                                <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '15px 0' }} />
                                                
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                                                    <strong>Total :</strong>
                                                    <strong>{this.state.b.total}</strong>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                                                    <button className="btnmodif" onClick={() => {this.togleaction(null)}} style={{ padding: '10px 30px' }}>Fermer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="btnsuipre">
                                    <button disabled={this.state.currentPage === 1} onClick={() => {this.prec()}}>Precedent</button>
                                    <p>{this.state.currentPage}/{this.state.totalpage}</p>
                                    <button disabled={this.state.currentPage === this.state.totalpage} onClick={() => {this.suiv()}}>Suivant</button>
                                </div>
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