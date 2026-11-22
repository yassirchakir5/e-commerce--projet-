import { Component } from "react";
import Categories from "../../component/Categories";
import Derrniprodu from "../../component/Derniprodu";
import Barvoirto from "../../component/barvoirto";
import api from "../../api/api";
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            products: []
        };
    }

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = async () => {
        try {
            const res = await api.get('/produit/all');
            const data = res.data.produits || res.data.products || res.data || [];
            this.setState({ products: Array.isArray(data) ? data : [] });
        } catch (err) {
            console.error("Erreur lors du chargement des produits :", err);
        }
    };

    setsearch = (e) => {
        this.setState({
            search: e.target.value
        });
    };

    render() {
        const lowersear = this.state.search.toLowerCase();
        const filterpro = this.state.products.filter((fil) => {
            const productName = (fil.nom || fil.name || "").toLowerCase();
            return productName.includes(lowersear);
        });

        return (
            <div>
                <Categories />
                <Barvoirto setsearch={this.setsearch} />
                <Derrniprodu filterpro={filterpro} />
            </div>
        );
    }
}

export default Home;