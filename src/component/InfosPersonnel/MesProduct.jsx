import { Component } from "react";
import mesdata from '../../data/mesproduct.json';
import FormAddProduct from "./FormAddProduct";


class Mesproduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            mesproduct: mesdata,
            search: "",
            current: "mesprod"
        }
    }

    supprimerpro = (index) => {
        const nouva = this.state.mesproduct.filter((_, indexs) => index !== indexs);

        this.setState({
            mesproduct: nouva
        });
    }

    setsear = (e) => {
        this.setState({
            search: e.target.value
        });
    }

    setcurrent = () => {
        this.setState({
            current: this.state.current === "mesprod" ? "addpro" : "mesprod"
        })
    }

    render(){
        const filtrerproduc = this.state.mesproduct.filter((mespr) => {
            const lowersearch = this.state.search.toLowerCase();
            const findpro = mespr.name.toLowerCase().includes(lowersearch);
            return findpro;
        });

        return(
            <div className="mespr">
                <h1 style={{textAlign: 'center'}}>Mes Products</h1>
                
                <div className="input-search" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '0 20px'}}>
                    {this.state.current === "mesprod" ? <button id="btn-prod" style={{width: '250px'}} onClick={this.setcurrent}>Add product</button> : <button id="btn-prod" onClick={this.setcurrent}> Retour</button> }
                    {this.state.current === "mesprod" && 
                        <input type="text" placeholder="Search product" style={{marginRight: '20px',height: '20px',width: '200px'}} onChange={this.setsear}/>
                    }
                </div>

                {this.state.current === "mesprod" && (
                    <>
                        <div className="container-mespr">
                            {filtrerproduc.map((mesp, index) => {
                                return(
                                    <div className="carts" key={index}> 
                                        <div className="cart">
                                            <div>
                                                <img src={mesp.image} alt={mesp.name} /> 
                                            </div>
                                            <div>
                                                <h3>{mesp.name}</h3>
                                                <h4>{mesp.prix}</h4>
                                                <p>{mesp.description}</p>  
                                            </div> 
                                        </div>
                                        <div className="cart-btn">
                                            <button className="btn btn-modifier">modifier</button>
                                            <button className="btn btn-revision"> Révision</button>
                                            <button className="btn"> Vendre</button>
                                            <button className="btn btn-supprimer" onClick={() => {this.supprimerpro(index)}}>Supprimer</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {filtrerproduc.length === 0 && <h4 className="aucunp">Aucun produit publié</h4>}
                    </>
                )}
                {this.state.current === "addpro" && (
                    <div>
                        
                        { <FormAddProduct /> }
                    </div>
                )}
            </div>
        )
    }
}

export default Mesproduct;