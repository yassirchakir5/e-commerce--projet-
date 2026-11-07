import { Component } from "react";

class Settings extends Component{
    render(){
        return(
            <div>
                <h1>Settings</h1>
                <div>
                    <h2 style={{textAlign: 'left'}}>Mes information Personnel : </h2>
                    <div className="div-inpt">
                        <label for="nom">Nom : </label>
                        <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                            <input type="text" id="nom" value={this.props.mesinfos.name} className="input" onChange={(e) => {this.props.modifierpro(e,"name")}} />
                            <button className="btnmod" onClick={() => {this.props.savechangepro("name")}}>Modifier</button> 
                        </div>
                    </div>
                    <div className="div-inpt">
                        <label for="prenom">Prenom : </label>
                        <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                            <input type="text" id="prenom" value={this.props.mesinfos.prenom} className="input" onChange={(e) => {this.props.modifierpro(e,"prenom")}}/>
                            <button className="btnmod" onClick={() => {this.props.savechangepro("prenom")}}>Modifier</button> 
                            </div>
                    </div>
                    <div className="div-inpt">
                        <label for="email">Email : </label>
                        <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                            <input type="email" id="email" value={this.props.mesinfos.email} className="input" onChange={(e) => {this.props.modifierpro(e,"email")}}/>
                            <button className="btnmod" onClick={() => {this.props.savechangepro("email")}}>Modifier</button> 
                        </div>
                    </div>
                    <div className="div-inpt">
                        <label for="adr">Addresse : </label>
                        <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                            <input type="text" id="adr" value={this.props.mesinfos.addresse} className="input" onChange={(e) => {this.props.modifierpro(e,"addresse")}}/>
                            <button className="btnmod" onClick={() => {this.props.savechangepro("addresse")}}>Modifier</button> 
                        </div>
                    </div>
                    <div className="div-inpt">
                        <label for="cne">CNE : </label>
                        <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                            <input type="text" id="cne" value={this.props.mesinfos.CNE} className="input" onChange={(e) => {this.props.modifierpro(e,"CNE")}} />
                            <button className="btnmod" onClick={() => {this.props.savechangepro("CNE")}}>Modifier</button> 
                        </div>
                    </div>
                    <div className="div-inpt">
                        <label for="numtel">Numéro de téléphone : </label>
                        <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                            <input type="number" id="numtel" value={this.props.mesinfos.numtel} className="input" onChange={(e) => {this.props.modifierpro(e,"numtel")}}/>
                            <button className="btnmod" onClick={() => {this.props.savechangepro("numtel")}}>Modifier</button> 
                        </div>
                    </div>
                    <div className="btn-bat basp">
                        <button className="btnmod">Déconnexion</button>
                        <button className="btnmod">Supprimer Account</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings;