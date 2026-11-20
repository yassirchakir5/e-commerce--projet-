import { Component } from "react";

class Formatcar extends Component{
    render(){
        return(
            <div className="form-addcar">
                <form onSubmit={this.props.handlesubmit}>
                    <div className="input-group">
                        <label htmlFor="nomca">Nom sur la carte</label>
                        <input type="text" id="nomca" name="nom" placeholder="ex: YASSIR CHAKIR" onChange={this.props.handlechange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="numca">Numéro de carte</label>
                        <input type="number" id="numca" name="numC" placeholder="0000 0000 0000 0000" onChange={this.props.handlechange}/>
                        {this.props.erreurs.numC && (
                            <p style={{color: "red",fontSize: '13px'}}>
                                {this.props.erreurs.numC[0]}
                            </p>
                        )}
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="dateE">Date d'expiration (MM/AA)</label>
                            <input type="text" id="dateE" name="dateEx" placeholder="MM/AA" onChange={this.props.handlechange}/>
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="CVV">Cryptogramme visuel (CVV)</label>
                            <input type="text" id="CVV" name="CVV" placeholder="..." onChange={this.props.handlechange}/>
                        </div>
                        
                    </div>
                    <div>
                        <input type="submit" className="sub"/>
                    </div>
                </form>
            </div>  
        )
    }
}

export default Formatcar;