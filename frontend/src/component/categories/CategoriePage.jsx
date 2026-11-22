import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import Derrniprodu from "../Derniprodu";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class CategoriePage extends Component {
  render() {
    const { nom } = this.props.params;

    return (
      <div style={{ paddingTop: "20px", paddingBottom: "40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto 10px", padding: "0 40px" }}>
          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>
            <Link to="/" style={{ color: "#0284c7", textDecoration: "none" }}>
              Home
            </Link>{" "}
            &gt; <span>Catégorie</span> &gt; <strong>{nom}</strong>
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Catégorie : <span style={{ color: "#0284c7" }}>{nom}</span>
          </h2>
        </div>

        <Derrniprodu categorie={nom} />
      </div>
    );
  }
}

export default withParams(CategoriePage);