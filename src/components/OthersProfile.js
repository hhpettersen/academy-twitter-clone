import React from 'react';
import { formatDistance } from 'date-fns'
import { Button, Card, Container, Row, Nav, Col, Image, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getTweetsByUserId, deleteTweetById } from '../services/tweets'
import { getUserDataByHandle, addFollower, removeFollower } from '../services/users'
import { getAvatarUrl } from '../services/avatar';

class OthersProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            handle: '',
            name: '',
            id: '',
            avatar: '',
            about: '',
            image: null,
            imageError: null,
            tweets: []
        }
    }

    async componentDidMount () {
        await this.getUserData();
        await this.populateTweets();
    }

    async populateTweets() {
        const { id } = this.state;
        const tweets = await getTweetsByUserId({ id });
        this.setState({ tweets: tweets })
    }

    async getUserData() {
        await this.setState({
            handle: this.props.match.params.handle
        })
        const { handle } = this.state;
        const userData = await getUserDataByHandle({ handle });
        this.setState({ 
            name: userData.name,
            avatar: userData.image,
            about: userData.about,
            id: userData.id,
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

    async handleAddFollowerClick(follow_id) {
        await addFollower({ follow_id })
    }

    async handleRemoveFollowerClick(follow_id) {
        await addFollower({ follow_id })
    }

    render() {
        const { handle, name, about, tweets, avatar, id } = this.state;

        const tweetElements = tweets
        .map(({ id, message, created_at }) => {

            var date = formatDistance(new Date(created_at), new Date(), {
               addSuffix: true
             })

            return (
                <Card key={id} style={{ margin: '0.3rem' }}>
                    <Card.Header>{name} (@{handle}) {date}</Card.Header>
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
                            <Nav.Link href="/myprofile">Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="link-2">About</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Image src={getAvatarUrl(avatar)} roundedCircle className="rounded mx-auto d-block" style={{ height:"100px" }}/>

                    <Card className="text-center" style={{ width: 'auto', marginTop: "10px"}}>
                        <Card.Body>
                            <Card.Title>{name} (@{handle})</Card.Title>
                            <Card.Text>{about}</Card.Text>
                            <Button onClick={this.handleAddFollowerClick.bind(this, {id})}>Follow</Button>
                        </Card.Body>
                    </Card>
                    

                    <div>
                        <h1>Tweets</h1>
                        <div>{tweetElements}</div>
                    </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default OthersProfile;