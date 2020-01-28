const API_URL = '/api';

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

export async function updateUser({ name, handle }) {
    const response = await fetch(`${API_URL}/editprofile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': localStorage.getItem('twitter_clone_token')
      },
      body: JSON.stringify({ name, handle })
    })
    return response.json();
}

export async function updateImage({ image }) {
  const response = await fetch(`${API_URL}/editimage`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': localStorage.getItem('twitter_clone_token')
    },
    body: JSON.stringify({ image })
  })
  return response.json();
}

