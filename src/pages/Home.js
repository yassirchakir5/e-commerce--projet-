import { Component } from "react";
import Homeimgs from "../component/homeimgs";
import './Home.css'


class Home extends Component{
    render(){
        
        return(
            <div>
                {<Homeimgs />}
            </div>
        )
    }
}

export default Home;