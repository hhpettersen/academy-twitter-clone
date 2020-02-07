import React from 'react';
import { formatDistance } from 'date-fns'
import { Button, Card, Container, Row, Nav, Col, Image } from 'react-bootstrap';
import { IoIosArrowRoundBack } from "react-icons/io";

import { getTweetsByUserId, deleteTweetById } from '../services/tweets'
import { getUserDataByHandle, addFollower, removeFollower, checkIfFollow, getUserDataById } from '../services/users'
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
            tweets: [],
            checkFollow: null,
            followInfo: {
                followers: 0,
                following: 0,
            }
        }
    }

    async componentDidMount () {
        await this.getUserData();
        await this.checkFollow();
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
        const data = await getUserDataByHandle({ handle });
        this.setState({ 
            name: data.userData.name,
            avatar: data.userData.image,
            about: data.userData.about,
            id: data.userData.id,
            followInfo: {
                followers: data.userData.followers.length,
                following: data.userData.following.length,
            }
        })
    }

    handleBackClick () {
        const { history } = this.props;
        history.push('/')
    }

    handleDeleteTweet = async (id) => {
        await deleteTweetById(id);
        this.componentDidMount();
    }

    async handleAddFollowerClick(follow_id) {
        await addFollower( follow_id.id )
        await this.checkFollow()
        this.componentDidMount()
    }

    async handleRemoveFollowerClick(follow_id) {
        await removeFollower( follow_id.id )
        await this.checkFollow()
        this.componentDidMount()
    }

    async checkFollow() {
        const follow_id = this.state.id;
        const value = await checkIfFollow( follow_id )
        this.setState({
            checkFollow: parseInt(value.count)
        })
    }

    async handleMyPage(data) {
        const { history } = this.props;
        const userData = await getUserDataById();
        history.push(`/myprofile/${userData.handle}`);
    }

    render() {
        const { handle, name, about, tweets, avatar, id, followInfo } = this.state;

        const tweetElements = tweets
        .map(({ id, message, created_at }) => {

            var date = formatDistance(new Date(created_at), new Date(), {
               addSuffix: true
             })

            return (
                <Card className="tweetBox" key={id}>
                    <Card.Header>
                        <Image src={getAvatarUrl(this.state.avatar)} roundedCircle style={{height:"50px"}}/>
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

                    <IoIosArrowRoundBack className="backArrow" onClick={this.handleBackClick.bind(this)}/>
                    <Card className="text-center profileCard" style={{ width: 'auto', marginTop: "10px"}}>
                    <Card.Header>
                    <Card.Img variant="top" src={getAvatarUrl(avatar)} className="mx-auto d-block" style={{ height:"100px", width:"100px" }}/>
                    </Card.Header>
                        <Card.Body>
                            <Card.Title style={{fontSize:"1.5rem"}}>{name} (@{handle})</Card.Title>
                            <Card.Text style={{fontSize:"0.7rem"}}>following: {followInfo.following} | followers: {followInfo.followers}</Card.Text>
                            <hr style={{backgroundColor:"white"}}></hr>
                            <Card.Text>{about}</Card.Text>

                            {
                                !this.state.checkFollow? (
                                    <Button variant="danger" onClick={this.handleAddFollowerClick.bind(this, {id})}>Follow</Button>
                                )  : (
                                    <Button variant="danger" onClick={this.handleRemoveFollowerClick.bind(this, {id})}>Unfollow</Button>
                                )
                            }

                        </Card.Body>
                    </Card>
                    
                    <div>
                        <div>{tweetElements}</div>
                    </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default OthersProfile;