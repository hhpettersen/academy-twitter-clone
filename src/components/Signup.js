import React from 'react';

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

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <label htmlFor="name">
                    Name
                    <input 
                        type="text" 
                        name="name" 
                        value={this.state.users.name} 
                        onChange={this.handleInputChange.bind(this, 'name')} 
                    />
                </label>
                <label htmlFor="handle">
                    Handle
                    <input 
                        type="text" 
                        name="handle"  
                        value={this.state.users.handle} 
                        onChange={this.handleInputChange.bind(this, 'handle')} 
                    />
                </label> 
                <label htmlFor="password">
                    Password
                    <input 
                        type="text" 
                        name="password"  
                        value={this.state.users.password} 
                        onChange={this.handleInputChange.bind(this, 'password')}
                    />
                </label>
                <button>Create user</button>
            </form>
        )   
    }
}

export default Signup;