import React from 'react';
import avatar from '../images/avatars/male.png'
import { Button, Card, Container, Row, Form, Nav, Col, Image } from 'react-bootstrap';

import { getUserData, updateUser } from '../services/users'

class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: {},
        }
    }

    async componentDidMount() {
        const userData = await getUserData();
        this.setState({
            editForm: {
                handle: userData.handle,
                name: userData.name
            }
        })
    }


    handleBackClick () {
        const { history } = this.props;
        history.push('/myprofile')
    }

    handleEditClick () {
        const { history } = this.props;
        history.push('/editprofile')
    }

    handleInputChange(field, event) {
        this.setState({
            editForm: {
                ...this.state.editForm,
                [field]: event.target.value,
            }
        })
    }

    async handleSubmitAttempt(event) {
        event.preventDefault();
        const { history } = this.props;

        const { name, handle } = this.state.editForm;

        await updateUser({ name, handle });
        history.replace('./myprofile');
    }

    logRadio(event) {
        console.log(event.target.value)
    }

    render() {     
        return (
            <Container>
                <Row>
                    <Col>
                        <Nav justify variant="tabs" defaultActiveKey="/myprofile">
                            <Nav.Item>
                                <Nav.Link href="/home">Home</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/myprofile">Profile</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-2">About</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Button style={{marginTop:"5px"}} onClick={this.handleBackClick.bind(this)}>Back to profile</Button>
                        <div>
                            <h3>Edit profile</h3>
                        </div>

                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder={this.state.editForm.name}
                                onChange={this.handleInputChange.bind(this, "name")}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupHandle">
                                <Form.Label>Handle</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder={this.state.editForm.handle}
                                onChange={this.handleInputChange.bind(this, "handle")}
                                />
                            </Form.Group>
                            <fieldset>
                                <Form.Group as={Row} onChange={this.logRadio.bind(this)}>
                                    <Form.Label as="legend" column sm={2}>
                                        Avatar
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Check
                                        type="radio"
                                        label="first radio"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        value="1"
                                        />
                                        <Form.Check
                                        type="radio"
                                        label="second radio"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        value="2"
                                        />
                                        <Image src={avatar} />
                                        <Form.Check
                                        type="radio"
                                        label="third radio"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios3"
                                        value="3"
                                        />
                                    </Col>
                                </Form.Group>
                            </fieldset>
                        </Form>
                        <Button onClick={this.handleSubmitAttempt.bind(this)}>Submit changes</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default EditProfile;