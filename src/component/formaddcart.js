import { Component } from "react";

class Formatcar extends Component{
    render(){
        return(
            <div className="form-addcar">
                <form>
                    <div className="input-group">
                        <label htmlFor="nomca">Nom sur la carte</label>
                        <input type="text" id="nomca" name="nomca" placeholder="ex: YASSIR CHAKIR" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="numca">Numéro de carte</label>
                        <input type="number" id="numca" name="numca" placeholder="0000 0000 0000 0000" />
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="dateE">Date d'expiration (MM/AA)</label>
                            <input type="text" id="dateE" name="dateE" placeholder="MM/AA" />
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="CVV">Cryptogramme visuel (CVV)</label>
                            <input type="text" id="CVV" name="CVV" placeholder="..." />
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