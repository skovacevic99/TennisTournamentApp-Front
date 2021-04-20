import React, { Component } from 'react';
import { Button, Form, Table, Col, Row } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class Takmicenja extends Component {
    
    constructor(props){
        super(props)

        let search = {
            mestoOdrzavanja: '',
            formatId: -1,
            datumOd: ""
        }

        this.state = {
            takmicenja: [],
            formati: [],
            search: search,
            pageNo: 0,
            totalPages: 1
        }
    }

    componentDidMount(){
        this.getTakmicenja(0);
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

    getTakmicenja(newPageNo){
        let config = {
            params: {
                pageNo: newPageNo
            }
        }

        if(this.state.search.mestoOdrzavanja != ""){
            config.params['mestoOdrzavanja'] = this.state.search.mestoOdrzavanja
        }
        if(this.state.search.formatId != -1){
            config.params["formatId"] = this.state.search.formatId
        }
        if(this.state.search.datumOd != ""){
            config.params['datumOd'] = this.state.search.datumOd
        }
        console.log(config.params)

        TestAxios.get("/takmicenja", config)
            .then(res => {
                console.log(res.data)
                this.setState({
                    takmicenja: res.data,
                    pageNo: newPageNo,
                    totalPages: res.headers['total-pages']
                })
            })
            .catch(error => {
                console.log(error)
                alert("Greska prilikom dobavljanja takmicenja.")
            })
    }

    renderTable(){
        return this.state.takmicenja.map(t => {
            return(
                <tr key={t.id}>
                    <td>{t.naziv}</td>
                    <td>{t.mestoOdrzavanja}</td>
                    <td>{t.datumPocetka}</td>
                    <td>{t.datumZavrsetka}</td>
                    <td>{t.formatTipTakmicenja}</td>
                    {this.prijavaProvera(t)}
                    {this.brisanjeProvera(t.id)}
                </tr>
            )
        })
    }

    prijavaProvera(t){
        if(window.localStorage['role'] == 'ROLE_KORISNIK'){
            if(!window.localStorage['prijavljen']){
                if(t.brojUcesnika < t.formatBrojUcesnika){
                    return <td><Button variant="primary" onClick={() => this.prijava(t.id)}>Prijavi se</Button></td>
                } else {
                    return null
                }
            } else{
                return null
            }
        } else {
            return null
        }
    }

    brisanjeProvera(id){
        if(window.localStorage['role'] == 'ROLE_ADMIN'){
            return <td><Button variant="danger" onClick={() => this.obrisi(id)}>Obrisi</Button></td>
        } else {
            return null
        }
    }

    proveraDodaj(){
        if(window.localStorage['role'] == 'ROLE_ADMIN'){
            return <Button variant="success" onClick={() => this.idiNaDodaj()} style={{float: 'left'}}>Kreiraj takmicenje</Button>
        } else {
            return null
        }
    }

    prijava(id){
        this.props.history.push("/takmicenja/prijava/" + id)
    }

    obrisi(id){
        TestAxios.delete("/takmicenja/" + id)
            .then(res => {
                this.obrisiIzState(id)
            })
            .catch(error => {
                console.log(error)
                alert("Greska prilikom brisanja takmicenja.")
            })
    }

    obrisiIzState(id){
        let takmicenja = this.state.takmicenja

        for(var i in takmicenja){
            if(takmicenja[i].id == id){
                takmicenja.splice(i, 1)
            }
        }
        this.setState({takmicenja: takmicenja})
    }

    pretraga(){
        return(
            <div style={{marginTop: '20px'}}>
                <Row>
                    <Col md={6}>
                        <Form>    
                            <Form.Group>
                                <Form.Label>Format</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="formatId"
                                    onChange={(e) => this.onSearchChange(e)}>
                                        <option value={-1}></option>
                                        {this.state.formati.map(f => {
                                            return(                 
                                                <option key={f.id} value={f.id}>{f.tipTakmicenja}</option>
                                            )
                                        })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mesto odrzavanja</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    placeholder="Mesto odrzavanja"
                                    name="mestoOdrzavanja"
                                    onChange={(e) => this.onSearchChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Datum pocetka od</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="date"
                                    name="datumOd"
                                    onChange={(e) => this.onSearchChange(e)}>
                                </Form.Control>
                            </Form.Group>
                            <Button onClick={() => window.location.reload()}>Restartuj pretragu</Button>
                        </Form>
                    </Col>
                 </Row>
            </div>
        )
    }

    onSearchChange(e){
        let name = e.target.name
        let value = e.target.value

        let search = this.state.search
        search[name] = value
        this.setState(search)

        this.getTakmicenja(0)
    }

    idiNaDodaj(){
        this.props.history.push("/takmicenja/dodaj")
    }
    
    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Takmicenja</h1>

                {this.pretraga()}

                <div style={{textAlign: 'right', marginTop: '20px'}}>
                    {this.proveraDodaj()}
                    <Button disabled={this.state.pageNo == 0} onClick={() => this.getTakmicenja(this.state.pageNo - 1)} variant="primary">Prev</Button>
                    <Button disabled={this.state.pageNo == this.state.totalPages - 1} onClick={() => this.getTakmicenja(this.state.pageNo + 1)} variant="primary">Next</Button>
                </div>
                <Table bordered striped style={{ marginTop: 5 }}>
                    <thead className="thead-dark">
                        <tr>
                            <th>Naziv takmicenja</th>
                            <th>Mesto odrzavanja</th>
                            <th>Datum pocetka Takmicenja</th>
                            <th>Datum zavrsetka takmicenja</th>
                            <th>Format</th>
                            <th colSpan="2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Takmicenja;