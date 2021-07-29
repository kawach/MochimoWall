import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import {Component} from "react";
import Wallet from "./components/Wallet";
import New from "./components/New";
import Logged from "./components/Logged";
import {Fragment} from "react";
import TopNav from "./components/Navbar";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false
        }
        this.toggleLogged = this.toggleLogged.bind(this)
    }
    toggleLogged(){
        this.setState({logged: !this.state.logged})
    }
    render() {
        console.log(this)
        return (
            <Fragment>
                <TopNav />
                <BrowserRouter>
                    <Route exact path="/">
                        <Wallet login={this.toggleLogged} isLogged={this.state.logged}/>
                    </Route>
                    <Route path="/new">
                        <New login={this.toggleLogged}/>
                    </Route>
                    <Route path="/logged">
                        <Logged />
                    </Route>
                </BrowserRouter>
            </Fragment>
        )
    }


}




