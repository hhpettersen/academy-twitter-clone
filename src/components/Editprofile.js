import React from 'react';
import { Button, Card, Container, Row, Form, Nav, Col, Image, Accordion } from 'react-bootstrap';
import { IoIosArrowRoundBack } from "react-icons/io";

import { getUserDataById, updateUser, updateImage } from '../services/users'
import { getAvatarUrl, avatarAmount } from '../services/avatar';


class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: {},
        }
    }

    async componentDidMount() {
        const userData = await getUserDataById();
        this.setState({
            editForm: {
                handle: userData.handle,
                name: userData.name,
                avatar: userData.image,
                about: userData.about
            }
        })
    }


    handleBackClick () {
        const { handle } = this.state.editForm;
        const { history } = this.props;
        history.push(`/myprofile/${handle}`)
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

        const { name, handle, about } = this.state.editForm;

        await updateUser({ name, handle, about });
        history.push(`/myprofile/${handle}`);
    }

    logRadio(event) {
        console.log(event.target.value)
    }

    imageClick = async (id) => {
        await this.setState({ image: id })
        const { image } = await this.state;
        await updateImage({image})
        this.componentDidMount();
    }

    async handleMyPage(data) {
        const { history } = this.props;
        const userData = await getUserDataById();
        history.push(`/myprofile/${userData.handle}`);
    }

    render() {

        const { editForm, handle } = this.state;

        const avatarElements = avatarAmount().map((avatar, index) => {
            return (
                <Image key={index} src={`/avatars/${avatar}.png`} onClick={this.imageClick.bind(this, (index+1))}/>
            )
        })

        return (
            <Container>
                <Row>
                    <Col>
                        <Nav justify variant="tabs" defaultActiveKey="/myprofile">
                            <Nav.Item>
                                <Nav.Link href="/home">Home</Nav.Link>
                            </Nav.Item>
                            <Nav.Item style={{backgroundColor:"#24305E"}}>
                                <Nav.Link onClick={this.handleMyPage.bind(this, {handle})}>Profile</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-2">About</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <IoIosArrowRoundBack className="backArrow" onClick={this.handleBackClick.bind(this)}/>
                    
                        <Accordion className="text-center">
                            <Card>
                                <Card.Header>
                                <Card.Img variant="top" src={getAvatarUrl(editForm.avatar)} className="mx-auto d-block" style={{ height:"100px", width:"100px", borderRadius:"50px" }}/>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <Button variant="danger" className="pull-left">Change Avatar</Button>
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body className="avatars">
                                    {avatarElements}
                                </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>



                        <Form>
                                <h3 style={{marginTop:"1rem"}}>Edit profile</h3>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder={editForm.name}
                                onChange={this.handleInputChange.bind(this, "name")}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupHandle">
                                <Form.Label>Handle</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder={editForm.handle}
                                onChange={this.handleInputChange.bind(this, "handle")}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupAbout">
                                <Form.Label>About</Form.Label>
                                <Form.Control 
                                as="textarea"
                                rows="3"
                                placeholder={editForm.about}
                                defaultValue={editForm.about}
                                onChange={this.handleInputChange.bind(this, "about")}
                                />
                            </Form.Group>
                        </Form>
                        <Button variant="danger" onClick={this.handleSubmitAttempt.bind(this)}>Submit changes</Button>

                    </Col>
                </Row>
            </Container>
        );
    }
}

export default EditProfile;