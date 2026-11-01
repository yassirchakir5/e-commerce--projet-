import { Component } from "react";
import Categories from "../component/categories";
import Derrniprodu from "../component/derniprodu";
import Barvoirto from "../component/barvoirto";
import Products from '../data/product.json'
import './Home.css'

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: ""
        }
    }

    setsearch = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    render(){
        const filterpro = Products.filter((fil) => {
            const lowersear = this.state.search.toLowerCase();
            return fil.name.toLowerCase().includes(lowersear);
        })
        return(
            <div>
                {<Categories />}
                {<Barvoirto setsearch={this.setsearch}/>}
                {<Derrniprodu filterpro = {filterpro}/>}
            </div>
        )
    }
}

export default Home;