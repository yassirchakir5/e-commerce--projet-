import { Component } from "react";
import './Inscrit.css';


class Inscrit extends Component{
    state = {
        step: 1,
        tempdata: {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            auth: "",
            province: "",
            numtel: "",
            CNI: "",
            passport: "",
            cartE: "",
            adrl: "",
            province: "",
            pays: ""
        },
        finaldata: null
    }
    handlechange = (e) => {
        const {name,value,type, files} = e.target;
        if(type === 'file'){
            this.setState({
                tempdata: {...this.state.tempdata, [name]: files[0]}
            });
            return;
        }
        this.setState({
            tempdata: {
                ...this.state.tempdata,
                [name]: value
            }
        });
    }
    nextetap = (e) => {
        e.preventDefault();
        this.setState({
            step: this.state.step + 1
        });
    };
    previset = (e) => {
        e.preventDefault();
        this.setState({
            step: this.state.step - 1
        })
    }

    saveFinal = (e) => {
        e.preventDefault();
        this.setState({
            finaldata: this.state.tempdata
        }, () => {
            console.log(this.state.finaldata);
            
        })
    }
    
    render(){
        const {step,tempdata} = this.state;
        return(
            <div>
                {this.state.step === 1 && 
                    <div className="card-I">
                    <div className="card-Inscrit">
                    <div className="section-title">
                        <h1>Créer un compte</h1>
                    </div>
                    <form onSubmit={this.nextetap}>
                    <div className="section-no-pre">
                        
                        <div className="section-nom">
                            <div>
                                <label htmlFor="nom">Nom</label>
                            </div>
                            <div>
                                <input type="text" placeholder="name" id="nom" name="nom" onChange={this.handlechange} required/>
                            </div>
                        </div>
                        <div className="section-prenom">
                            <div>
                                <label htmlFor="prenom">Prenom</label>
                            </div>
                            <div>
                                <input type="text" placeholder="prenom" id="prenom" name="prenom" onChange={this.handlechange} required/>
                            </div>
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label htmlFor="email">Adresse email</label>
                        </div>
                        <div>
                            <input type="email" placeholder="Adresse email" id="email" name="email" onChange={this.handlechange} required/>
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label htmlFor="password">Mot de passe</label>
                        </div>
                        <div>
                            <input type="password" minLength={8} placeholder="Mot de passe" name="password" id="password" onChange={this.handlechange} required/>
                        </div>
                    </div>
                    <div className="section-form">
                        <div>
                            <label htmlFor="cpassword">Comfirmation le Mot de passe</label>
                        </div>
                        <div>
                            <input type="password" minLength={8} placeholder="Comfirmation le Mot de passe" name="cpassword" id="cpassword" onChange={this.handlechange} required/>
                        </div>
                    </div>
                    <div className="form-con">
                        <input type="submit" className="btn-connect"/>
                    </div>
                    </form>
                    <div className="form-a">
                        <a href="/login">Vous avez already account ?</a>
                    </div>
                </div>
                </div>
                }
                {this.state.step === 2 && 
                    <form onSubmit={this.saveFinal}>
                        <h1 style={{textAlign: 'center'}}>Créer un compte</h1>
                        <div className="step2">
                            <div className="form2">
                                <div>
                                    <label htmlFor="nom">Nom</label>
                                </div>
                                <input type="text" id="nom" name="nom" placeholder="Nom" onChange={this.handlechange} required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="prenom">Prenom</label>
                                </div>
                                <input type="text" id="prenom" name="prenom" placeholder="Prenom" onChange={this.handlechange} required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="email">Adresse email</label>
                                </div>
                                <input type="email" id="email" name="email" placeholder="Adresse email" onChange={this.handlechange} required/>
                            </div>
                            <div className="form2">
                                <div>
                                    <label htmlFor="numtel">Numéro de téléphone</label>
                                </div>
                                <input type="number" id="numtel" name="numtel" placeholder="Numéro de téléphone" onChange={this.handlechange} required/>
                            </div>
                            <select name="auth" onChange={this.handlechange} className="formse" required>
                                <option value="" hidden>Choisir type de pièce d'identité</option>
                                <option value="CNI">CNI</option>
                                <option value="Passport">Passport</option>
                                <option value="Cart">Carte d'etudiant</option>
                            </select>
                            {this.state.tempdata.auth === "CNI" && 
                                <div className="form2">
                                    <div>
                                        <label htmlFor="CNI">CNI</label>
                                    </div>
                                    <input type="text" id="CNI" placeholder="CNI" name="CNI" onChange={this.handlechange} required/>
                                    <div>
                                        <label htmlFor="CNIfr">Saisir l'image recto de CNI</label>
                                    </div>
                                    <input type="file" id="CNIfr" name="CNIfr" onChange={this.handlechange} accept=".jpg,.png,.pdf" required/>
                                    <div style={{marginTop: '20px'}}>
                                        <label htmlFor="CNIfv">Saisir l'image verso de CNI</label>
                                    </div>
                                    <input type="file" id="CNIfv" name="CNIfv" onChange={this.handlechange} accept=".jpg,.png,.pdf" required/>
                                </div>
                                
                            }
                            {this.state.tempdata.auth === "Passport" && 
                                <div className="form2">
                                    <div>
                                        <label htmlFor="Passport">Passport</label>
                                    </div>
                                    <input type="text" id="Passport" name="passport" placeholder="Passport" onChange={this.handlechange} required/>
                                        <div>
                                        <label htmlFor="Passporti">Saisir l'image  de Passport</label>
                                    </div>
                                    <input type="file" id="Passporti" accept=".jpg,.png,.pdf" required/>
                                </div>
                            }
                            {this.state.tempdata.auth === "Cart" && 
                                <div className="form2">
                                <div>
                                    <label htmlFor="Cart">Saisir votre CNE : </label>
                                </div>
                                <input type="text" id="Cart" name="cartE" placeholder="Saisir votre CNE" onChange={this.handlechange} required/>
                                 <div>
                                        <label htmlFor="CNEfr">Saisir l'image recto de la Carte d'etudiant</label>
                                    </div>
                                    <input type="file" id="CNEfr" accept=".jpg,.png,.pdf" required/>
                                    <div style={{marginTop: '20px'}}>
                                        <label htmlFor="CNEfv">Saisir l'image verso de la Carte d'etudiant</label>
                                    </div>
                                    <input type="file" id="CNEfv" accept=".jpg,.png,.pdf" required/>
                            </div>
                            }
                            <div className="form2">
                                <div>
                                    <label htmlFor="adrl">Adrresse local : </label>
                                </div>
                                <input type="text" id="adrl" name="adrl" placeholder="Adrresse local" onChange={this.handlechange} required/>
                            </div>
                            <div>
                                <label htmlFor="province" className="label-select">Province</label>
                                <select name="province" id="province" onChange={this.handlechange} value={tempdata.province} className="formse" required>
                                    <option value="" disabled hidden>-- Choisir province --</option>
                                    <option value="Agadir-Ida-Ou-Tanane">Agadir Ida-Ou-Tanane</option>
                                    <option value="Al Haouz">Al Haouz</option>
                                    <option value="Al Hoceima">Al Hoceima</option>
                                    <option value="Aousserd">Aousserd</option>
                                    <option value="Assa-Zag">Assa-Zag</option>
                                    <option value="Azilal">Azilal</option>
                                    <option value="Beni Mellal">Béni Mellal</option>
                                    <option value="Benslimane">Benslimane</option>
                                    <option value="Berrechid">Berrechid</option>
                                    <option value="Berkane">Berkane</option>
                                    <option value="Boujdour">Boujdour</option>
                                    <option value="Boulemane">Boulemane</option>
                                    <option value="Casablanca">Casablanca</option>
                                    <option value="Chefchaouen">Chefchaouen</option>
                                    <option value="Chichaoua">Chichaoua</option>
                                    <option value="Chtouka-Ait Baha">Chtouka-Aït Baha</option>
                                    <option value="Dakhla-Oued Ed-Dahab">Dakhla - Oued Ed-Dahab</option>
                                    <option value="Driouch">Driouch</option>
                                    <option value="El Hajeb">El Hajeb</option>
                                    <option value="El Jadida">El Jadida</option>
                                    <option value="Errachidia">Errachidia</option>
                                    <option value="Es-Semara">Es-Semara</option>
                                    <option value="Essaouira">Essaouira</option>
                                    <option value="Fahs-Anjra">Fahs-Anjra</option>
                                    <option value="Fes">Fès</option>
                                    <option value="Figuig">Figuig</option>
                                    <option value="Fquih Ben Salah">Fquih Ben Salah</option>
                                    <option value="Guelmim">Guelmim</option>
                                    <option value="Guercif">Guercif</option>
                                    <option value="Ifrane">Ifrane</option>
                                    <option value="Inezgane-Ait Melloul">Inezgane-Aït Melloul</option>
                                    <option value="Jerada">Jerada</option>
                                    <option value="El Kelaa des Sraghna">El Kelaâ des Sraghna</option>
                                    <option value="Kenitra">Kénitra</option>
                                    <option value="Khemisset">Khémisset</option>
                                    <option value="Khenifra">Khénifra</option>
                                    <option value="Khouribga">Khouribga</option>
                                    <option value="Laayoune">Laâyoune</option>
                                    <option value="Larache">Larache</option>
                                    <option value="Marrakech">Marrakech</option>
                                    <option value="Mediouna">Médiouna</option>
                                    <option value="Meknes">Meknès</option>
                                    <option value="Midelt">Midelt</option>
                                    <option value="Mohammedia">Mohammédia</option>
                                    <option value="Moulay Yacoub">Moulay Yacoub</option>
                                    <option value="Nador">Nador</option>
                                    <option value="Nouaceur">Nouaceur</option>
                                    <option value="Ouarzazate">Ouarzazate</option>
                                    <option value="Oued Ed-Dahab">Oued Ed-Dahab</option>
                                    <option value="Oujda-Angad">Oujda-Angad</option>
                                    <option value="Ouezzane">Ouezzane</option>
                                    <option value="Rabat">Rabat</option>
                                    <option value="Rehamna">Rehamna</option>
                                    <option value="Safi">Safi</option>
                                    <option value="Sefrou">Sefrou</option>
                                    <option value="Settat">Settat</option>
                                    <option value="Sidi Bennour">Sidi Bennour</option>
                                    <option value="Sidi Ifni">Sidi Ifni</option>
                                    <option value="Sidi Kacem">Sidi Kacem</option>
                                    <option value="Sidi Slimane">Sidi Slimane</option>
                                    <option value="Skhirate-Temara">Skhirate-Témara</option>
                                    <option value="Tarfaya">Tarfaya</option>
                                    <option value="Taroudant">Taroudant</option>
                                    <option value="Tata">Tata</option>
                                    <option value="Taounate">Taounate</option>
                                    <option value="Taourirt">Taourirt</option>
                                    <option value="Taza">Taza</option>
                                    <option value="Tetouan">Tétouan</option>
                                    <option value="Tinghir">Tinghir</option>
                                    <option value="Tiznit">Tiznit</option>
                                    <option value="Youssoufia">Youssoufia</option>
                                    <option value="Zagora">Zagora</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="pays" className="label-select">Pays</label>
                                <select name="pays" id="pays" onChange={this.handlechange} value={tempdata.pays} className="formse" required>
                                    <option value="" disabled hidden>-- Choisir pays --</option>
                                    <option value="Afghanistan">Afghanistan</option>
                                    <option value="Afrique du Sud">Afrique du Sud</option>
                                    <option value="Albanie">Albanie</option>
                                    <option value="Algerie">Algérie</option>
                                    <option value="Allemagne">Allemagne</option>
                                    <option value="Andorre">Andorre</option>
                                    <option value="Angola">Angola</option>
                                    <option value="Antigua-et-Barbuda">Antigua-et-Barbuda</option>
                                    <option value="Arabie Saoudite">Arabie Saoudite</option>
                                    <option value="Argentine">Argentine</option>
                                    <option value="Armenie">Arménie</option>
                                    <option value="Australie">Australie</option>
                                    <option value="Autriche">Autriche</option>
                                    <option value="Azerbaidjan">Azerbaïdjan</option>
                                    <option value="Bahamas">Bahamas</option>
                                    <option value="Bahrein">Bahreïn</option>
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="Barbade">Barbade</option>
                                    <option value="Belgique">Belgique</option>
                                    <option value="Belize">Belize</option>
                                    <option value="Benin">Bénin</option>
                                    <option value="Bhoutan">Bhoutan</option>
                                    <option value="Bielorussie">Biélorussie</option>
                                    <option value="Birmanie">Birmanie</option>
                                    <option value="Bolivie">Bolivie</option>
                                    <option value="Bosnie-Herzegovine">Bosnie-Herzégovine</option>
                                    <option value="Botswana">Botswana</option>
                                    <option value="Bresil">Brésil</option>
                                    <option value="Brunei">Brunei</option>
                                    <option value="Bulgarie">Bulgarie</option>
                                    <option value="Burkina Faso">Burkina Faso</option>
                                    <option value="Burundi">Burundi</option>
                                    <option value="Cambodge">Cambodge</option>
                                    <option value="Cameroun">Cameroun</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Cap-Vert">Cap-Vert</option>
                                    <option value="Centrafrique">République Centrafricaine</option>
                                    <option value="Chili">Chili</option>
                                    <option value="Chine">Chine</option>
                                    <option value="Chypre">Chypre</option>
                                    <option value="Colombie">Colombie</option>
                                    <option value="Comores">Comores</option>
                                    <option value="Congo">Congo</option>
                                    <option value="Congo RDC">Congo RDC</option>
                                    <option value="Costa Rica">Costa Rica</option>
                                    <option value="Cote d'Ivoire">Côte d'Ivoire</option>
                                    <option value="Croatie">Croatie</option>
                                    <option value="Cuba">Cuba</option>
                                    <option value="Danemark">Danemark</option>
                                    <option value="Djibouti">Djibouti</option>
                                    <option value="Dominique">Dominique</option>
                                    <option value="Egypte">Égypte</option>
                                    <option value="Emirats Arabes Unis">Émirats Arabes Unis</option>
                                    <option value="Equateur">Équateur</option>
                                    <option value="Erythree">Érythrée</option>
                                    <option value="Espagne">Espagne</option>
                                    <option value="Estonie">Estonie</option>
                                    <option value="Eswatini">Eswatini</option>
                                    <option value="Etats-Unis">États-Unis</option>
                                    <option value="Ethiopie">Éthiopie</option>
                                    <option value="Fidji">Fidji</option>
                                    <option value="Finlande">Finlande</option>
                                    <option value="France">France</option>
                                    <option value="Gabon">Gabon</option>
                                    <option value="Gambie">Gambie</option>
                                    <option value="Georgie">Géorgie</option>
                                    <option value="Ghana">Ghana</option>
                                    <option value="Grece">Grèce</option>
                                    <option value="Grenade">Grenade</option>
                                    <option value="Guatemala">Guatemala</option>
                                    <option value="Guinee">Guinée</option>
                                    <option value="Guinee-Bissau">Guinée-Bissau</option>
                                    <option value="Guinee equatoriale">Guinée équatoriale</option>
                                    <option value="Guyana">Guyana</option>
                                    <option value="Haiti">Haïti</option>
                                    <option value="Honduras">Honduras</option>
                                    <option value="Hongrie">Hongrie</option>
                                    <option value="Inde">Inde</option>
                                    <option value="Indonesie">Indonésie</option>
                                    <option value="Irak">Irak</option>
                                    <option value="Iran">Iran</option>
                                    <option value="Irlande">Irlande</option>
                                    <option value="Islande">Islande</option>
                                    <option value="Israel">Israël</option>
                                    <option value="Italie">Italie</option>
                                    <option value="Jamaique">Jamaïque</option>
                                    <option value="Japon">Japon</option>
                                    <option value="Jordanie">Jordanie</option>
                                    <option value="Kazakhstan">Kazakhstan</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="Kirghizistan">Kirghizistan</option>
                                    <option value="Kiribati">Kiribati</option>
                                    <option value="Koweit">Koweït</option>
                                    <option value="Laos">Laos</option>
                                    <option value="Lesotho">Lesotho</option>
                                    <option value="Lettonie">Lettonie</option>
                                    <option value="Liban">Liban</option>
                                    <option value="Liberia">Liberia</option>
                                    <option value="Libye">Libye</option>
                                    <option value="Liechtenstein">Liechtenstein</option>
                                    <option value="Lituanie">Lituanie</option>
                                    <option value="Luxembourg">Luxembourg</option>
                                    <option value="Macedoine du Nord">Macédoine du Nord</option>
                                    <option value="Madagascar">Madagascar</option>
                                    <option value="Malaisie">Malaisie</option>
                                    <option value="Malawi">Malawi</option>
                                    <option value="Maldives">Maldives</option>
                                    <option value="Mali">Mali</option>
                                    <option value="Malte">Malte</option>
                                    <option value="Maroc">Maroc</option>
                                    <option value="Marshall">Îles Marshall</option>
                                    <option value="Maurice">Maurice</option>
                                    <option value="Mauritanie">Mauritanie</option>
                                    <option value="Mexique">Mexique</option>
                                    <option value="Micronesie">Micronésie</option>
                                    <option value="Moldavie">Moldavie</option>
                                    <option value="Monaco">Monaco</option>
                                    <option value="Mongolie">Mongolie</option>
                                    <option value="Montenegro">Monténégro</option>
                                    <option value="Mozambique">Mozambique</option>
                                    <option value="Namibie">Namibie</option>
                                    <option value="Nauru">Nauru</option>
                                    <option value="Nepal">Népal</option>
                                    <option value="Nicaragua">Nicaragua</option>
                                    <option value="Niger">Niger</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Norvege">Norvège</option>
                                    <option value="Nouvelle-Zelande">Nouvelle-Zélande</option>
                                    <option value="Oman">Oman</option>
                                    <option value="Ouganda">Ouganda</option>
                                    <option value="Ouzbekistan">Ouzbékistan</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="Palaos">Palaos</option>
                                    <option value="Palestine">Palestine</option>
                                    <option value="Panama">Panama</option>
                                    <option value="Papouasie-Nouvelle-Guinee">Papouasie-Nouvelle-Guinée</option>
                                    <option value="Paraguay">Paraguay</option>
                                    <option value="Pays-Bas">Pays-Bas</option>
                                    <option value="Perou">Pérou</option>
                                    <option value="Philippines">Philippines</option>
                                    <option value="Pologne">Pologne</option>
                                    <option value="Portugal">Portugal</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Roumanie">Roumanie</option>
                                    <option value="Royaume-Uni">Royaume-Uni</option>
                                    <option value="Russie">Russie</option>
                                    <option value="Rwanda">Rwanda</option>
                                    <option value="Saint-Kitts-et-Nevis">Saint-Kitts-et-Nevis</option>
                                    <option value="Saint-Marin">Saint-Marin</option>
                                    <option value="Sainte-Lucie">Sainte-Lucie</option>
                                    <option value="Salomon">Îles Salomon</option>
                                    <option value="Salvador">Salvador</option>
                                    <option value="Samoa">Samoa</option>
                                    <option value="Sao Tome-et-Principe">Sao Tomé-et-Principe</option>
                                    <option value="Senegal">Sénégal</option>
                                    <option value="Serbie">Serbie</option>
                                    <option value="Seychelles">Seychelles</option>
                                    <option value="Sierra Leone">Sierra Leone</option>
                                    <option value="Singapour">Singapour</option>
                                    <option value="Slovaquie">Slovaquie</option>
                                    <option value="Slovenie">Slovénie</option>
                                    <option value="Somalie">Somalie</option>
                                    <option value="Soudan">Soudan</option>
                                    <option value="Soudan du Sud">Soudan du Sud</option>
                                    <option value="Sri Lanka">Sri Lanka</option>
                                    <option value="Suede">Suède</option>
                                    <option value="Suisse">Suisse</option>
                                    <option value="Suriname">Suriname</option>
                                    <option value="Syrie">Syrie</option>
                                    <option value="Tadjikistan">Tadjikistan</option>
                                    <option value="Tanzanie">Tanzanie</option>
                                    <option value="Tchad">Tchad</option>
                                    <option value="Tchequie">Tchéquie</option>
                                    <option value="Thailande">Thaïlande</option>
                                    <option value="Timor oriental">Timor oriental</option>
                                    <option value="Togo">Togo</option>
                                    <option value="Tonga">Tonga</option>
                                    <option value="Trinite-et-Tobago">Trinité-et-Tobago</option>
                                    <option value="Tunisie">Tunisie</option>
                                    <option value="Turkmenistan">Turkménistan</option>
                                    <option value="Turquie">Turquie</option>
                                    <option value="Tuvalu">Tuvalu</option>
                                    <option value="Ukraine">Ukraine</option>
                                    <option value="Uruguay">Uruguay</option>
                                    <option value="Vanuatu">Vanuatu</option>
                                    <option value="Vatican">Vatican</option>
                                    <option value="Venezuela">Venezuela</option>
                                    <option value="Vietnam">Vietnam</option>
                                    <option value="Yemen">Yémen</option>
                                    <option value="Zambie">Zambie</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                            </div>
                        </div>
                        <div className="btn-prsu">
                            <button onClick={this.previset}>Precedent</button>
                            <input type="submit" className="btn-connect"/>
                        </div>
                    </form>
                }
                </div>
            
        )
    }
}

export default Inscrit;