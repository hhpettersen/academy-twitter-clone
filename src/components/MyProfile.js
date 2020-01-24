import React from 'react';
import avatar from '../images/avatars/male.png'
import { formatDistance } from 'date-fns'

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
    }

    render() {
        const { handle, name, tweets } = this.state;

        const tweetElements = tweets
        .map(({ id, message, created_at }) => {
            const styles =  {
               border: '1px solid black',
               padding: 10,
               margin: 10
            };

            var date = formatDistance(new Date(created_at), new Date(), {
               addSuffix: true
             })

            return (
                <div key={id} style={styles} className='tweetBox'>
                    <p className='handleText'>{name} (@{handle}) {date}</p>
                    <p>{message}</p>
                    <button onClick={this.handleDeleteTweet.bind(this, {id})}>Delete tweet</button>
                </div>
            );
        })

        return (
            <div>
                <button onClick={this.handleBackClick.bind(this)}>Back</button>
                <p>{handle}</p>
                <p>{name}</p>
                <img src={avatar} alt="alt"/>
                <button onClick={this.handleEditClick.bind(this)}>Edit profile</button>
                <div>{tweetElements}</div>
            </div>
        );
    }
}

export default MyProfile;