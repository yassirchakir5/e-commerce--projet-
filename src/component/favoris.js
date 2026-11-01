import { Component } from "react";
import Favori from '../data/favorite.json';


class Favoris extends Component{
    constructor(props){
        super(props);
        this.state = {
            mesfav: Favori
        }
    }
    supprif = (indexs) => {
        const nouvf = this.state.mesfav.filter((_,index) => index !== indexs);

        this.setState({
            mesfav: nouvf
        });
    };

    render(){
        return(
            <div className="az">
                <h1 style={{textAlign: 'center'}}>Mes favoris</h1>
                <div className="section-fa" style={{gridTemplateColumns: 'repeat(3,1fr)'}}>
                    {this.state.mesfav.map((fa,index) => {
                        return (
                        <div className="card-f" key={index}>
                        <div  className="card-fa" >
                            <img src={fa.image} />
                            <div>
                                <h2>{fa.name}</h2>
                                <p>{fa.prix}</p>
                            </div>
                        </div>
                        <div>
                            <button className="btn-det">Voir détails</button>
                            <button className="btn-ret" onClick={() => {this.supprif(index)}}>Retirer</button>
                        </div>
                    </div>)
                    })}
                </div>
                {Favori.length === 0 && <p className="aze">Aucun favoris available</p>}
            </div>
        )
    }
}

export default Favoris;