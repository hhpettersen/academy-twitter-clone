import React from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';

import { createSession } from '../services/session';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loginForm: {
                handle: '',
                password: '',
            },
            error: null,
            isLoggingIn: false
        }
    }

    handleInputChange(field, event) {
        this.setState({
            loginForm: {
                ...this.state.loginForm,
                [field]: event.target.value
            }
        });
    }

    async handleLoginAttempt(event) {
        event.preventDefault();
        const { history } = this.props;
        const { handle, password } = this.state.loginForm;
        try {
            this.setState({ isLoggingIn: true, error: null });

            const { token, error } = await createSession({ handle, password });

            if (error) {
                throw new Error(error);
            }

            if (!token) {
                throw new Error('No token received - try again');
            }

            localStorage.setItem('twitter_clone_token', token);
            history.push('/');

        } catch (error) {
            this.setState({ error, isLoggingIn: false })
        }
    }

    handleSignup() {
        const { history } = this.props;
        history.push('/signup');
    }

    render() {
        const { error, isLoggingIn } = this.state;

        return (
            <Container>
                <Row>
                    <Col>
                    <Card className="loginBox">
                        <Card.Header>Håkons Twitter-clone</Card.Header>
                        <Card.Body>
                        <Card.Title>Login</Card.Title>
                        <Form>
                            <Form.Group controlId="formGroupHandle">
                                <Form.Label>Handle</Form.Label>
                                <Form.Control 
                                type="text" 
                                onChange={this.handleInputChange.bind(this, "handle")}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                onChange={this.handleInputChange.bind(this, "password")}
                                />
                            </Form.Group>
                            <div>
                        {isLoggingIn && <p>Logging in...</p>}
                        {error && <p>Unable to log in: {error.message}</p>}
                    </div>
                        </Form>
                        <Button variant="danger" style={{marginRight:"5px"}} onClick={this.handleLoginAttempt.bind(this)}>Log in</Button>
                        <Button variant="danger" onClick={this.handleSignup.bind(this)}>Sign up</Button>
                        {/* <Card.Text>
                            Some quick example text to build on the card title and make up the bulk
                            of the card's content.
                        </Card.Text> */}
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}   

export default Login;