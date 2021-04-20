import React, { Component } from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class Prijava extends Component {

    state = {
        id: this.props.match.params.id,
        kontakt: "",
        drzavaTakmicara: ""
    }

    prijava(){

        if(this.proveriInputPolja() == true){
            let params = {
                takmicenjeId: this.state.id,
                kontakt: this.state.kontakt,
                drzavaTakmicara: this.state.drzavaTakmicara
            }
            console.log(params)
    
            TestAxios.post("/prijave", params)
                .then(res => {
                    alert("Uspesno ste se prijavili")
                    window.localStorage.setItem("prijavljen", "da")
                    this.props.history.push("/takmicenja")
                })
                .catch(error => {
                    console.log(error)
                    alert("Greska prilikom prijave")
                })
        } else {
            alert("Podaci koje ste uneli nisu u dobrom formatu")
        }
    }

    onInputChange(e){
        let name = e.target.name
        let value = e.target.value

        let change = {}
        change[name] = value
        this.setState(change)
    }

    proveriInputPolja(){
        if(this.state.kontakt != "" && this.state.drzavaTakmicara.length === 3){
                return true
            } else {
                return false
            }
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Prijava na takmicenje</h1>

                <Row>
                    <Col md={6}>
                        <Form>    
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    placehodler="something@gmail.com"
                                    name="kontakt"
                                    onChange={(e) => this.onInputChange(e)}>
                                </Form.Control>
                             </Form.Group>
                              <Form.Group>
                                    <Form.Label>Oznaka drzave</Form.Label>
                                    <Form.Control
                                        as="input"
                                        type="text"
                                        placeholder="USA, SRB ..."
                                        name="drzavaTakmicara"
                                        onChange={(e) => this.onInputChange(e)}>
                                    </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={() => this.prijava()}>Prijavi se</Button>
                    </Col>
                 </Row>
            </div>
        );
    }
}

export default Prijava;