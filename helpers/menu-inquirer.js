require("colors");
const inquirer = require("inquirer");

const questions = [
  {
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1".white}. Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2".white}. Historial`,
      },
      {
        value: 0,
        name: `${"0".white}. Salir`,
      },
    ],
  },
];

const menuInquirer = async () => {
  console.clear();
  console.log("========================================".green);
  console.log("         Seleccione una opción          ".green);
  console.log("========================================\n".green);

  const { opcion } = await inquirer.prompt(questions);
  return opcion;
};

const pausa = async () => {
  const questionsPausa = [
    {
      type: "input",
      name: "enter",
      message: `Presione ${"Enter".green} para continuar`,
    },
  ];

  console.log("\n");

  const { enter } = await inquirer.prompt(questionsPausa);
  return enter;
};

const leerInput = async (message) => {
  const questions = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(questions);
  return desc;
};

const listarLugares = async (lugares) => {
  const choices = lugares.map((lugar, indice) => {
    const idx = `${indice + 1}`.green;
    return {
      name: `${idx} - ${lugar.nombre}`,
      value: lugar.id,
    };
  });

  choices.unshift({
    value: "0",
    name: "0 -".green + " Cancelar",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Seleccione la ciudad",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

const menuConfirmacion = async (message) => {
  const questions = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(questions);
  return ok;
};

const menuEstadoTarea = async (tareas) => {
  const choices = tareas.map((tarea, indice) => {
    const idx = `${indice + 1}`.green;
    return {
      name: `${idx} - ${tarea.desc}`,
      value: tarea.id,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const questions = [
    {
      type: "checkbox",
      name: "ids",
      message: "Seleccione",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(questions);
  return ids;
};

module.exports = {
  menuInquirer,
  pausa,
  leerInput,
  listarLugares,
  menuConfirmacion,
  menuEstadoTarea,
};
