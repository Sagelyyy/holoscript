export const doesUserExist = (arr, user) => {
    return arr.some(arrVal => user.username.toLowerCase() === arrVal)
}
