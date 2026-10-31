import { Component } from "react";

class Commande extends Component{
    
    render(){
        const totalpage = this.props.totalpage;
        const currentPage = this.props.currentPage;
        const pagin = this.props.pagin;
        const iscardaction = this.props.iscardaction;
        const b = this.props.b;

        return(
            <div>
                <h1>Mes commandes</h1>
                <table border={1} className="tab">
                    <thead className="table-head">
                        <tr>
                            <th className="tco">Numéro de la commandes</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {pagin.map((com,index) => {
                            return (<tr key={index}>
                                <td>{com.numero}</td>
                                <td>{com.date}</td>
                                <td>{com.statut}</td>
                                <td>{com.total}</td>
                                <td><button onClick={() => {this.props.togleaction(com,index)}}>Voir détaille</button></td>
                            </tr>
                            )
                        })}
                        {pagin.length === 0 && 
                        <tr>
                            <td colSpan="5" style={{textAlign: 'center',padding: '20px',fontSize: '16px'}}>
                                Aucun Commande Actuelle
                            </td>
                        </tr>}
                    </tbody>
                </table>
                {iscardaction && b && (
                    <div className="overlay">
                        <div className="card" style={{ width: '450px' }}>
                            <div className="carsHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{margin: 0, color: '#333'}}>Détails de la commande</h2>
                                <button onClick={() => {this.props.togleaction(null)}} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✖</button>
                            </div>

                            <div className="cardBozdy" style={{marginTop: '15px' }}>
                                <p style={{ margin: '5px 0' }}><strong>Commande :</strong> {b.numero}</p>
                                <p style={{ margin: '5px 0' }}><strong>Date :</strong> {b.date}</p>
                                <p style={{ margin: '15px 0' }}>
                                    <strong>Statut : </strong> 
                                    <span style={{ padding: '4px 10px', borderRadius: '15px', backgroundColor: '#e2e3e5', fontWeight: 'bold' }}>
                                        {b.statut}
                                    </span>
                                </p>
                                                
                                <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '15px 0' }} />
                                                
                                <p style={{ margin: '5px 0' }}><strong>Quantité d'articles :</strong> {b.articlesQuantite}</p>
                                
                                <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '15px 0' }} />
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                                    <strong>Total :</strong>
                                    <strong>{b.total}</strong>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                                    <button className="btnmodif" onClick={() => {this.props.togleaction(null)}} style={{ padding: '10px 30px' }}>Fermer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="btnsuipre">
                    <button disabled={currentPage === 1} onClick={() => {this.props.prec()}}>Precedent</button>
                    <p>{currentPage}/{totalpage}</p>
                    
                    <button disabled={currentPage === totalpage || totalpage === 0} onClick={() => {this.props.suiv()}}>Suivant</button>
                </div>
            </div>
        )
    }
}

export default Commande;