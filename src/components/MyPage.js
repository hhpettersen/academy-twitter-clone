import React from 'react';
import { getTweetsById } from '../services/tweets';

class MyPage extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        tweets: []
    }
}

async componentDidMount() {
    await this.populateTweets();
}

async populateTweets() {
    // const { id } = 1;
    const id = 1;
    const tweets = await getTweetsById(id);
    this.setState({ tweets });
}

    render() {
        const { tweets } = this.state;

        return (
            <div>{tweets}</div>
        );
    }
}

export default MyPage;