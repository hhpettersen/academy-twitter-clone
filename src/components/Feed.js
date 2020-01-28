import React from 'react';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns'
import { Button, Card, Container, Row, Form, Nav, Col, Image } from 'react-bootstrap';

import avatarOne from '../images/avatars/1.jpg'
import avatarTwo from '../images/avatars/2.jpg'
import avatarThree from '../images/avatars/3.gif'
import avatarFour from '../images/avatars/4.jfif'
import avatarFive from '../images/avatars/5.png'
import avatarSix from '../images/avatars/6.png'

import { getTweets, postTweet } from '../services/tweets';

class Feed extends React.Component {
    constructor(props) {
        super(props);

        const token = localStorage.getItem('twitter_clone_token');
        const payload = jwtDecode(token);

        this.state = {
            tweets: [],
            isLoading: false,
            error: null,
            message: '',
            session: payload,
            id: '',
            avatarArray: [avatarOne, avatarTwo, avatarThree, avatarFour, avatarFive, avatarSix],
        }
    }

    async componentDidMount() {
        await this.populateTweets();
    }

    async populateTweets() {
        try {
            this.setState({ isLoading: true });
            const tweets = await getTweets();
            this.setState({ tweets, isLoading: false });
        } catch (error) {
            this.setState({ error });
        }
    }

    handleInputChange(field, event) {
        this.setState({
            [field]: event.target.value
        });
    }

    async handleSubmitTweet() {
        const { message } = this.state;

        if (!message) {
            return;
        }

        const newTweet = await postTweet(message);
        await this.populateTweets();
    }

    handleMyPage() {
        const { history } = this.props;
        history.push('/myprofile');
    }

    render() {
        const { 
            session : {
                name, 
                handle,
            } = {},
            tweets,
            isLoading,
            error,
            message,
            avatarArray
         } = this.state;

         if (error) {
             return (
                <div>Unable to fetch tweets: {error.message}</div>
             );
         }

         if (isLoading) {
             return (
                 <div>Loading tweets...</div>
             );
         }

         const tweetElements = tweets
         .map(({ id, message, name, handle, image, created_at,  }) => {

             var date = formatDistance(new Date(created_at), new Date(), {
                addSuffix: true
              })

             return (
                <Card key={id} style={{ marginTop: '0.3rem' }}>
                    <Card.Header><Image src={avatarArray[image]} style={{height:"50px"}}/>{name} (@{handle}) {date} </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {message}
                        </Card.Text>
                    </Card.Body>
                </Card>
             );
         })

        return (
            <Container>
                <Row>
                    <Col>
                <Nav justify variant="tabs" defaultActiveKey="/home">
                    <Nav.Item>
                        <Nav.Link href="/home">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={this.handleMyPage.bind(this)}>Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-2">About</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div>
                    <h1>Feed for {name} (@{handle})</h1>
                <div>
                    <Form.Group 
                        controlId="exampleForm.ControlTextarea1"
                        value="{message}"
                        onChange={this.handleInputChange.bind(this, 'message')}
                    >
                        <Form.Control as="textarea" rows="3" placeholder="Compose your tweet here..."/>
                    </Form.Group>
                    <Button onClick={this.handleSubmitTweet.bind(this)}>Tweet</Button>
                </div>
                <div>{tweetElements}</div>
            </div>
            </Col>
            </Row>
            </Container>
        );
    }
}

export default Feed;