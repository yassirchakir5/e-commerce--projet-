import { Component } from "react";
import Categories from "../component/categories";
import Derrniprodu from "../component/derniprodu";
import './Home.css'


class Home extends Component{
    render(){
        
        return(
            <div>
                {<Categories />}
                {<Derrniprodu />}
            </div>
        )
    }
}

export default Home;