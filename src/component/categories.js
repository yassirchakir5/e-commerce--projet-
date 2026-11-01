import { Component } from "react";
import { FaLaptop, FaTshirt, FaCouch, FaPaintBrush } from 'react-icons/fa';
import { Armchair } from "lucide-react";
import { Smartphone, Sparkles } from 'lucide-react';


class Categories extends Component{   
    render(){
        return(
            <div>
                <div className="gap-4">
                    <div className="categorie-h art">
                        <FaPaintBrush size={30} color="#ff6b6b" />
                        <p>Artisanat</p>
                    </div>
                    <div className="categorie-h elec">
                        <FaLaptop size={30} color="#4ecdc4" />
                        <p>Électronique</p>
                    </div>
                    <div className="categorie-h vet">
                        <FaTshirt size={30} color="#ff9f43" />
                        <p>Vêtements</p>
                    </div>
                    <div className="categorie-h meu">
                        <Armchair className="w-8 h-8 text-gray-700" />
                        <p>Meubles</p>
                    </div>
                    <div className="categorie-h beau">
                        <Sparkles size={30} color="#ff9f43" />
                        <p>Beauté</p>
                    </div>
                    <div className="categorie-h tel">
                        <Smartphone size={30} color="blue" />
                        <p>Téléphone</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Categories;