import {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {newBalance} from "../redux/actions";

const mochimo = require("mochimo")

export class Send extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }

    handleCancel(e) {
        this.props.onActiveChange()
    }

    handleChange(event) {
        switch (event.target.placeholder) {
            case "amount" :
                this.setState((state) => {
                    state.amount = Number(event.target.value)
                })
                break
            case "receiver" :
                this.setState((state) => {
                    state.receiver = event.target.value
                })
                break
            default: {
                return
            }
        }
    }

    initTransaction() {
        function toFixed(n, fractionalDigits) {
            const factor = 10 ** fractionalDigits
            // Pré ES2016 : Math.pow(10, fractionalDigits)
            return Math.round(n * factor) / factor
        }
        let result = [];
        const times = n => f => {
            let iter = i => {
                if (i === n) return
                f(i)
                iter(i + 1)
            }
            return iter(0)
        };
        let test = Buffer.from("ilovetrains").toString("hex")
        let signature = mochimo.Wots.sign(test, this.props.sourceWots.secret)
        times(8)(i => result.push(0)) /*8 ZEROES*/
        times(1)(i => result.push(0x03))  // 1 0x03
        times(115)(i => result.push(0)) // 115 ZEROES
        times(2208)(i => result.push(this.props.sourceWots.address[i])) // 2208 SRC RAW WOTS
        times(2208)(i => result.push(this.state.receiver[i])) // 2208 DST RAW WOTS
        times(2208)(i => result.push(this.props.changeWots.address[i]))// 2208 CHG RAW WOTS
        times(1)(i => result.push(this.state.amount))// 8 SEND AMOUNT TODO: Change this
        times(1)(i => result.push(this.props.balance - this.state.input.amount))// 8 CHANGE AMOUNT TODO: Change this
        times(1)(i => result.push("00000500"))// 8 FEE
        times(2144)(i => result.push(signature[i]))// 2144 WOTS SIGNATURE
        times(2)(() => result.push("0")) // 2 ZEROES
        times(2)(() => result.push("0xCDAB")) // 2 0xCDAB
        console.log(result)
        const tx = new mochimo.Tx();
        tx.opcode = 0x300; // looks like special api op code
        tx.srcaddr = this.props.sourceWots.address;
        tx.dstaddr = this.state.receiver;
        tx.chgaddr = this.props.changeWots.address;
        tx.sendtotal = this.props.balance - this.state.amount;
        tx.changetotal = this.props.balance - (this.state.amount + 500);
        tx.txfee = 500; // should be 500
        tx.txsig = signature;
        tx.trailer = mochimo.TXEOT; // 0xabcd
        console.log(this.props.balance - (this.state.amount + 500))
        const txbase64 = Buffer.from(result).toString('base64');
        fetch('http://api.mochimo.org:8889/push', {
            method: 'POST',
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: {"transaction": txbase64}
        }).then(
            (res) => {
                // console.log(res.status)
            }
        ).then((res)=>{})
    }

    render() {
        return (
            <Container>
                <Form>
                    <Form.Group controlId="formBasicRange">
                        <Form.Label>Receiver : </Form.Label>
                        <Form.Control type="text" placeholder="receiver" onChange={this.handleChange}
                                      value={this.state.input.receiver}/>
                        <Form.Label> Amount </Form.Label>
                        <Form.Control type="text" placeholder="amount" onChange={this.handleChange}
                                      value={this.state.input.amount}/>
                    </Form.Group>
                </Form>
                <Row>
                    <Col> <Button onClick={this.handleCancel}> Cancel </Button> </Col>
                    <Col> <Button onClick={() => {
                        this.initTransaction()
                    }}> Send </Button></Col>
                </Row>
            </Container>
        );
    }
}

export default connect(null, {newBalance})(Send)

