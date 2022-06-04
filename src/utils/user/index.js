export const didUserLike = (arr, user) => {
    return arr.some(arrVal => user.username.toLowerCase() === arrVal)
}
