import React from 'react';
import avatar from '../images/avatars/male.png'

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

    render() {     
        return (
            <div>
                <button onClick={this.handleBackClick.bind(this)}>Back to profile</button>
                <div>
                    <h3>Edit profile</h3>
                </div>

                <div>
                    <label className="inputField" id="iconName">
                        <input 
                            value={this.state.editForm.name}
                            onChange={this.handleInputChange.bind(this, 'name')}
                            type="text" 
                         />
                    </label>
                    <label className="inputField" id="iconUsername">
                        <input 
                            value={this.state.editForm.handle}
                            onChange={this.handleInputChange.bind(this, 'handle')}
                            type="text" 
                         />
                         <div className="errorMessage">
                            </div>
                    </label>
                    <button onClick={this.handleSubmitAttempt.bind(this)}>Submit changes</button>
                </div>
                </div>
        );
    }
}

export default EditProfile;