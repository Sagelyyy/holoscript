import { parseMedia } from ".";

const post = 'Check out this cool pic! https://media.giphy.com/media/EBjcsY3cmeyIHQaqSZ/giphy.gif'
const post2 = 'These are cool pics too! https://coolpic1.jpg /n http://coolpic2.png'

it('should return the matched image(s) in an array', () => {
    expect(parseMedia(post)).toStrictEqual(['https://media.giphy.com/media/EBjcsY3cmeyIHQaqSZ/giphy.gif'])
    expect(parseMedia(post2)).toStrictEqual([ 'https://coolpic1.jpg', 'http://coolpic2.png' ])
})