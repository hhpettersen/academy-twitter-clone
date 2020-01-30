import React from 'react';
import { formatDistance } from 'date-fns'
import { Button, Card, Container, Row, Nav, Col, Image, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Avatars
import avatarOne from '../images/avatars/1.jpg'
import avatarTwo from '../images/avatars/2.jpg'
import avatarThree from '../images/avatars/3.gif'
import avatarFour from '../images/avatars/4.jfif'
import avatarFive from '../images/avatars/5.png'
import avatarSix from '../images/avatars/6.png'

import { getTweetsByUserId, deleteTweetById } from '../services/tweets'
import { getUserData, updateImage } from '../services/users'

class MyProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            handle: '',
            name: '',
            avatar: '',
            image: null,
            imageError: null,
            tweets: [],
            avatarArray: [avatarOne, avatarTwo, avatarThree, avatarFour, avatarFive, avatarSix],
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
                name: userData.name,
                avatar: userData.image,
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

    imageClick = async (id) => {
        this.setState({ image: id })
        const { image } = await this.state;
        await updateImage({image})
        this.componentDidMount();
    }

    render() {
        const { handle, name, tweets, avatarArray, changeClick } = this.state;

        const avatarElements = avatarArray
        .map((avatar, index) => {
            return (
                <Image src={avatar} onClick={this.imageClick.bind(this, (index))}/>
            )
        })

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

                    <Image src={avatarArray[this.state.avatar]} roundedCircle className="rounded mx-auto d-block" style={{ height:"100px" }}/>
                    
                    <Accordion className="text-center">
                        <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                <Button>Change Avatar</Button>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body className="avatars">
                                {avatarElements}
                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>

                    <Card className="text-center" style={{ width: 'auto', marginTop: "10px"}}>
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