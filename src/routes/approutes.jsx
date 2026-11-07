import { Component } from 'react';
import Bar from '../pages/Bar'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import Infos from '../pages/infos'
import Login from '../pages/Auth/Login'
import Inscrit from '../pages/Auth/Inscrit'
import Home from '../pages/Home/Home'
import Mesproduct from '../component/InfosPersonnel/MesProduct';
import Derrniprodu from '../component/Derniprodu';
import Products from '../data/product.json';
import Telephone from '../component/categories/Telephone';
import Vêtements from '../component/categories/Vêtements';
import Electronique from '../component/categories/Electronique';
import Computer from '../component/categories/Computer';
import Casques from '../component/categories/Casque';
import Favoris from '../component/InfosPersonnel/Favoris';
import Carte from '../component/Carte';
import Cartes from '../component/InfosPersonnel/Cartes';
import ProductDetails from '../component/ProductDetails';

class Approutes extends Component{
    state = {
        connected : true
    }
    setconnected = (status) => {
        this.setState({connected: status});
    };
    render(){
        return(
            <BrowserRouter>
                <Bar connected={this.state.connected}/>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/infos' element={<Infos />} />
                    <Route path='/login' element={<Login connected={this.state.connected} setconnected={this.setconnected}/>}/>
                    <Route path='/inscrit' element={<Inscrit />} />
                    <Route path='/mesproduct' element={<Mesproduct />} />
                    <Route path='/dernierprodu' element={<Derrniprodu filterpro={Products}/>} />
                    <Route path='/categorie/telephone' element={<Telephone product={Products}/>} />
                    <Route path='/categorie/Vetements' element={<Vêtements product={Products}/>} />
                    <Route path='/categorie/Electronique' element={<Electronique product={Products}/>} />
                    <Route path='/categorie/Computer' element={<Computer product={Products}/>} />
                    <Route path='/categorie/Casques' element={<Casques product={Products}/>} />
                    <Route path='/mesfavoris' element={<Favoris product={Products}/>} />
                    <Route path='/Component/Carte' element={<Carte />} /> 
                    <Route path='/mescartes' element={<Cartes />} /> 
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path='*' element={<Navigate to="/" replace />}/>
                </Routes>
        </BrowserRouter>
      )
    }
}
export default Approutes;