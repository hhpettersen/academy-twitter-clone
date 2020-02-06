import React from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

import { addUser } from '../services/users';
import { createSession } from '../services/session'

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users : {
                name: '',
                handle: '',
                password: '',
                passwordTwo: '',
            },
            passwordError: null,
            handleError: null,
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { history } = this.props;
        const { handle, password, passwordTwo } = this.state.users;

        if (password !== passwordTwo) {
            this.setState({ passwordError: "Passwords does not match, please try again."})
        } else {
            this.setState({ passwordError: null})
            const newUser = await addUser(this.state.users)
            if (newUser.status === 403) {
                this.setState({ handleError: newUser.message})
            } else {
                    const { token, error } = await createSession({ handle, password });
        
                    if (error) {
                        throw new Error(error);
                    }
        
                    if (!token) {
                        throw new Error('No token received - try again');
                    }
        
                    localStorage.setItem('twitter_clone_token', token);
                    history.push('/');
            }
        }
    }

    handleInputChange(field, event) {
        this.setState({
            users: {
                ...this.state.users,
                [field]: event.target.value
            }
        });
    }

    handleBackClick() {
        const { history } = this.props;
        history.push('/login')
    }

    render() {
        const { passwordError, handleError } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                    <h1>Sign up</h1>
                    <Button onClick={this.handleBackClick.bind(this)}>Back to log in</Button>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                type="text" 
                                onChange={this.handleInputChange.bind(this, "name")}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupHandle">
                                <Form.Label>Handle</Form.Label>
                                <Form.Control 
                                type="text" 
                                onChange={this.handleInputChange.bind(this, "handle")}
                                />
                            </Form.Group>
                            {handleError && <p>{handleError}</p>}
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                onChange={this.handleInputChange.bind(this, "password")}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupPasswordTwo">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                onChange={this.handleInputChange.bind(this, "passwordTwo")}
                                />
                            </Form.Group>
                                {passwordError && <p>{passwordError}</p>}
                        </Form>
                        <Button onClick={this.handleSubmit.bind(this)}>Sumbit</Button>
                    </Col>
                </Row>
            </Container>
        )   
    }
}

export default Signup;