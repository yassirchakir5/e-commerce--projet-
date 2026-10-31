import { Component } from "react";

class Favoris extends Component{
    render(){
        return(
            <div className="az">
                <h1>Mes favoris</h1>
                <div className="section-fa">
                    {this.props.favo.map((fa,index) => {
                        return (<div className="card-f">
                        <div  className="card-fa">
                            <img src={fa.image} key={index}/>
                            <div>
                                <h2 key={index}>{fa.name}</h2>
                                <p key={index}>{fa.prix}</p>
                            </div>
                        </div>
                        <div>
                            <button className="btn-det">Voir détails</button>
                            <button className="btn-ret" onClick={() => {this.props.supprif(index)}}>Retirer</button>
                        </div>
                    </div>)
                    })}
                </div>
                {this.props.favo.length === 0 && <p className="aze">Aucun favoris available</p>}
            </div>
        )
    }
}

export default Favoris;