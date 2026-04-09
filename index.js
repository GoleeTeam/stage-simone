const {readFile, readFileSync} = require('fs');
const txt = readFileSync('./sas.txt','utf8');

console.log(txt);