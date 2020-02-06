import React from 'react';
import { formatDistance } from 'date-fns'
import { Button, Card, Container, Row, Nav, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getTweetsByUserId, deleteTweetById } from '../services/tweets'
import { getUserDataByHandle, getUserDataById } from '../services/users'
import { getAvatarUrl } from '../services/avatar';

class MyProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            handle: '',
            name: '',
            id: '',
            avatar: '',
            about: '',
            image: null,
            tweets: [],
            follow: {
                followers: 0,
                following: 0,
            }
        }
    }

    async componentDidMount () {
        await this.getUserData();
        await this.populateTweets();
    }

    async populateTweets() {
        const { id } = this.state;
        const tweets = await getTweetsByUserId({id});
        this.setState({ tweets: tweets })
    }

    async getUserData() {
        await this.setState({
            handle: this.props.match.params.handle
        })
        const { handle } = this.state;
        const data = await getUserDataByHandle({ handle });
        this.setState({ 
            handle: data.userData.handle,
            name: data.userData.name,
            avatar: data.userData.image,
            about: data.userData.about,
            id: data.userData.id,
            follow: {
                followers: data.userData.followers.length,
                following: data.userData.following.length
            }
        })
    }

    handleBackClick () {
        const { history } = this.props;
        history.push('/')
    }

    handleEditClick () {
        const { handle } = this.state;
        const { history } = this.props;
        history.push(`/editprofile/${handle}`)
    }

    handleDeleteTweet = async (id) => {
        await deleteTweetById(id);
        this.componentDidMount();
    }

    async handleMyPage(data) {
        const { history } = this.props;
        const userData = await getUserDataById();
        history.push(`/myprofile/${userData.handle}`);
    }


    render() {
        const { handle, name, about, tweets, avatar, follow } = this.state;

        const tweetElements = tweets
        .map(({ id, message, created_at }) => {

            var date = formatDistance(new Date(created_at), new Date(), {
               addSuffix: true
             })

            return (
                <Card key={id} style={{ margin: '0.3rem' }}>
                    <Card.Header>
                        <Image src={getAvatarUrl(this.state.avatar)} roundedCircle style={{height:"50px"}}/>
                        {name} (@{handle}) {date}
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {message}
                        </Card.Text>
                        <Button onClick={this.handleDeleteTweet.bind(this, {id})}>Delete tweet</Button>
                    </Card.Body>
                </Card>
            );
        })

        return (
            <Container>
                <Row>
                    <Col>
                    <Nav justify variant="tabs" defaultActiveKey="/myprofile">
                        <Nav.Item>
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="myprofile" onClick={this.handleMyPage.bind(this, {handle})}>Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="link-2">About</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Button onClick={this.handleBackClick.bind(this)}>Back to feed</Button>

                    <Image src={getAvatarUrl(avatar)} roundedCircle className="rounded mx-auto d-block" style={{ height:"100px" }}/>

                    <Card className="text-center" style={{ width: 'auto', marginTop: "10px"}}>
                        <Card.Body>
                            <Card.Title>{name} (@{handle})</Card.Title>
                            <Card.Text>following: {follow.following} | followers: {follow.followers}</Card.Text>
                            <Card.Text>{about}</Card.Text>
                            <Button variant="primary" onClick={this.handleEditClick.bind(this)} style={{margin: "5px"}}>Edit profile</Button>
                            <Button variant="primary" style={{margin: "5px"}}><Link to="/logout" style={{color: "white", textDecoration: "none"}}>Log out</Link></Button>
                        </Card.Body>
                    </Card>
                    

                    <div>
                        <h1>My tweets</h1>
                        <div>{tweetElements}</div>
                    </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default MyProfile;