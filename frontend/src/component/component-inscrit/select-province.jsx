import React from 'react';
import { Component } from 'react';

class SelectProvince extends Component{
    render(){
        return(
            <select name="province" id="province" onChange={this.props.handlechange} value={this.props.province || ""} className="formse" required>
                <option value="" disabled hidden>-- Choisir province --</option>
                <option value="Agadir-Ida-Ou-Tanane">Agadir Ida-Ou-Tanane</option>
                <option value="Al Haouz">Al Haouz</option>
                <option value="Al Hoceima">Al Hoceima</option>
                <option value="Aousserd">Aousserd</option>
                <option value="Assa-Zag">Assa-Zag</option>
                <option value="Azilal">Azilal</option>
                <option value="Beni Mellal">Béni Mellal</option>
                <option value="Benslimane">Benslimane</option>
                <option value="Berrechid">Berrechid</option>
                <option value="Berkane">Berkane</option>
                <option value="Boujdour">Boujdour</option>
                <option value="Boulemane">Boulemane</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Chefchaouen">Chefchaouen</option>
                <option value="Chichaoua">Chichaoua</option>
                <option value="Chtouka-Ait Baha">Chtouka-Aït Baha</option>
                <option value="Dakhla-Oued Ed-Dahab">Dakhla - Oued Ed-Dahab</option>
                <option value="Driouch">Driouch</option>
                <option value="El Hajeb">El Hajeb</option>
                <option value="El Jadida">El Jadida</option>
                <option value="Errachidia">Errachidia</option>
                <option value="Es-Semara">Es-Semara</option>
                <option value="Essaouira">Essaouira</option>
                <option value="Fahs-Anjra">Fahs-Anjra</option>
                <option value="Fes">Fès</option>
                <option value="Figuig">Figuig</option>
                <option value="Fquih Ben Salah">Fquih Ben Salah</option>
                <option value="Guelmim">Guelmim</option>
                <option value="Guercif">Guercif</option>
                <option value="Ifrane">Ifrane</option>
                <option value="Inezgane-Ait Melloul">Inezgane-Aït Melloul</option>
                <option value="Jerada">Jerada</option>
                <option value="El Kelaa des Sraghna">El Kelaâ des Sraghna</option>
                <option value="Kenitra">Kénitra</option>
                <option value="Khemisset">Khémisset</option>
                <option value="Khenifra">Khénifra</option>
                <option value="Khouribga">Khouribga</option>
                <option value="Laayoune">Laâyoune</option>
                <option value="Larache">Larache</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Mediouna">Médiouna</option>
                <option value="Meknes">Meknès</option>
                <option value="Midelt">Midelt</option>
                <option value="Mohammedia">Mohammédia</option>
                <option value="Moulay Yacoub">Moulay Yacoub</option>
                <option value="Nador">Nador</option>
                <option value="Nouaceur">Nouaceur</option>
                <option value="Ouarzazate">Ouarzazate</option>
                <option value="Oued Ed-Dahab">Oued Ed-Dahab</option>
                <option value="Oujda-Angad">Oujda-Angad</option>
                <option value="Ouezzane">Ouezzane</option>
                <option value="Rabat">Rabat</option>
                <option value="Rehamna">Rehamna</option>
                <option value="Safi">Safi</option>
                <option value="Sefrou">Sefrou</option>
                <option value="Settat">Settat</option>
                <option value="Sidi Bennour">Sidi Bennour</option>
                <option value="Sidi Ifni">Sidi Ifni</option>
                <option value="Sidi Kacem">Sidi Kacem</option>
                <option value="Sidi Slimane">Sidi Slimane</option>
                <option value="Skhirate-Temara">Skhirate-Témara</option>
                <option value="Tarfaya">Tarfaya</option>
                <option value="Taroudant">Taroudant</option>
                <option value="Tata">Tata</option>
                <option value="Taounate">Taounate</option>
                <option value="Taourirt">Taourirt</option>
                <option value="Taza">Taza</option>
                <option value="Tetouan">Tétouan</option>
                <option value="Tinghir">Tinghir</option>
                <option value="Tiznit">Tiznit</option>
                <option value="Youssoufia">Youssoufia</option>
                <option value="Zagora">Zagora</option>
            </select>
        )
    }
}

export default SelectProvince;