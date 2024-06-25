const md5 = require('md5')
console.log('md5', md5(md5('12345678')))
console.log('550e1bafe077ff0b0b67f4e32f29d751' === md5(md5('12345678')))

// console.log(1719295521048 - 1719295371694)