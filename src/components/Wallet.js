import {Component} from "react";
import {connect} from "react-redux";
import Login from "./Login";
import Logged from "./Logged";
import {BalanceHeader} from "./BalanceHeader";

const {Wots} = require('mochimo')

export class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: undefined,
            logged: false,
            count: 1
        }
        this.handleWallet = this.handleWallet.bind(this)
    }

    handleWallet(seed, password) {
        this.setState({encryptedSeed: seed})
        this.props.login()
    }

    xorArray(seed_bytes, password_bytes) {
        let result = [];
        for (let iter = 0; iter < 32; iter++) {
            result.push(seed_bytes[iter] ^ password_bytes[iter])
        }
        return result;
    }

    render() {
        console.log(this)
        if (!this.props.isLogged) {
            return (
                <Login handleWallet={this.handleWallet}/>
            )
        }
        if (this.props.wallet) {
            return (
                <div>
                    <Logged />
                </div>
            )
            // } else {
            //     return (
            //         <div>
            //             <Logged seed={this.state.secret}/>
            //             {/*{Object.entries(this.props.wallet.balances).map((value, index) => {*/}
            //             {/*    return <BalanceHeader index={index} value={value} key={index} wallet={this.props.wallet} secret={this.state.secret} last_balance_id={Object.entries(this.props.wallet.balances).length}/>*/}
            //             {/*})}*/}
            //         </div>
            //     )
        }
    }
}

function mapStateToProps(state) {
    const {wallet} = state
    return {wallet}
}

export default connect(mapStateToProps, null)(Wallet)