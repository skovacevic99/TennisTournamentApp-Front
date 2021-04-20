import React, { Component } from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class DodajTakmicenje extends Component {

    state = {
        formati: [],
        naziv: "",
        mestoOdrzavanja: "",
        datumPocetka: "",
        datumZavrsetka: "",
        formatId: -1,
        trenutnoVreme: new Date().toISOString().substring(0,10)
    }

    componentDidMount(){
        this.getFormati();
    }

    getFormati(){
        TestAxios.get("/formati")
            .then(res => {
                this.setState({formati: res.data})
            })
            .catch(error => {
                console.log(error)
                alert("Greska prilikom dobavljanja formata.")
            })
    }

    onInputChange(e){
        let name = e.target.name
        let value = e.target.value

        let change = {}
        change[name] = value
        this.setState(change)
    }

    proveriInputPolja(){
        if(this.state.naziv != "" && this.state.mestoOdrzavanja != "" && this.state.datumPocetka != "" &&  
            this.state.datumZavrsetka != "" && this.state.formatId != -1){
                return true
            } else {
                return false
            }
    }

    kreirajTakmicenje(){

        if(this.proveriInputPolja() == true){

            let params = {
                naziv: this.state.naziv,
                mestoOdrzavanja: this.state.mestoOdrzavanja,
                datumPocetka: this.state.datumPocetka,
                datumZavrsetka: this.state.datumZavrsetka,
                formatId: this.state.formatId
            }
            console.log(params)

            TestAxios.post("/takmicenja", params)
                .then(res => {
                    alert("Takmicenje uspesno kreirano!")
                    this.props.history.push("/takmicenja")
                })
                .catch(error => {
                    alert("Greska prilikom kreiranja takmicenja.")
                })
        } else {
            alert("Niste unevi sva polja.")
        }
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Dodaj takmicenje</h1>

                <Row>
                    <Col md={6}>
                        <Form>    
                            <Form.Group>
                                    <Form.Label>Naziv takmicenja</Form.Label>
                                    <Form.Control
                                        as="input"
                                        type="text"
                                        placeholder="Naziv takmicenja"
                                        name="naziv"
                                        onChange={(e) => this.onInputChange(e)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Mesto odrzavanja</Form.Label>
                                    <Form.Control
                                        as="input"
                                        type="text"
                                        placeholder="Mesto odrzavanja"
                                        name="mestoOdrzavanja"
                                        onChange={(e) => this.onInputChange(e)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Datum pocetka takmicenja</Form.Label>
                                    <Form.Control
                                        as="input"
                                        type="date"
                                        min={this.state.trenutnoVreme}
                                        name="datumPocetka"
                                        onChange={(e) => this.onInputChange(e)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Datum zavrsetka takmicenja</Form.Label>
                                    <Form.Control
                                        as="input"
                                        type="date"
                                        min={this.state.trenutnoVreme}
                                        name="datumZavrsetka"
                                        onChange={(e) => this.onInputChange(e)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Format</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="formatId"
                                        onChange={(e) => this.onInputChange(e)}>
                                            <option value={-1}></option>
                                            {this.state.formati.map(f => {
                                                return(                 
                                                    <option key={f.id} value={f.id}>{f.tipTakmicenja}</option>
                                                )
                                            })}
                                    </Form.Control>
                                </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={() => this.kreirajTakmicenje()}>Kreiraj takmicenje</Button>
                    </Col>
                 </Row>
            </div>
        );
    }
}

export default DodajTakmicenje;