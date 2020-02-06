// Function to get one image

export function getAvatarUrl(avatarId) {
    return `/avatars/${avatarId}.png`;
}

// Function to get all images

// const avatarElements = [1,2].map((avatar, index) => {
//     return (
//         <Image key={index} src={`/avatars/${avatar}.png`} onClick={this.imageClick.bind(this, (index))}/>
//     )
// })

export function avatarAmount() {
    const amountImages = 6;

    let arr = [];
    for (var i = 1; i <= amountImages; i++) {
        arr.push(i);
    }
    return arr;
}
