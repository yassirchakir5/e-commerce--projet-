import { Component } from "react";
import Select from "react-select";

const options = [
  { value: "éléctronique", label: "Électronique" },
  { value: "Computer", label: "Computer" },
  { value: "Casques", label: "Casques" },
  { value: "Vétement", label: "Vêtements" },
  {
    value: "Matériel informatique & Gaming",
    label: "Matériel informatique & Gaming",
  },
];
const customStyles = {
  control: (provided) => ({
    ...provided,
    width: "100%",
    padding: "6px",
    borderRadius: "8px",
    borderColor: "#ccc",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#007bff",
    },
    textAlign: "center",
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "center",
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#e8f0fe"
      : "white",
    color: state.isSelected ? "white" : "#333",
  }),
  singleValue: (provided) => ({
    ...provided,
    textAlign: "center",
  }),
};

class Formajoutboutique extends Component{
    render(){
        return(
            <div className="form-addcar" style={{ marginBottom: "25px" }}>
            {this.props.errorMessage && Object.keys(this.props.errors).length === 0 && (
              <div style={{ color: "#dc2626", backgroundColor: "#fee2e2", padding: "10px", borderRadius: "6px", marginBottom: "15px" }}>
                {this.props.errorMessage}
              </div>
            )}

            <form onSubmit={this.props.handlesubmit}>
              <div className="input-group">
                <label htmlFor="nompr" style={{ fontSize: "18px" }}>
                  Nom de la boutique
                </label>
                <input
                  id="nompr"
                  type="text"
                  value={this.props.nom}
                  name="nom"
                  onChange={this.props.handleChange}
                  placeholder="Ex: Yassir Tech"
                />
                {this.props.errors.nom && (
                  <small style={{ color: "red", display: "block", marginTop: "4px" }}>
                    {this.props.errors.nom[0]}
                  </small>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="desc" style={{ fontSize: "18px" }}>
                  Description de la boutique
                </label>
                <textarea
                  id="desc"
                  value={this.props.desc}
                  name="desc"
                  rows="4"
                  onChange={this.props.handleChange}
                  placeholder="Description de vos produits..."
                />
                {this.props.errors.desc && (
                  <small style={{ color: "red", display: "block", marginTop: "4px" }}>
                    {this.props.errors.desc[0]}
                  </small>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="numtel" style={{ fontSize: "18px" }}>
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  id="numtel"
                  name="numtel"
                  value={this.props.numtel}
                  onChange={this.props.handleChange}
                  placeholder="Numéro de téléphone"
                />
                {this.props.errors.numtel && (
                  <small style={{ color: "red", display: "block", marginTop: "4px" }}>
                    {this.props.errors.numtel[0]}
                  </small>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="email" style={{ fontSize: "18px" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={this.props.email}
                  onChange={this.props.handleChange}
                  placeholder="Email"
                />
                {this.props.errors.email && (
                  <small style={{ color: "red", display: "block", marginTop: "4px" }}>
                    {this.props.errors.email[0]}
                  </small>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="villeb" style={{ fontSize: "18px" }}>
                  Ville
                </label>
                <input
                  id="villeb"
                  type="text"
                  value={this.props.ville}
                  name="ville"
                  onChange={this.props.handleChange}
                  placeholder="Ex: Agadir"
                />
                {this.props.errors.ville && (
                  <small style={{ color: "red", display: "block", marginTop: "4px" }}>
                    {this.props.errors.ville[0]}
                  </small>
                )}
              </div>

              <div className="input-group">
                <label style={{ fontSize: "18px" }}>
                  Catégorie de la boutique
                </label>
                <Select
                  options={options}
                  styles={customStyles}
                  name="categorie"
                  placeholder="Choisissez une catégorie"
                  value={this.props.categorie}
                  onChange={this.props.handlecategoriechange}
                />
                {this.props.errors.categorie && (
                  <small style={{ color: "red", display: "block", marginTop: "4px" }}>
                    {this.props.errors.categorie[0]}
                  </small>
                )}
              </div>

              <div className="input-group">
                <label style={{ fontSize: "18px" }}>Image de couverture</label>
                <input
                  type="file"
                  name="logo_boutique"
                  accept="image/*"
                  onChange={this.props.handleChange}
                />
                {this.props.errors.logo_boutique && (
                  <small style={{ color: "red", display: "block", marginTop: "4px" }}>
                    {this.props.errors.logo_boutique[0]}
                  </small>
                )}
              </div>

              <div>
                <input type="submit" className="sub" value="Ajouter" />
              </div>
            </form>
          </div>
        
        )
    }
}
export default Formajoutboutique;