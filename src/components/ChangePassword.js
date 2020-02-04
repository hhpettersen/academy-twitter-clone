// import React from 'react';
// import { updatePassword } from '../services/session';
// const { passwordTest } = require('../services/RegExp')

// class changePassword extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             editForm: {},
//             error: null,
//             passwordError: null,
//         }
//     }

//     async componentDidMount() {
//         this.setState({ 
//             editForm: {
//                 password: "",
//                 newPassword: "",
//                 confirmPassword: ""
//             }
//         });
//     }

//     handleInputChange(field, event) {
//         this.setState({
//             editForm: {
//                 ...this.state.editForm,
//                 [field]: event.target.value,
//             }
//         })
//     }

//     async handleSubmitAttempt(event) {
//         event.preventDefault();
//         const { history } = this.props;
//         const { password, newPassword, confirmPassword } = this.state.editForm;

//         if (confirmPassword !== newPassword) {
//             this.setState({ passwordError: "Nytt passord matcher ikke!"})
//         } else if (confirmPassword && !passwordTest(newPassword)) {
//             this.setState({ passwordError: "Passordet ikke gyldig. Minimum 8 tegn, minst en bokstav og et tall påkrevd" })
//         } else {
//             try {
//                 this.setState({ isLoading: true });
//                 const editedUser = await updatePassword({ password, newPassword });
//                 if (editedUser.status === 401) {
//                     this.setState({ error: editedUser.message })
//                 } else {
//                     history.replace('/editprofile');
//                 }
//             } catch (error) {
//                 this.setState({ error })
//             }
//         }
//     }

//     handleBackProfile() {
//         const { history } = this.props;
//         history.push('/editprofile');
//     }

//     handleHomeClicked() {
//         const { history } = this.props;
//         history.push(`/home`);
//     }

//     handleProfileClicked() {
//         const { history } = this.props;
//         history.push(`/editprofile`);
//     }

//     handleSupportClicked() {
//         const { history } = this.props;
//         history.push(`/support`);
//     }

//     render() {
//         const { error, passwordError } = this.state

//         return (
//             <div className="edit-profile">
//                 <div className="arrowLeftHistory">
//                     <svg onClick={this.handleBackProfile.bind(this)} version="1.1"
//                     viewBox="0 0 31.494 31.494">
//                     <path style={{fill: "#127334", stroke: "#0d5526", strokeWidth:"2px"}} d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554
//                     c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587
//                     c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/>
//                     </svg>
//                 </div>

//                 <div className="sub-header-edit">
//                     <h3>Endre passord</h3>
//                 </div>

//         <div className="edit-form">
//             <label className="inputField" id="iconPassword">
//                 <input 
//                     value={this.state.editForm.password}
//                     onChange={this.handleInputChange.bind(this, 'password')}
//                     type="password" 
//                     placeholder="Gammelt passord (påkrevd)"
//                     />
//                 <div className="errorMessage">
//                     {error && <p>{error}</p>}
//                 </div>     
//             </label>
//             <label className="inputField" id="iconPassword">
//                 <input 
//                     value={this.state.editForm.newPassword}
//                     onChange={this.handleInputChange.bind(this, 'newPassword')}
//                     type="password" 
//                     placeholder="Nytt passord (ikke påkrevd)"
//                     /> 
//             </label>
//             <label className="inputField" id="iconPassword">
//                 <input 
//                     value={this.state.editForm.confirmPassword}
//                     onChange={this.handleInputChange.bind(this, 'confirmPassword')}
//                     type="password" 
//                     placeholder="Bekreft nytt passord"
//                     />
//                 <div className="errorMessage">
//                     {passwordError && <p>{passwordError}</p>}
//                 </div>     
//             </label>
//             </div>

//             <div className="submit-button-password" >
//             <button className="save-button" onClick={this.handleSubmitAttempt.bind(this)}>Lagre</button>
//             </div>

//         <footer className="nav-bar-edit">
//                     <div className="homeIcon" >
//                         <svg onClick={this.handleHomeClicked.bind(this)} fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px" >
//                         <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 
//                         L 12 2.0996094 z"/>
//                         </svg>
//                     </div>
//                     <div className="profileIcon">
//                         <svg onClick={this.handleProfileClicked.bind(this)} id="Capa_1"  enable-background="new 0 0 515.556 515.556" height="23" style={{borderBottom: "2px solid white", paddingBottom: "5px"}} viewBox="0 0 515.556 515.556" width="30" xmlns="http://www.w3.org/2000/svg"><path d="m348.918 37.751c50.334 50.334 50.334 131.942 0 182.276s-131.942 50.334-182.276 0-50.334-131.942 0-182.276c50.334-50.335 131.942-50.335 182.276 0"/><path d="m455.486 350.669c-117.498-79.391-277.917-79.391-395.415 0-17.433 11.769-27.848 31.656-27.848 53.211v111.676h451.111v-111.676c0-21.555-10.416-41.442-27.848-53.211z"/></svg>
//                     </div>
//                     <div className="infoIcon">
//                     <svg fill="#FFFFFF" onClick={this.handleSupportClicked.bind(this)}  width="24" height="24"><path d="M24 14v-4c-1.619 0-2.906.267-3.705-1.476-.697-1.663.604-2.596 1.604-3.596l-2.829-2.828c-1.033 1.033-1.908 2.307-3.666 1.575-1.674-.686-1.404-2.334-1.404-3.675h-4c0 1.312.278 2.985-1.404 3.675-1.761.733-2.646-.553-3.667-1.574l-2.829 2.828c1.033 1.033 2.308 1.909 1.575 3.667-.348.849-1.176 1.404-2.094 1.404h-1.581v4c1.471 0 2.973-.281 3.704 1.475.698 1.661-.604 2.596-1.604 3.596l2.829 2.829c1-1 1.943-2.282 3.667-1.575 1.673.687 1.404 2.332 1.404 3.675h4c0-1.244-.276-2.967 1.475-3.704 1.645-.692 2.586.595 3.596 1.604l2.828-2.829c-1-1-2.301-1.933-1.604-3.595l.03-.072c.687-1.673 2.332-1.404 3.675-1.404zm-12 2c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
//                     </div>  
//                 </footer>
//             </div>




//         )
//     }    
// }

// export default changePassword;