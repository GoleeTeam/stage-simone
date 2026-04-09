const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let tasks = []

function menu() {

  console.log("\nTODO LIST")
  console.log("1. Mostra tasks")
  console.log("2. Aggiungi task")
  console.log("3. Elimina task")
  console.log("4. Esci")

  rl.question("Scelta: ", (choice) => {

    if (choice == 1) showTasks()
    else if (choice == 2) addTask()
    else if (choice == 3) removeTask()
    else if (choice == 4) rl.close()
    else menu()

  })

}

function showTasks(){

  console.log("\nLista tasks:")
    
  if(tasks.length==0)
    console.log("non ci sono task!")
  else
    { 
        tasks.forEach((task, index) => {
        console.log(index + ": " + task)
      })
    }
  menu()
}

function addTask(){

  rl.question("Nuova task: ", (task) => {

    tasks.push(task.trim())

    console.log("Task aggiunta!")

    menu()

  })
}

function removeTask(){

  rl.question("Indice task da eliminare: ", (i) => {

    if(isNaN(index) || index < 0 || index >= tasks.length)
        console.log("la task non esiste!")
    else
    {
        tasks.splice(i,1)
        console.log("Task eliminata!")
    }
    menu()

  })
}

menu()