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

export function addUser(user) {
    return fetch(`${API_URL}/signup`, {
      method: 'POST',   
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((res) => res.json());
}

export function deleteTweetById(id) {
    return fetch(`${API_URL}/tweets`, {
        method: 'DELETE',
        body: JSON.stringify(id)
      })
      .then((res) => res.json());
}

export async function getTweetsByUserId () {
    const response = await fetch(`${API_URL}/myprofile`, {
        method: 'GET',
        headers : {
            'Content-type': 'application/json',
            'X-Auth-Token': localStorage.getItem('twitter_clone_token')
        }
    })
    return response.json();
}

export async function getUserData() {
    const response = await fetch(`${API_URL}/myprofile`, {
        method: 'GET',
        headers : {
            'Content-type': 'application/json',
            'X-Auth-Token': localStorage.getItem('twitter_clone_token')
        }
    })
    return await response.json();
}


