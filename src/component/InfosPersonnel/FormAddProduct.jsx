import React, { Component } from "react";
import Select from 'react-select';

const options = [
  { value: 'Phones', label: 'Phones' },
  { value: 'Computer', label: 'Computer' },
  { value: 'Casques', label: 'Casques' },
  { value: 'Vétement', label: 'Vétement' }
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
            selectedFiles: [],
            nomp: props.nomp || "",
            prixp: props.prixp || "",
            descp: props.descp || "",
            stockp: props.stockp || ""
        };
    }
    
    setcateg = (selectedop) => {
        this.setState({
            selectcat: selectedop          
        });
    }

    handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        const fileNames = files.map(file => file.name);
        
        this.setState({
            selectedFiles: fileNames
    });
}
    handlechange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handlesubmit = (e) => {
        e.preventDefault();
        this.props.savepro({
            name: this.state.nomp,
            prix: this.state.prixp,
            description: this.state.descp,
            stockp : this.state.stockp
        })
    }

    render(){
        const {nomp,prixp,descp,stockp} = this.props;
        return(
            <div className="form-addcar">
                <form onSubmit={this.handlesubmit}>
                    <div className="input-group">
                        <label htmlFor="nompr" style={{fontSize: '20px'}}>Nom du produit</label>
                        <input type="text" value={this.state.nomp} id="nompr" name="nomp" onChange={this.handlechange} placeholder="Nom du produit" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="prixpr" style={{fontSize: '20px'}}>Prix de produit </label>
                        <input type="text" value={this.state.prixp} id="prixpr" name="prixp" onChange={this.handlechange} placeholder="Prix de produit" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="desc" style={{fontSize: '20px'}}>Description</label>
                        <textarea id="desc" value={this.state.descp} name="descp"  rows="7" onChange={this.handlechange} placeholder="Description"/>
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
                        <label htmlFor="stock" style={{fontSize: '20px'}}>Stock </label>
                        <input type="number" onChange={this.handlechange} value={this.state.stockp} id="stock" name="stockp" placeholder="Stock" />
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
                                        {this.state.selectedFiles.map((name, index) => (
                                            <li key={index} style={{ fontSize: '14px', margin: '5px 0' }}>✅ {name}</li>
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
                        <input type="submit" className="sub" value="Ajouter"/>
                    </div>
                </form>
            </div>  
        )
    }
}

export default FormAddProduct;