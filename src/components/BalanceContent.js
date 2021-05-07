import {Component} from "react";

export default class BalanceContent extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        this.props.onActiveChange()
    }

    render() {
        return (
            <div className="container text-dark">
                <div className="row">
                    <div className="col-sm-8 text-start d-flex">
                        <span> QR </span>
                        <div></div>
                    </div>
                    <div className="col-sm-4">
                        <a href="https://bx.mochimo.org/"></a> Wallet Balance
                        <p className="text-center h3"></p>
                    </div>
                    <div className="col-sm-4 text-start">
                        {/*<p> Status : {this.props.value[1].status}</p>*/}
                    </div>
                    <div
                        className="col-sm-8 container d-flex align-items-end justify-content-end">
                        <button className="btn btn-outline-dark me-md-2"
                                type="button">export
                        </button>
                        <button className="btn btn-outline-dark"
                                onClick={this.handleChange}
                                eventKey="second"
                                type="button">send
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}