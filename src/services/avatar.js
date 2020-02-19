// Function to get one image

export function getAvatarUrl(avatarId) {
    return `/avatars/${avatarId}.png`;
}

// Function to get all images

export function avatarAmount() {
    const amountImages = 6;

    let arr = [];
    for (var i = 1; i <= amountImages; i++) {
        arr.push(i);
    }
    return arr;
}
