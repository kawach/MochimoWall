import {Component} from "react";
import {Nav, NavDropdown, Navbar} from "react-bootstrap";
import logo from '../mochimo-pq-logo.svg'
export default class TopNav extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/" bsPrefix={"navbar-brand"}><img width={"250px"} src={logo}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Navbar className="mr-auto">
                        <Nav.Link href="/">Login</Nav.Link>
                        <Nav.Link href="/new">New Wallet</Nav.Link>
                        <NavDropdown title="Action" id="basic-nav-dropdown">
                            <NavDropdown.Item href="">New Balance</NavDropdown.Item>
                            <NavDropdown.Item href="">Send</NavDropdown.Item>
                            <NavDropdown.Item href="">Receive</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}