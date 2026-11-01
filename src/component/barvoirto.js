import { Component } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";

class Barvoirto extends Component{
    render(){
        return(
            <div className="der-pro">
                <h2>Dernier Produits</h2>
                <Link to="/dernierprodu" style={{textDecoration: 'none'}}>
                    <button className="btn-tout" >
                        Voir tout <ChevronDown className="w-4" />
                    </button>
                </Link>
            </div>
        )
    }
}

export default Barvoirto;