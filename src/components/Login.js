import React, {Component} from "react";
import {Button, Card, Form, Nav} from "react-bootstrap";
import {Link, Route, Switch} from "react-router-dom";
import {loadWallet} from "../redux/actions";
import {connect} from "react-redux";
import {sha256} from "../wallet";
import {forEach} from "react-bootstrap/ElementChildren";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "keystore",
            uploaded: false
        }
        this.handleSelect = this.handleSelect.bind(this)
        this.handleLoad = this.handleLoad.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this)
        this.fileInput = React.createRef();
    }

    handleSelect(key) {
        this.setState({
            key: key
        })
    }
    handleChange(event){
        const userInput = event.target.value
        this.setState({input: userInput})
    }

    handleLoad(event){
       const file = event.target.files[0]
        const reader = new FileReader()
        reader.onloadend = this.handleFile
        reader.readAsText(file)
    }

    handleFile = (e) =>{
        const content = e.target.result
        const wallet = JSON.parse(content)
        console.log(wallet)
        // this.props.loadWallet(wallet)
        this.setState({wallet}  )
    }

    /*Handle login phase*/
    handleClick(){
        const encryptedSeed = this.state.wallet.encryptedSeed[0] /*TODO: make this more beautifull*/
        const userInput = Buffer.from(sha256(sha256(this.state.input))).toString('hex')
        const checkPassword = this.state.wallet.check_password
        const naked = this.xorArray(userInput, encryptedSeed)
        const count = this.state.wallet.count
        if (checkPassword.toString().localeCompare(userInput) === 0){
            this.props.loadWallet(encryptedSeed,checkPassword,count,naked)
            this.props.handleWallet(encryptedSeed,checkPassword,count,naked)
        }
    }

    xorArray(seed_bytes, password_bytes) {
        var encrypted_seed = [];
        for (let iter = 0; iter < 32; iter++) {
            encrypted_seed.push(seed_bytes[iter] ^ password_bytes[iter])
        }
        return encrypted_seed;
    }

    render() {
        switch (this.state.key) {
            default:
                return (
                    <div className="container p-5">
                        <Card className="text-center">
                            <Card.Header>Unlock You're wallet</Card.Header>
                            <Nav fill variant="tabs" defaultActiveKey="/" onSelect={this.handleSelect}>
                                <Nav.Item>
                                    <Nav.Link eventKey="keystore">Keystore</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="mnemonic">Mnemonic</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="private">Private Key</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Card.Body>
                                <Card.Title>Unlock you're wallet</Card.Title>
                                <form onSubmit={this.handleSubmit}>
                                    <label>
                                        Upload file:
                                        <input type="file" ref={this.fileInput} onChange={this.handleLoad}/>
                                    </label>
                                    <br/>
                                    <br/>
                                    <Form.Control type="text" placeholder="Password" onChange={this.handleChange}/>
                                    <br/>
                                    <Button className={"btn btn-primary"} type={"button"} onClick={this.handleClick} >Go somewhere</Button>
                                </form>
                            </Card.Body>
                            <Card.Footer className="text-muted">Don't have a wallet ? <Link
                                to="/new"> Create </Link></Card.Footer>
                        </Card>
                    </div>
                )
            case "mnemonic":
                return (
                    <div className="container p-5">
                        <Card className="text-center">
                            <Card.Header>Unlock You're wallet</Card.Header>
                            <Nav fill variant="tabs" defaultActiveKey="/" onSelect={this.handleSelect}>
                                <Nav.Item>
                                    <Nav.Link eventKey="keystore">Keystore</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="mnemonic">Mnemonic</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="private">Private Key</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Card.Body>
                                <Card.Title>Unlock you're wallet</Card.Title>
                                <Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Example textarea</Form.Label>
                                        <Form.Control as="textarea" rows={3}/>
                                    </Form.Group>
                                    <br/>
                                    <Form.Control type="text" placeholder="Password"/>
                                </Form.Group>
                                <br/>
                                <Button variant="primary">Go somewhere</Button>
                            </Card.Body>
                            <Card.Footer className="text-muted">Don't have a wallet ? <Link
                                to="/new"> Create </Link></Card.Footer>
                        </Card>
                    </div>
                )
            case "private":
                return (
                    <div className="container p-5">
                        <Card className="text-center">
                            <Card.Header>Unlock You're wallet</Card.Header>
                            <Nav fill variant="tabs" defaultActiveKey="/" onSelect={this.handleSelect}>
                                <Nav.Item>
                                    <Nav.Link eventKey="keystore">Keystore</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="mnemonic">Mnemonic</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="private">Private Key</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Card.Body>
                                <Card.Title>Unlock you're wallet (other way)</Card.Title>
                                <Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Example textarea</Form.Label>
                                        <Form.Control as="textarea" rows={3}/>
                                    </Form.Group>
                                    <br/>
                                    <Form.Control type="text" placeholder="Password"/>
                                </Form.Group>
                                <br/>
                                <Button variant="primary">Go somewhere</Button>
                            </Card.Body>
                            <Card.Footer className="text-muted">Don't have a wallet ? <Link
                                to="/new"> Create </Link></Card.Footer>
                        </Card>
                    </div>
                )
        }
    }
}

export default connect(null, {loadWallet})(Login)

