const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question("Inserisci un numero? ", (n) => {
  if(n%2==0)
    console.log("pari")
  else 
    console.log("dispari")
  rl.close()
})