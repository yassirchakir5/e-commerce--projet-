import { Component } from "react";
import { FaLaptop, FaTshirt, FaCouch, FaPaintBrush } from 'react-icons/fa';
import { Armchair } from "lucide-react";
import { Smartphone, Sparkles } from 'lucide-react';


class Categories extends Component{   
    render(){
        return(
            <div>
                <div className="gap-4">
                    <a href="/categorie/Electronique" style={{textDecoration: 'none',color: 'black'}}>
                        <div className="categorie-h elec">
                            <FaLaptop size={30} color="#4ecdc4" />
                            <p>Électronique</p>
                        </div>
                    </a>
                    <a href="/categorie/Vetements" style={{textDecoration: 'none',color: 'black'}}>
                        <div className="categorie-h vet">
                            <FaTshirt size={30} color="#ff9f43" />
                            <p>Vêtements</p>
                        </div>
                    </a>
                    <a href="/categorie/telephone" style={{textDecoration: 'none',color: 'black'}}>
                        <div className="categorie-h tel">
                            <Smartphone size={30} color="blue" />
                            <p>Téléphone</p>
                        </div>
                    </a>
                </div>
            </div>
        )
    }
}

export default Categories;