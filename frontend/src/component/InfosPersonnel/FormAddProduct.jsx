import React, { Component } from "react";
import Select from 'react-select';
import api from '../../api/api';
import Swal from "sweetalert2";

const optionsta = [
    {
        value: "Disponible",
        label: "Disponible"
    },
    {
        value: "En-révision",
        label: "En-révision"
    },
    {
        value: "Vendue",
        label: "Vendue"
    },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '100%',
    padding: '6px',
    borderRadius: '8px',
    borderColor: '#ccc',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#007bff'
    },
    textAlign: 'center' 
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: 'center', 
    backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e8f0fe' : 'white',
    color: state.isSelected ? 'white' : '#333'
  }),
  singleValue: (provided) => ({
    ...provided,
    textAlign: 'center' 
  })
};

class FormAddProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectcat: null,
            selectstatus: null,
            selectedFiles: [],
            nom: props.nomp || "",
            prix: props.prixp || "",
            desc: props.descp || "",
            stock: props.stock || "",
            selectbout: null,
            boutiques: [],
            categorie: []
        };
    }
    componentDidMount(){
        this.getboutiques();
        this.getcategorie();
    }
    
    getboutiques = async () => {
        try{
            const res = await api.get('/boutique');
            this.setState({ boutiques: res.data.boutiques });
        }catch(err){
            console.log(err);
            
        }
    }

    getcategorie = async () => {
        try{
            const res = await api.get('/categorie');
            this.setState({ categorie: res.data.categorie });
        }catch(err){
            console.log(err);
        }
    }
    setstatus = (selectstat) => {
        this.setState({
            selectstatus: selectstat
        });
    }

    setcateg = (selectedop) => {
        this.setState({
            selectcat: selectedop          
        });
    }

    setboutique = (selectedop) => {
        this.setState({
            selectbout: selectedop          
        });
    }

    handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        this.setState({
            selectedFiles: files
    });
}
    handlechange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }


    handlesubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('nom',this.state.nom);
        formdata.append('prix',this.state.prix);
        formdata.append('stock',this.state.stock);
        formdata.append('desc',this.state.desc);
        formdata.append('status', this.state.selectstatus ? this.state.selectstatus.value : 'Disponible');
        formdata.append('id_categorie',this.state.selectcat.value);
        formdata.append('id_boutique',this.state.selectbout.value);
        this.state.selectedFiles.forEach((file) => {
            formdata.append('images[]', file);
        });

        try{
            const res = await api.post('/produit/add',formdata);
            Swal.fire("Succès!", "Le Produit a été ajouter avec succés.", "success");
            this.setState({
                nom: "",
                prix: "",
                stock: "",
                desc: "",
                selectcat: null,
                selectbout: null,
                selectstatus: null,
                selectedFiles: []
            });
            this.props.setcourant();
        }catch(err){
            console.log(err);            
        }
    }

    render(){
        const options = this.state.categorie.map(b => ({
            value: b.id,
            label: b.nom
        }));

        const optionsb = this.state.boutiques.map(b => ({
            value: b.id,
            label: b.nom
        }));
        return(
            <div className="form-addcar">
                <form onSubmit={this.handlesubmit}>
                    <div className="input-group">
                        <label htmlFor="nom" style={{fontSize: '20px'}}>Nom du produit</label>
                        <input type="text" value={this.state.nom} id="nom" name="nom" onChange={this.handlechange} placeholder="Nom du produit" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="prixpr" style={{fontSize: '20px'}}>Prix de produit </label>
                        <input type="text" value={this.state.prix} id="prixpr" name="prix" onChange={this.handlechange} placeholder="Prix de produit" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="desc" style={{fontSize: '20px'}}>Description</label>
                        <textarea id="desc" value={this.state.desc} name="desc"  rows="7" onChange={this.handlechange} placeholder="Description"/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="cate" style={{fontSize: '20px'}}>Catégorie</label>
                        <Select 
                            options={options} 
                            styles={customStyles}
                            placeholder="Choisissez une catégorie"
                            value={this.state.selectcat}
                            onChange={this.setcateg}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cate" style={{fontSize: '20px'}}>Status</label>
                        <Select 
                            options={optionsta} 
                            styles={customStyles}
                            placeholder="Choisissez Status du produit"
                            value={this.state.selectstatus}
                            onChange={this.setstatus}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cate" style={{fontSize: '20px'}}>Boutiques : </label>
                        <Select 
                            options={optionsb} 
                            styles={customStyles}
                            placeholder="Choisissez une Boutique"
                            value={this.state.selectbout}
                            onChange={this.setboutique}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="stock" style={{fontSize: '20px'}}>Stock </label>
                        <input type="number" onChange={this.handlechange} value={this.state.stock} id="stock" name="stock" placeholder="Stock" />
                    </div>
                    <div className="input-group">
                        <label style={{fontSize: '20px'}}>Image du produit</label>
                        <div className="upload-box">
                            <input 
                                type="file" 
                                id="image-upload" 
                                name="images"
                                multiple 
                                accept="image/*" 
                                className="file-input"
                                onChange={this.handleFileChange}
                            />
                            
                            {this.state.selectedFiles.length > 0 ? (
                                <div className="upload-content" style={{ pointerEvents: 'auto', zIndex: 20 }}>
                                    <p style={{ color: '#1a73e8', fontWeight: 'bold' }}>Images sélectionnées :</p>
                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                        {this.state.selectedFiles.map((file, index) => (
                                            <li key={index} style={{ fontSize: '14px', margin: '5px 0' }}>✅ {file.name}</li>
                                        ))}
                                    </ul>
                                    <span className="upload-link" style={{ marginTop: '15px', display: 'inline-block' }}>Changer les images</span>
                                </div>
                            ) : (
                                <div className="upload-content">
                                    <div className="upload-icon">⬆️</div>
                                    <p>Glissez et déposez une image ici ou cliquez pour choisir</p>
                                    <span className="upload-link">Importer une image</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <button disabled={!this.state.selectbout || !this.state.selectcat} type="submit" className="sub">Ajouter</button>
                    </div>
                </form>
            </div>  
        )
    }
}

export default FormAddProduct;