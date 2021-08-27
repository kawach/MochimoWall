import {Component} from "react";
import {Accordion, Card, Spinner} from "react-bootstrap";
import {generate_full_WOTS} from "../wallet/manager";
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
        const wots = mochimo.Wots.generate(Buffer.from(this.props.seed + this.props.id))
        let i = Buffer.from(wots.address).toString("hex")
        fetch("http://api.mochimo.org:8888/bc/balance/" + i).then(res => res.json()).then((result)=>{ this.setState({wots: wots, balance: result.balance})})
    }

    handleSend() {
        if (this.state.active === "balance") {
            this.setState({active: "send", changeWots: generate_full_WOTS(this.props.secret)})
        } else {
            this.setState({active: "balance", changeWots: undefined})
        }
    }
    render() {
        const active = this.state.active
        const wots = this.state.wots
        return (
            <div className={"container px-5 pb-2"} key={this.props.id + 1}>
                <Card className="text-center">
                    <Accordion eventKey={this.props.id + 1}>
                        <Accordion.Toggle as={Card.Header} eventKey={this.props.id + 1}
                                          onClick={() => {
                                              navigator.clipboard.writeText(Buffer.from(this.state.wots.address).toString('hex'))
                                          }}>
                            <div className="row-collumns col-4 text-black">
                                {/*{ this.props.value[1].tag ?<div>Balance Tag : <span id="theTag"> {this.props.value[1].tag} </span></div>:null }*/}
                            </div>
                            <div className=""> Amount
                                available {undefined !== this.state.balance ? this.state.balance :
                                    <Spinner animation="border" role="status"> </Spinner>}</div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={this.props.id + 1}>
                            {active === "balance" ?
                                <BalanceContent onActiveChange={this.handleSend} balance={this.props.balance}/> :
                                <Send onActiveChange={this.handleSend} sourceWots={wots} changeWots={mochimo.Wots.generate(Buffer.from(this.props.seed + this.props.count))} balance={this.state.balance}/>}
                        </Accordion.Collapse>
                    </Accordion>
                </Card>
            </div>
        )
    }
}