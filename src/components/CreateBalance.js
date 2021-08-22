import {Component} from "react";
import {Button, Col, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {newBalance, loadWallet} from "../redux/actions";

class CreateBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: undefined
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleRandomTag = this.handleRandomTag.bind(this)
        this.handleBalanceCreation = this.handleBalanceCreation.bind(this)
    }

    handleChange(event) {
        switch (event.target.placeholder) {
            default: {
                this.setState({input: event.target.value})
            }
        }
    }

    handleRandomTag(event) {
        let result = ['0', '2'];
        let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

        for (let n = 0; n < 22; n++) {
            result.push(hexRef[Math.floor(Math.random() * 16)]);
        }
        this.setState({input: result.join('')});
    }

    handleBalanceCreation(event) {
        this.props.newBalance(this.props.id, this.state.input, "to_activate")
        this.props.loadWallet(this.props.wallet.encryptedSeed,this.props.wallet.check_password, this.props.wallet.count + 1, this.props.wallet.naked)
        this.props.closeModal()
        this.setState({input: undefined})
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevProps.id !== this.props.id) {
    //         this.setState({id: this.props.id + 1})
    //     }
    // }

    render() {
        console.log(this)
        return (
            <Modal show={this.props.isOpen} onHide={this.props.closeModal} test={this.state}>
                <Modal.Header>
                    <Modal.Title>New Balance</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} controlId="balanceTag" className={"mb-2"}>
                            <Form.Label column sm="2">
                                Tag
                            </Form.Label>
                            <Col sm="10">
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="tag"
                                        aria-describedby="inputGroupPrepend"
                                        onChange={(event) => {
                                            this.handleChange(event)
                                        }}
                                        value={this.state.input}
                                    />
                                    <InputGroup.Prepend>
                                        <Button onClick={this.handleRandomTag}> Random Tag </Button>
                                    </InputGroup.Prepend>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        {/*<Form.Group as={Row} controlId="balancePassword" className={"mb-2"}>*/}
                        {/*    <Form.Label column sm="2">*/}
                        {/*        Password*/}
                        {/*    </Form.Label>*/}
                        {/*    <Col sm="10">*/}
                        {/*        <Form.Control type="text" placeholder="password"*/}
                        {/*                       onChange={this.handleChange}/>*/}
                        {/*    </Col>*/}
                        {/*</Form.Group>*/}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleBalanceCreation}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
function mapStateToProps(state) {
    const {wallet} = state
    return {wallet}
}

export default connect(mapStateToProps, {newBalance,loadWallet})(CreateBalance)