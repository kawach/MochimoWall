import {Component} from "react";
import {Button, Card, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {connect} from "react-redux";
import wallet from "../redux/reducers/wallet";
import CreateBalance from "./CreateBalance";
import {newBalance} from "../redux/actions";
import {BalanceHeader} from "./BalanceHeader";

export class Logged extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {},
            show: false,
            balanceCreation: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleBalanceCreation = this.handleBalanceCreation.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
        this.toggleBalanceCreation = this.toggleBalanceCreation.bind(this)
    }

    toggleBalanceCreation() {
        this.setState({balanceCreation: !this.state.balanceCreation})
    }

    handleBalanceCreation(event) {
        //TODO: Check tag length
        // const last_block = fetch("http://api.mochimo.org:8888/net/chain")
        //     .then(res => res.json())
        //     .then(
        //         (result) => {
        //             this.props.newBalance(this.state.input.tag, this.state.input.password, this.state.balances.count, result.block.height)
        //         }, (result) => {
        //             return console.log("connexion error")
        //         }
        //     )

    }

    handleChange(event) {
        switch (event.target.placeholder) {
            default: {
                this.setState((state) => {
                    state.input[event.target.placeholder] = event.target.value
                })
            }
        }
    }


    handleDownload() {
        const fileName = "wallet";
        let file = {
            "encryptedSeed": [this.props.wallet.encryptedSeed],
            "check_password": this.props.wallet.check_password,
            "count": this.props.wallet.count
        }
        const blob = new Blob([JSON.stringify(file)], {type: "application/json"})
        const el = document.createElement('a')
        el.href = URL.createObjectURL(blob)
        el.download = fileName + ".json"
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (this.props.wallet.balances !== prevProps.wallet.balances) {
        //     this.setState({count: Object.keys(this.props.wallet.balances).length})
        // }
    }

    componentDidMount() {
        // if (this.props.wallet.balances !== undefined) {
        //     this.setState({count: (Object.keys(this.props.wallet.balances)).length})
        // }
    }

    xorArray(seed_bytes, password_bytes) {
        var result = [];
        for (let iter = 0; iter < 32; iter++) {
            result.push(seed_bytes[iter] ^ password_bytes[iter])
        }
        return result;
    }

    render() {
        /*TODO: gestion upload wallet (redux ?)
        * TODO:  
        * */
        console.log(this)
        return (
            <div className={"container p-5"}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <Container>
                                <Row>
                                    <Col>Wallet </Col>
                                    <Col className={"text-center"}>total amount :</Col>
                                </Row>
                            </Container>
                        </Card.Title>
                        <Container>
                            <Row>
                                <Col> </Col>
                                <Col className={"text-center"}>0</Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
                <Container>
                    <Row>
                        <Col className={"text-end"}>
                            <Button className={"text-end m-2"} onClick={this.handleDownload}> Export </Button>
                            <Button className={"text-end m-2"} onClick={this.toggleBalanceCreation}> New
                                Balance </Button>
                        </Col>
                    </Row>
                </Container>

                <CreateBalance isOpen={this.state.balanceCreation} closeModal={this.toggleBalanceCreation}
                               id={this.props.wallet.count + 1}/>
                {/*TODO: rework this as ul/li list */}
                {Array.from({ length: this.props.wallet.count }, (_, i) => <BalanceHeader seed={this.props.wallet.naked} id={i}/>)}
                {}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {wallet} = state
    return {wallet}
}

export default connect(mapStateToProps, null)(Logged)