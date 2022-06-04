export const parseMedia = (post) => {
    const regex = /(https?:\/\/[^ ]*\.(?:gif|png|jpg|jpeg))/ig
    const arr = [...post.matchAll(regex)]
    const media = []
    for (const item of arr) {
        media.push(item[0])
    }
    if (media.length > 0) {
        media[0].split('/n')
    }
    return media
}