import React from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

import { addUser } from '../services/users';

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users : {
                name: '',
                handle: '',
                password: '',
            }
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        await addUser(this.state.users)
        const { history } = this.props;
        history.push('/');
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
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                onChange={this.handleInputChange.bind(this, "password")}
                                />
                            </Form.Group>
                            {/* <Form.Group controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                onChange={this.handleInputChange.bind(this, "password")}
                                />
                            </Form.Group> */}
                        </Form>
                        <Button onClick={this.handleSubmit.bind(this)}>Sumbit</Button>
                    </Col>
                </Row>
            </Container>

            // <form onSubmit={this.handleSubmit.bind(this)}>
            //     <label htmlFor="name">
            //         Name
            //         <input 
            //             type="text" 
            //             name="name" 
            //             value={this.state.users.name} 
            //             onChange={this.handleInputChange.bind(this, 'name')} 
            //         />
            //     </label>
            //     <label htmlFor="handle">
            //         Handle
            //         <input 
            //             type="text" 
            //             name="handle"  
            //             value={this.state.users.handle} 
            //             onChange={this.handleInputChange.bind(this, 'handle')} 
            //         />
            //     </label> 
            //     <label htmlFor="password">
            //         Password
            //         <input 
            //             type="text" 
            //             name="password"  
            //             value={this.state.users.password} 
            //             onChange={this.handleInputChange.bind(this, 'password')}
            //         />
            //     </label>
            //     <button>Create user</button>
            // </form>
        )   
    }
}

export default Signup;