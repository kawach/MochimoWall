import {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {byte_copy, from_int_to_byte_array, sha256, wots_sign} from "../wallet";
import {generate_full_WOTS} from "../wallet/manager";
import {connect} from "react-redux";
import {newBalance} from "../redux/actions";
export class Send extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.compute_transaction = this.compute_transaction.bind(this)
        this.handleSend = this.handleSend.bind(this)
    }

    arrayBufferToBase64( buffer ) {
        function b2a(a) {
            var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
            if (!a) return a;
            // eslint-disable-next-line no-unused-expressions
            do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e,
                f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
            return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
        }
        var binary = ''; var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return b2a( binary );
    }

    hexToBase64(data) {
        var result = [];
        for (var i = 0; i < data.length; i += 2) {
            result.push(parseInt(data.substr(i, 2), 16));
        }
        return result;
    }

    toHexString(data) {
        return Array.prototype.map.call(data, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    compute_transaction(source_wots, source_secret, change_wots, destination_wots, sent_amount, remaining_amount, fee) {
        //the lenght in bytes the sign message will have is 6456 bytes
        function generate_zeros(how_much) {
            let zeros = [];
            for (let i = 0; i < how_much; i++) {
                zeros.push(0);
            }
            return zeros;
        }

        let message = [];
        message.pushArray(generate_zeros(2)); //things of network etc
        message.pushArray([57, 5]);
        message.pushArray(generate_zeros(4)); //things of network etc
        message.pushArray(byte_copy(from_int_to_byte_array(3), 2))
        message.pushArray(generate_zeros(16)); //the two blocks things
        message.pushArray(generate_zeros(32 * 3)); //block etc hashes and weight
        message.pushArray(generate_zeros(2)); //len..

        if (source_wots.length != 2208 || change_wots.length != 2208 || destination_wots.length != 2208) {
            console.log("the input parameters are wrong")
            return false;
        }
        message.pushArray(source_wots);
        message.pushArray(destination_wots);
        message.pushArray(change_wots);
        let send_total = byte_copy(from_int_to_byte_array(sent_amount), 8);
        message.pushArray(send_total);
        let change_total = byte_copy(from_int_to_byte_array(remaining_amount), 8);
        message.pushArray(change_total);
        let tx_fee = byte_copy(from_int_to_byte_array(fee), 8);
        message.pushArray(tx_fee);
        let message_to_sign = message.slice(10 + 16 + 32 * 3 + 2, 10 + 16 + 32 * 3 + 2 + 2208 * 3 + 3 * 8);
        let hash_message = sha256(message_to_sign.toASCII());
        let pub_seed = source_wots.slice(2144, 2144 + 32);
        let pub_addr = source_wots.slice(2144 + 32, 2144 + 64);
        let signature = wots_sign(hash_message, source_secret, pub_seed, pub_addr);
        message.pushArray(signature);
        message.pushArray(generate_zeros(2));
        message.pushArray([205, 171]);
        return message;
    }

    handleSend(event) {
        switch (Object.entries(this.state.input.receiver).length) {
            case 24:
                console.log("it's a TAG !")
                const address = fetch('http://api.mochimo.org:8888/bc/resolve/' + this.state.input.receiver).then(res => res.json()).then((result) => {
                    this.setState((state) => {
                        state.input.receiver = address
                    })
                })
            default:
                const last_block = fetch("http://api.mochimo.org:8888/net/chain")
                    .then(res => res.json())
                    .then(
                        (result) => {
                            // this.props.newBalance(this.state.input.tag, this.state.input.password, this.state.count, result.block.height)
                        })
                const change_wots = generate_full_WOTS(sha256(this.props.secret + this.props.balance_id), this.props.tag)
                // console.log(this.props.sourceWots[0].length)
                // console.log(change_wots[0].length)
                const wots_receiver = this.hexToBase64(this.state.input.receiver)
                console.log(Number(this.props.source_balance))
                this.setState((state) => {
                    state.input = {}
                })
                console.log(Number(this.props.source_balance) - this.state.input.amount - 500)
                // this.props.newBalance(this.props.last_balance_id + 1, last_block, this.props.tag, "Activated")
                const transactionArray = this.compute_transaction(this.props.sourceWots[0], this.props.sourceWots[1], change_wots[0], wots_receiver, this.state.input.amount,Number(this.props.source_balance) - this.state.input.amount - 500, 500)
                fetch('http://api.mochimo.org:8889/push', {
                    method: 'POST',
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: {"transaction":this.arrayBufferToBase64(transactionArray), "recipients":"5"},
                }).then(
                    (res) => {
                        console.log(res.status)
                    }
                ).then((res)=>{console.log(res)})
        }
    }

    handleCancel(e) {
        this.props.onActiveChange()
    }

    handleChange(event) {
        switch (event.target.placeholder) {
            case "amount" :
                this.setState((state)=>{
                    state.input["amount"] = Number(event.target.value)
                })
                break
            case "receiver" :
                this.setState((state)=>{
                    state.input["receiver"] = event.target.value
                })
                break
            default: {
                return
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.input !== this.state.input){
            console.log("update")
            console.log(this)
        }
    }

    render() {
        console.log(this)
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
                    <Col> <Button onClick={this.handleSend}> Send </Button></Col>
                </Row>
            </Container>
        );
    }
}

export default connect(null, {newBalance})(Send)