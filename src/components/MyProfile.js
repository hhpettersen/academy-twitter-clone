import React from 'react';
import { getTweets, getUserData, getTweetsByUserId } from '../services/tweets'

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

    render() {
        const { handle, name, tweets } = this.state;

        const tweetElements = tweets
        .map(({ message }) => {
            const styles =  {
               border: '1px solid black',
               padding: 10,
               margin: 10
            };

            // var date = formatDistance(new Date(created_at), new Date(), {
            //    addSuffix: true
            //  })

            return (
                <div style={styles} className='tweetBox'>
                    <p className='handleText'>{name} (@{handle})</p>
                    <p>{message}</p>
                </div>
            );
        })

        return (
            <div>
                <p>{handle}</p>
                <p>{name}</p>
                <div>{tweetElements}</div>
            </div>
        );
    }
}

export default MyProfile;