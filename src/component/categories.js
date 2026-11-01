import { Component } from "react";
import { FaLaptop, FaTshirt } from 'react-icons/fa';
import { Smartphone } from 'lucide-react';
import { Link } from "react-router-dom";

class Categories extends Component{   
    render(){
        return(
            <div>
                <div className="gap-4">
                    <Link to="/categorie/Electronique" style={{textDecoration: 'none',color: 'black'}}>
                        <div className="categorie-h elec">
                            <FaLaptop size={30} color="#4ecdc4" />
                            <p>Électronique</p>
                        </div>
                    </Link>
                    <Link to="/categorie/Vetements" style={{textDecoration: 'none',color: 'black'}}>
                        <div className="categorie-h vet">
                            <FaTshirt size={30} color="#ff9f43" />
                            <p>Vêtements</p>
                        </div>
                    </Link>
                    <Link to="/categorie/telephone" style={{textDecoration: 'none',color: 'black'}}>
                        <div className="categorie-h tel">
                            <Smartphone size={30} color="blue" />
                            <p>Téléphone</p>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Categories;