import { Component } from "react";
import { ChevronDown, Search } from "lucide-react";

class Barvoirto extends Component{
    render(){
        return(
            <div className="der-pro">
                <h2>Dernier Produits</h2>
                <button className="btn-tout" onClick={() => {window.location.href='/dernierprodu'}}>
                    Voir tout <ChevronDown className="w-4" />
                </button>
            </div>
        )
    }
}

export default Barvoirto;