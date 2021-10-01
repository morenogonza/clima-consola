require("dotenv").config();

const {
  menuInquirer,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/menu-inquirer");
const Busquedas = require("./models/busqueda");

const main = async () => {
  let opt;
  const busquedas = new Busquedas();
  do {
    opt = await menuInquirer();

    switch (opt) {
      case 1:
        //   mostrar mensaje
        const lugar = await leerInput("Ciudad:");

        // buscar lugares
        const lugares = await busquedas.ciudades(lugar);

        // seleccionar ciudad
        const id = await listarLugares(lugares);
        if (id === "0") continue;

        const lugarSeleccionado = lugares.find((l) => l.id === id);

        busquedas.agregarHistorial(lugarSeleccionado.nombre);

        // clima
        const datosTiempo = await busquedas.obtenerTiempo(
          lugarSeleccionado.lat,
          lugarSeleccionado.lng
        );

        // mostrar resultados
        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", lugarSeleccionado.nombre);
        console.log("Latitud:", lugarSeleccionado.lat);
        console.log("Longitud:", lugarSeleccionado.lng);
        console.log("Temperatura:", datosTiempo.temperatura);
        console.log("Minima:", datosTiempo.min);
        console.log("Maxima:", datosTiempo.max);
        console.log("Como está el tiempo:", datosTiempo.descripcion.yellow);
        break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
