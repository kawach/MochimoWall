import {Component} from "react";
import {Accordion, Card, Spinner} from "react-bootstrap";
import {generate_full_WOTS} from "../wallet/manager";
import {sha256} from "../wallet";
import BalanceContent from "./BalanceContent";
import Send from "./Send";
const mochimo = require("mochimo")
export class BalanceHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            active: "balance",
        }
        this.handleSend = this.handleSend.bind(this)
    }

    componentDidMount() {
        console.log(this.props.seed)
        const wots = mochimo.Wots.generate(this.props.seed)
    }

    handleSend() {
        if (this.state.active === "balance") {
            this.setState({active: "send", changeWots: generate_full_WOTS(this.props.secret)})
        } else {
            this.setState({active: "balance", changeWots: undefined})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.state.wots.address.toString().replaceAll(',',''))
        if (this.state.wots !== prevState.wots) {
            // fetch("http://api.mochimo.org:8888/bc/balance/" + this.state.wots.address.toString().replaceAll(',',''), {
            //     mode: "no-cors",
            // }).then(res => res.json()).then(response => {
            //     console.log(response)
            //     this.setState({balance: response.balance})
            // })
        }
    }
    render() {
        console.log(this)
        const active = this.state.active
        const wots = this.state.wots
        return (
            <div className={"container px-5 pb-2"} key={this.props.index + 1}>
                <Card className="text-center">
                    <Accordion eventKey={this.props.index + 1}>
                        <Accordion.Toggle as={Card.Header} eventKey={this.props.index + 1}
                                          onClick={() => {
                                              navigator.clipboard.writeText(Buffer.from(this.state.wots[0]).toString("hex"))
                                          }}>


                            <div className="row-collumns col-4 text-black">
                                {/*{ this.props.value[1].tag ?<div>Balance Tag : <span id="theTag"> {this.props.value[1].tag} </span></div>:null }*/}
                            </div>
                            <div className=""> Amount
                                available {undefined !== this.state.balance ? this.state.balance :
                                    <Spinner animation="border" role="status"> </Spinner>}</div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={this.props.index + 1}>
                            {active === "balance" ? <BalanceContent onActiveChange={this.handleSend} balance={this.props.balance} /> :
                                <Send onActiveChange={this.handleSend} source_balance={this.state.balance} sourceWots={wots} secrect={this.props.secret} last_balance_id={this.props.last_balance_id} tag={this.props.value[1].tag}/> }
                        </Accordion.Collapse>
                    </Accordion>
                </Card>
            </div>
        )
    }
}