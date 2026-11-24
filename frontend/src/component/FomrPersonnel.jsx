import { Component } from "react";

class FomrPersonnel extends Component{
    render(){
        return(
            <>
                <h1>Settings</h1>
                <div>
                    <fieldset>
                        <legend style={{fontSize: '20px'}}>Mes information Personnel : </legend>
                        <div className="div-inpt">
                        <label htmlFor="nom">Name : </label>
                        <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                            <input type="text" id="nom" value={this.props.name} className="input" name="name"  onChange={this.props.handlechange} />
                        </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="prenom">Prenom : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="text" id="prenom" name="prenom" value={this.props.prenom} className="input" onChange={this.props.handlechange}/>
                                </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="email">Email : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="email" id="email" name="email" value={this.props.email} className="input" onChange={this.props.handlechange}/>
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="adr">Addresse : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="text" id="adr" name="addresselocal" value={this.props.addresselocal} className="input" onChange={this.props.handlechange}/>
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="Pays">Pays : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="text" id="Pays" name="pays" value={this.props.pays} className="input" onChange={this.props.handlechange}/>
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="date_naissance">date naissance : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="date" id="date_naissance" name="date_naissance" value={this.props.date_naissance} className="input" onChange={this.props.handlechange}/>
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="CNI">CNI : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="text" id="CNI" name="CNI" value={this.props.CNI} className="input" onChange={this.props.handlechange} />
                               
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="numtel">Numéro de téléphone : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="number" id="numtel" name="numtel" value={this.props.numtel} className="input" onChange={this.props.handlechange}/>
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="path_img">Image de profile : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="file" id="path_img" name="path_img" accept="image/*" className="input" onChange={this.props.handlechange}/>
                                {this.props.current_img && (
                                <img 
                                    src={encodeURI(`http://127.0.0.1:8000/storage/${this.props.current_img}`)} 
                                    alt="Profil" 
                                    style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                />
                                )}                           
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="path_CNIfr">Image de CNI recto : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="file" id="path_CNIfr" name="path_CNIfr" accept="image/*" className="input" onChange={this.props.handlechange}/>
                                {this.props.current_CNIfr && (
                                <img 
                                    src={encodeURI(`http://127.0.0.1:8000/storage/${this.props.current_CNIfr}`)} 
                                    alt="Profil" 
                                    style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                />
                                )}                           
                            </div>
                        </div>
                        <div className="div-inpt">
                            <label htmlFor="path_CNIfv">Image de CNI verso : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="file" id="path_CNIfv" name="path_CNIfv" accept="image/*" className="input" onChange={this.props.handlechange}/>
                                {this.props.current_CNIfv && (
                                <img 
                                    src={encodeURI(`http://127.0.0.1:8000/storage/${this.props.current_CNIfv}`)} 
                                    alt="Profil" 
                                    style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                />
                                )}                           
                            </div>
                        </div>
                    </fieldset>
                    <fieldset style={{marginTop: "20px"}}>
                        <legend>Modifier le mot de passe : </legend>
                        <label htmlFor="password">Nouveau mot de passe : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="password" id="password" name="password" value={this.props.password} className="input" onChange={this.props.handlechange}/>
                            </div>
                            <label htmlFor="cpassword">Confirmation le nouveau mot de passe : </label>
                            <div style={{display: 'flex', width: '100%',gap: '10px'}}>
                                <input type="password" id="cpassword" name="cpassword" value={this.props.cpassword} className="input" onChange={this.props.handlechange}/>
                            </div>
                    </fieldset>
                    <div className="btn-bat basp" style={{marginTop: "20px"}}>
                        <button className="btnmod-deco" onClick={this.props.handlelogout}>Déconnexion</button>
                         <button className="btnmod" onClick={this.props.handlesubmit}>Modifier</button> 
                        <button className="btnmod-suppri" onClick={this.props.handlesupprimer} >Supprimer le compte</button>
                    </div>
                </div>
            </>
        )
    }
}

export default FomrPersonnel;