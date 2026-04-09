const {readFile, readFileSync} = require('fs');
const txt = readFileSync('./sas.txt','utf8');

readFile('./sas.txt','utf8', (err,txt)=>{
    console.log(txt)
});

console.log("eeeee");