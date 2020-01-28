import React from 'react';
import avatar from '../images/avatars/male.png'
import { Button, Card, Container, Row, Form, Nav, Col, Image } from 'react-bootstrap';

// Avatars
import avatarOne from '../images/avatars/1.jpg'
import avatarTwo from '../images/avatars/2.jpg'
import avatarThree from '../images/avatars/3.gif'
import avatarFour from '../images/avatars/4.jfif'
import avatarFive from '../images/avatars/5.png'
import avatarSix from '../images/avatars/6.png'

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
                        </Form>
                        <Button onClick={this.handleSubmitAttempt.bind(this)}>Submit changes</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default EditProfile;