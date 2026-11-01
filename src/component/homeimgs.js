import { Component } from "react";
import imagepro from '../data/imageprodu.json';
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

class Homeimgs extends Component{
    constructor(props){
        super(props);
        this.images = Object.values(imagepro);

        this.state = {
            currentimage: 0
        };
    }

    prevImage = () => {
        this.setState(() => ({
            currentimage: this.state.currentimage === 0 ? this.images.length - 1 : this.state.currentimage - 1
        }))
    }

    nextImage = () => {
        this.setState(() => ({
            currentimage: this.state.currentimage === this.images.length - 1 ? 0 : this.state.currentimage + 1
        }))
    }

    componentDidMount(){
        this.timer = setInterval(() => {
            this.nextImage();
        },3000)
    }
    
    componentWillUnmount(){
        clearInterval(this.timer);
    }

    render(){
        return(
            <div className="imgs">
                <button className="slider-btn prev" onClick={this.prevImage}>
                    &#10094;
                </button>

            <img src={this.images[this.state.currentimage]} alt="slider" />

        <button className="slider-btn next" onClick={this.nextImage}>
            &#10095;
        </button>
            </div>
        )
    }
}

export default Homeimgs;