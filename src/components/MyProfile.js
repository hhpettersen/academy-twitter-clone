import React from 'react';
import avatar from '../images/avatars/male.png'
import { formatDistance } from 'date-fns'
import { Button, Card, Container, Row, Form, Nav, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getTweets, getTweetsByUserId, deleteTweetById } from '../services/tweets'
import { getUserData } from '../services/users'

class MyProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            handle: '',
            name: '',
            tweets: [],
        }
    }

    async componentDidMount () {
        await this.getUserData();
        await this.populateTweets();
    }

    async populateTweets() {
        const tweets = await getTweetsByUserId();
        this.setState({ tweets: tweets })
    }

    async getUserData() {
            const userData = await getUserData();
            this.setState({ 
                handle: userData.handle,
                name: userData.name
             })
    }

    handleBackClick () {
        const { history } = this.props;
        history.push('/home')
    }

    handleEditClick () {
        const { history } = this.props;
        history.push('/editprofile')
    }

    handleDeleteTweet = async (id) => {
        await deleteTweetById(id);
        this.componentDidMount();
    }

    render() {
        const { handle, name, tweets } = this.state;

        const tweetElements = tweets
        .map(({ id, message, created_at }) => {

            var date = formatDistance(new Date(created_at), new Date(), {
               addSuffix: true
             })

            return (
                <Card style={{ margin: '0.3rem' }}>
                    <Card.Header>{name} (@{handle}) {date}</Card.Header>
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
                            <Nav.Link href="/home">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/myprofile">Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="link-2">About</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Image src={avatar} roundedCircle className="rounded mx-auto d-block" style={{border: "1px solid black"}}/>
                    <Card className="text-center" style={{ width: 'auto', marginTop: "10px"}}>
                        {/* <Card.Img variant="top" src={avatar} style={{border: "1px solid grey", borderRadius:"50%", height:"250px", width:"250px"}}/> */}
                        <Card.Body>
                            <Card.Title>{name} (@{handle})</Card.Title>
                            <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                            </Card.Text>
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