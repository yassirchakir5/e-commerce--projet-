import { Component } from "react";
import mesdata from '../../data/mesproduct.json';
import FormAddProduct from "./FormAddProduct";


class Mesproduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            mesproduct: mesdata,
            search: "",
            current: "mesprod",
            nomp: "",
            prixp: "",
            descp: "",
            stockp: "",
            editIndex: null,
            categorie: ""
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

   

    setcurrent = (index = null,nompr = "",prixpr = "",descp = "",stockpr = "",categorie = "") => {
        this.setState({
            stockp: stockpr,
            nomp: nompr,
            prixp: prixpr,
            descp: descp,
            stock: stockpr,
            editIndex: index,
            categorie: categorie,
            current: this.state.current === "mesprod" ? "addpro" : "mesprod"
        })
    }

    saveProduct = (updatedpr) => {
        const {editIndex, mesproduct} = this.state;
        const newproduct = [...mesproduct];
        if(editIndex != null){
            newproduct[editIndex] = {...newproduct[editIndex], ... updatedpr};
        }else{
            newproduct.push(updatedpr);
        }
        this.setState({
            mesproduct: newproduct,
            editIndex: null,
            current: "mesprod"
        })
    }

    updatestatus = (index,newstatus) => {
        const updateproducts = [...this.state.mesproduct];

        updateproducts[index] = {...updateproducts[index],status: newstatus};

        this.setState({
            mesproduct: updateproducts
        });

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
                <div className="input-search">
                    {this.state.current === "mesprod" ? <button id="btn-prod" style={{width: '250px'}} onClick={() => {this.setcurrent()}}>Add product</button> : <button id="btn-prod" onClick={this.setcurrent}> Retour</button> }
                    <h4>Nombre de produit : {this.state.mesproduct.length}</h4>
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
                                                <h3 className={`badge-statut ${mesp.status}`}>{mesp.status}</h3>
                                                <h3 className="detail">{mesp.name}</h3>
                                                <h3 className="detail">Stock : <span style={{color: 'red',fontSize: '25px'}}>{mesp.stock}</span></h3>
                                                <div className="detail">
                                                    <span className="label">Prix : </span>
                                                    <span className="valeur prix">{mesp.prix}DH </span>
                                                </div>
                                                <div className="detail">
                                                    
                                                </div>
                                            </div> 
                                        </div>
                                        <div className="cart-btn">
                                            
                                            {mesp.status === "disponible" && 
                                            <>
                                                <button className="btn btn-modifier" onClick={() => {this.setcurrent(index,mesp.name,mesp.prix,mesp.description,mesp.stock,mesp.categorie)}}>modifier</button>
                                                <button className="btn btn-revision" onClick={() => {this.updatestatus(index,"En-révision")}}> Révision</button>
                                                <button className="btn" onClick={() => {this.updatestatus(index,"Vendue")}}> Vendre</button>
                                            </>}
                                            {mesp.status === "En-révision" &&<>
                                                <button className="btn btn-modifier" onClick={() => {this.setcurrent(index,mesp.name,mesp.prix,mesp.description,mesp.stock,mesp.categorie)}}>modifier</button>
                                                <button className="btn btn-disponible" onClick={() => {this.updatestatus(index,"disponible")}}> Disponible</button>
                                                <button className="btn" onClick={() => {this.updatestatus(index,"Vendue")}}> Vendre</button>
                                            </>}
                                            {mesp.status === "Vendue" && <>
                                                <button className="btn btn-modifier" onClick={() => {this.setcurrent(index,mesp.name,mesp.prix,mesp.description,mesp.stock,mesp.categorie)}}>modifier</button>
                                                
                                            </>}
                                            
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
                        
                        { <FormAddProduct nomp={this.state.nomp} prixp={this.state.prixp} categorie={this.state.categorie} descp={this.state.descp} stock={this.state.stock} savepro={this.saveProduct} /> }
                    </div>
                )}
            </div>
        )
    }
}

export default Mesproduct;