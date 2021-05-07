import {Component} from "react";
import {connect} from "react-redux";
import Login from "./Login";
import {newBalance} from "../redux/actions";
import Logged from "./Logged";
import {BalanceHeader} from "./BalanceHeader";


export class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: undefined,
            logged: false
        }
        this.handleWallet = this.handleWallet.bind(this)
    }

    handleWallet(wallet){
        this.setState({secret: wallet})
        this.props.login()
    }

    render() {
        console.log(this)
        if (!this.props.isLogged) {
            return (
                <Login handleWallet={this.handleWallet}/>
            )
        } if (this.props.wallet.encryptedSeed && !this.props.wallet.balances) {
            return (
                <div>
                    <Logged secret={this.state.secret}/>
                </div>
            )
        } else {
            return (
                <div>
                    <Logged secret={this.state.secret}/>
                    {Object.entries(this.props.wallet.balances).map((value, index) => {
                        return <BalanceHeader index={index} value={value} key={index} wallet={this.props.wallet} secret={this.state.secret} last_balance_id={Object.entries(this.props.wallet.balances).length}/>
                    })}
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    const {wallet} = state
    return {wallet}
}

export default connect(mapStateToProps, {newBalance})(Wallet)