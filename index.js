const ss58 = require('ss58')

let a = '5G3cjHVhBy67ytZeu6nvB7FW1T8YJvsMnREDXMT1avG3F84t'
console.log(ss58.ss58_encode(a))
console.log(ss58.ss58_decode(a))