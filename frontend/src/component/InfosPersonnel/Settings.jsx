import { Component } from "react";
import api from "../../api/api";
import Swal from "sweetalert2";
import FomrPersonnel from "../FomrPersonnel";

class Settings extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: "",
            prenom: "",
            email: "",
            password: "",
            numtel: "",
            addresselocal: "",
            pays: "",
            date_naissance: "",
            CNI: "",
            path_img: "",
            path_CNIfr: "",
            path_CNIfv: "",
            mesinfos: "",
            cpassword: "",
            current_img: "",
            date_naissance: ""
        }
    }
    componentDidMount() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.setState({
            mesinfos: user,
            name: user.name || "",
            prenom: user.prenom || "",
            email: user.email || "",
            numtel: user.numtel || "",
            addresselocal: user.addresselocal || "",
            CNI: user.CNI || "",
            current_img: user.path_img_profile || "",
            current_CNIfr: user.path_CNIfr || "",
            current_CNIfv: user.path_CNIfv || "",
            path_img: null,
            path_CNIfr: null,
            path_CNIfv: null,
            date_naissance: user.date_naissance || "",
            pays: user.pays || ""
            });
        }
    }


    handlechange = (e) => {
        if(e.target.type === "file"){
            this.setState({ [e.target.name]: e.target.files[0] });
        }else{
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    handlesubmit = async () => {
        if(this.state.password && this.state.password !== this.state.cpassword){
            Swal.fire("Erreur", "Les mots de passe ne correspondent pas !", "error");
            return;
        }
        const formdata = new FormData();
        formdata.append('name',this.state.name);
        formdata.append('prenom',this.state.prenom);
        formdata.append('email',this.state.email);
        formdata.append('numtel',this.state.numtel);
        formdata.append('addresselocal',this.state.addresselocal);
        formdata.append('CNI',this.state.CNI);
        formdata.append('date_naissance',this.state.date_naissance);
        formdata.append('pays',this.state.pays);
        if (this.state.path_img instanceof File) {
            formdata.append('path_img_profile', this.state.path_img);
        }
        if (this.state.path_CNIfr instanceof File) {
            formdata.append('path_CNIfr', this.state.path_CNIfr);
        }
        if (this.state.path_CNIfv instanceof File) {
            formdata.append('path_CNIfv', this.state.path_CNIfv);
        }
        if(this.state.password){
            formdata.append('password', this.state.password);
        }
        const token = localStorage.getItem("token");
        try{
            const res = await api.post('/modifier',formdata,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            if(res.data.user){
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }
            await Swal.fire("Succès!", "Les informations a été sauvegardes avec success", "success");
            window.location.reload();
        }catch(err){}
    }

    handlelogout = async () => {
        const result = await Swal.fire({
            title: "Déconnexion",
            text: "Voulez-vous vraiment vous déconnecter ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Oui, se déconnecter",
            cancelButtonText: "Annuler",
        });
        if(result.isConfirmed){
            try{
            await api.post('/logout');
        }catch(err){
            console.log('token déja deleted');
        }finally{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.setItem('login','false');
            await Swal.fire("Succès!", "Vous étez déconnecter avec succes", "success");
            window.location.href = '/login';
        }
        }
    };

    handlesupprimer = async () => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Cette action est irréversible ! Votre compte et toutes vos données seront définitivement supprimés.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",   
            cancelButtonColor: "#3085d6",  
            confirmButtonText: "Oui, supprimer mon compte",
            cancelButtonText: "Annuler",
        });
        if(result.isConfirmed){
            try{
            const res = await api.delete('/utilisateur/delete');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.setItem('login','false');
            await Swal.fire("Succès!", "Le compte a été supprimer avec succès", "success");
            location.href = "/login";
            }catch(err){
                Swal.fire(
                    "Erreur",
                    err.response?.data?.message || "Impossible de supprimer le compte.",
                    "error"
                );
            }
        }
    }
    render(){
        return(
            <div>
                <FomrPersonnel name={this.state.name} handlechange={this.handlechange} prenom={this.state.prenom}
                email={this.state.email} addresselocal={this.state.addresselocal} pays={this.state.pays}
                date_naissance={this.state.date_naissance} CNI={this.state.CNI} numtel={this.state.numtel}
                current_img={this.state.current_img} current_CNIfr={this.state.current_CNIfr} current_CNIfv={this.state.current_CNIfv}
                password={this.state.password} cpassword={this.state.cpassword} handlelogout={this.handlelogout} handlesubmit={this.handlesubmit} handlesupprimer={this.handlesupprimer}  />
            </div>
        )
    }
}

export default Settings;