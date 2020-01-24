import React from 'react';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns'

import { getTweets, postTweet, deleteTweetById } from '../services/tweets';

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
         .map(({ id, message, name, handle, created_at }) => {
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
                 </div>
             );
         })

        return (
            <div>
                <h1>Feed for {name} (@{handle})</h1>
                <button onClick={this.handleMyPage.bind(this)}>My page</button>
                <div>
                    <textarea
                        value={message} 
                        onChange={this.handleInputChange.bind(this, 'message')}
                    />
                    <button onClick={this.handleSubmitTweet.bind(this)}>Tweet</button>
                </div>
                <div>
                    <Link to='/logout'>Log out</Link>
                </div>
                <div>{tweetElements}</div>
            </div>
        );
    }
}

export default Feed;