const fs = require("fs");
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const FILE = "task.json";

let tasks = []

if (fs.existsSync(FILE)) {
  try {
    const data = fs.readFileSync(FILE, "utf8");
    tasks = JSON.parse(data);
  } catch (err) {
    console.log("Errore nel caricamento del file, creo un nuovo task.json");
    tasks = [];
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
  }
} else {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function saveTasks() {
    tasks.sort((a, b) => a.status - b.status);
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function showTasks() {
  console.log("\nTODO LIST:");

  if (tasks.length === 0) {
    console.log("Non ci sono task!");
  } else {
    tasks.forEach((task, index) => {
      const statusText = task.status === 0 ? "TO DO" :
                         task.status === 1 ? "IN PROGRESS" :
                         "FINISHED";
      console.log(`${index}: [${statusText}] ${task.nome}`);
    });
  }
  menu();
}

function showTasks() {
  printTask()
  menu();
}

function printTask()
{
    console.log("\nTODO LIST:");
    if (tasks.length === 0) {
    console.log("Non ci sono task!");
  } else {
    tasks.forEach((task, index) => {
      const statusText = task.status === 0 ? "TO DO" :
                         task.status === 1 ? "IN PROGRESS" :
                         "FINISHED";
      console.log(`${index}: ${task.nome} [${statusText}]`);
    });
  }
}

function addTask() {
  rl.question("Nome task: ", (nome) => {
    if (!nome.trim()) {
      console.log("Task vuota non valida!");
      return menu();
    }
    const task = { nome: nome.trim(), status: 0 };
    tasks.push(task);
    saveTasks();
    console.log("Task aggiunta!");
    menu();
  });
}

function removeTask() {
  printTask()
  rl.question("Indice task da eliminare: ", (i) => {
    const index = parseInt(i);
    if (isNaN(index) || index < 0 || index >= tasks.length) {
      console.log("Indice non valido!");
      removeTask()
    } else {
      const removed = tasks.splice(index, 1);
      saveTasks();
      console.log(`Task "${removed[0].nome}" eliminata!`);
    }
    menu();
  });
}

function updateStatus() {
    printTask()
  rl.question("Indice task da aggiornare: ", (i) => {
    const index = parseInt(i);
    if (isNaN(index) || index < 0 || index >= tasks.length) {
      console.log("Indice non valido!");
      return updateStatus();
    }


    console.log("Seleziona nuovo status per la task '" + tasks[index].nome + "':");
    console.log("0 = TO DO");
    console.log("1 = IN PROGRESS");
    console.log("2 = FINISHED");

    rl.question("Nuovo status: ", (s) => {
      const status = parseInt(s);
      if (![0,1,2].includes(status)) {
        console.log("Status non valido!");
      } else {
        tasks[index].status = status;
        saveTasks();
        console.log(`Task "${tasks[index].nome}" aggiornata!`);
      }
      menu();
    });
  });
}

function menu() {
  console.log("\nMENU:");
  console.log("1. Mostra task");
  console.log("2. Aggiungi task");
  console.log("3. Elimina task");
  console.log("4. Aggiorna status task");
  console.log("5. Esci");

  rl.question("Scelta: ", (choice) => {
    switch(choice) {
      case "1": showTasks(); break;
      case "2": addTask(); break;
      case "3": removeTask(); break;
      case "4": updateStatus(); break;
      case "5": rl.close(); break;
      default: menu(); break;
    }
  });
}

menu();

rl.on("close", () => {
  console.log("Arrivederci!");
  process.exit(0);
});