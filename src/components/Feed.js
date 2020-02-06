import React from 'react';
import jwtDecode from 'jwt-decode';
import { formatDistance } from 'date-fns'
import { Button, Card, Container, Row, Form, Nav, Col, Image } from 'react-bootstrap';

import { getTweets, postTweet } from '../services/tweets';
import { getAvatarUrl } from '../services/avatar';
import { getUserDataById } from '../services/users'



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
            name: '',
            handle: '',
        }
    }

    async componentDidMount() {
        await this.populateTweets();
        await this.getUserData();
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

    async getUserData() {
        const userData = await getUserDataById();
        this.setState({ 
            id: userData.id,
            name: userData.name,
            handle: userData.handle
        })
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

        await postTweet(message);
        await this.populateTweets();
    }

    handleMyPage(data) {
        const { history } = this.props;
        history.push(`/myprofile/${data.handle}`);
    }

    handleProfileClick(data) {
        const { history } = this.props;
        if (data.handle !== this.state.handle) {
            history.push(`/user/${data.handle}`);
        } else {
            history.push(`/myprofile/${data.handle}`);
        }
    }

    render() {
        const { 
            name, 
            handle,
            tweets,
            isLoading,
            error,
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
         .map(({ id, message, name, handle, user_id, image, created_at }) => {

             var date = formatDistance(new Date(created_at), new Date(), {
                addSuffix: true
              })

             return (
                <Card key={id} style={{ marginTop: '0.3rem' }}>
                    <Card.Header>
                        <Image
                        className="avatarSmallIcon"
                        onClick={this.handleProfileClick.bind(this, {handle})} 
                        src={getAvatarUrl(image)} 
                        roundedCircle style={{height:"50px"}}/>
                        {name} (@{handle}) {date}
                    </Card.Header>
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
                <Nav justify variant="tabs" defaultActiveKey="/">
                    <Nav.Item>
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={this.handleMyPage.bind(this, {handle})}>Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-2">About</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div style={{ backgroundImage: `url(require("src/bg.jpeg"))`}}>
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