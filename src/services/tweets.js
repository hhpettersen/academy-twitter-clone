const API_URL = '/api';

export function getTweets() {
    return fetch(`${API_URL}/tweets`)
    .then((res) => res.json());
}

export function postTweet(message) {
    return fetch(`${API_URL}/tweets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': localStorage.getItem('twitter_clone_token')
        },
        body: JSON.stringify({ message })
    })
    .then((res) => res.json());
}

export function getTweetsById(id) {
    return fetch(`${API_URL}/mypage/${id}`)
    .then((res) => res.json());
}

export async function deleteTweetById(data) {
    const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers : {
            'Content-type': 'application/json',
            'X-Auth-Token': localStorage.getItem('twitter_clone_token')
        },
        body: JSON.stringify({ data })
      })
      return await response.json();
}

export async function getTweetsByUserId () {
    const response = await fetch(`${API_URL}/userfeed`, {
        method: 'GET',
        headers : {
            'Content-type': 'application/json',
            'X-Auth-Token': localStorage.getItem('twitter_clone_token')
        }
    })
    return await response.json();
}