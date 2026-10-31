import { Component } from "react";
import { FaPen, FaTrash } from "react-icons/fa"; 
import mesdata from '../data/mesproduct.json'

class Mesproduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            mesproduct: mesdata,
            search: ""
        }
    }

    supprimerpro = (index) => {
        const nouva = this.state.mesproduct.filter((_,indexs) => index !== indexs);

        this.setState({
            mesproduct: nouva
        });
    }

    setsear = (e) => {
        this.setState({
            search: e.target.value
        });
    }

    render(){
        

        const filtrerproduc = this.state.mesproduct.filter((mespr) => {
            const lowersearch = this.state.search.toLowerCase();

            const findpro = mespr.name.toLowerCase().includes(lowersearch);

            return findpro;

        })
        return(
            <div className="mespr">
                <h1 style={{textAlign: 'center'}}>Mes Products</h1>
                <div className="input-search">
                    <input type="text" placeholder="Search product"   onChange={this.setsear}/>
                </div>
                <h4 className="total">total publié : {this.state.mesproduct.length}</h4>
                <div className="container-mespr">
                    {filtrerproduc.map((mesp,index) => {
                        return(
                            <div className="carts">
                                <div className="cart">
                                    <div>
                                        <img src={mesp.image} key={index} />
                                    </div>
                                    <div>
                                    <h3 key={index}>{mesp.name}</h3>
                                        <h4 key={index}>{mesp.prix}</h4>
                                        <p key={index}>{mesp.description}</p>  
                                    </div> 
                                </div>
                                <div className="cart-btn">
                                    <button key={index}><FaPen/> Editer</button>
                                    <button key={index}> Voir le produit</button>
                                    <button id="btn-del" key={index} onClick={() => {this.supprimerpro(index)}}><FaTrash/></button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {filtrerproduc.length === 0 && <h4 className="aucunp">Aucun produit publié</h4>}
            </div>
        )
    }
}

export default Mesproduct;