import React from 'react';

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
        const { handle, password } = this.state.loginForm; // plukker ut at hva som ligger i login-skjema når knappen trykkes på
        console.log("handleLoginAttempt", handle, password)
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
            history.push('/'); //Redirecting to main-page

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
            <div>
                <h1>Login</h1>
                
                <form>
                    <div>
                        <label>
                            Handle:
                            <input 
                                type="text"
                                value={this.state.loginForm.handle}
                                onChange={this.handleInputChange.bind(this, 'handle')}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input 
                                type="password"
                                value={this.state.loginForm.password}
                                onChange={this.handleInputChange.bind(this, 'password')}
                            />
                        </label>
                    </div>
                    <div>
                        <button onClick={this.handleLoginAttempt.bind(this)}>Login</button>
                        <button onClick={this.handleSignup.bind(this)}>Sign up</button>
                    </div>
                    <div>
                        {isLoggingIn && <p>Logging in...</p>}
                        {error && <p>Unable to log in: {error.message}</p>}
                    </div>
                </form>
            </div>
        );
    }
}   

export default Login;