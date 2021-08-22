import {Component} from "react";
import {Button, Card, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import dictionary from "../dictionnary/dictionary";
import {loadWallet} from "../redux/actions";
import {connect} from "react-redux";
import {sha256} from "../wallet";

export class New extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {},
            havePrivateKey: false,
            seed: new dictionary().seed,
        }
        this.handleShow = this.handleShow.bind(this)
        this.handleWallet = this.handleWallet.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleShow(event) {
        this.setState({
            havePrivateKey: true
        })
    }

    handleWallet(event) {
        const seed = this.state.seed
        const seedHex = sha256(seed.toString().replaceAll(",", ""))
        const checkPassword = Buffer.from(sha256(sha256(this.state.password))).toString('hex')
        const encryptedSeed = this.xorArray(seedHex, checkPassword)
        const count = 1
        this.props.loadWallet(encryptedSeed,checkPassword,count,seedHex)
        this.props.login()
    }

    xorArray(seed_bytes, password_bytes) {
        var encrypted_seed = [];
        for (let iter = 0; iter < 32; iter++) {
            encrypted_seed.push(seed_bytes[iter] ^ password_bytes[iter])
        }
        return encrypted_seed;
    }

    handleChange(event) {
        switch (event.target.placeholder) {
            default : {
                const key = event.target.placeholder
                const data = event.target.value
                this.setState({[key]: data})
            }
        }
    }


    handleSubmit(event) {

    }

    componentDidMount() {
    }

    render() {
        console.log(this)
        switch (this.state.havePrivateKey) {
            default :
                return (
                    <div className={"container p-5"}>
                        <Card className="text-center">
                            <Card.Header>Create new Wallet</Card.Header>
                            <Card.Body>
                                <Card.Title>Create a wallet</Card.Title>
                                <Card.Text> Here is you're seed </Card.Text>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows={3} disabled value={this.state.seed}/>
                                </Form.Group>
                                <br/>

                                <Link className={"btn btn-primary"} onClick={this.handleWallet} to={{
                                    pathname: "/",
                                }}>Continue</Link>

                            </Card.Body>
                            <Card.Footer className="text-muted">Already have a wallet ? <Link to={"/"}> Unlock </Link>
                            </Card.Footer>
                        </Card>
                    </div>
                )
            case false:
                return (
                    <div className={"container p-5"}>
                        <Card className="text-center">
                            <Card.Header><Card.Title>Create a wallet</Card.Title></Card.Header>
                            <Card.Body>
                                <Form.Group onSubmit={this.handleSubmit}>
                                    <Form.Control type="text" onChange={this.handleChange} value={this.state.name}
                                                  placeholder="name"/>
                                    <br/>
                                    <Form.Control type="text" onChange={this.handleChange}
                                                  value={this.state.password} placeholder="password"/>
                                </Form.Group>
                                <br/>
                                <Button variant="primary" onClick={this.handleShow}>download private Key</Button>
                            </Card.Body>
                            <Card.Footer className="text-muted">Already have a wallet ? <Link to={"/"}> Unlock </Link>
                            </Card.Footer>
                        </Card>
                    </div>

                )

        }
    }

}


export default connect(null, {loadWallet})(New);