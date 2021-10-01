const fs = require("fs");
const axios = require("axios");
const { leerInput } = require("../helpers/menu-inquirer");

class Busquedas {
  historial = [];
  dbPath = "./db/datos.json";

  constructor() {
    this.leerEnBD();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      return palabras.map((p) => p[0].toUpperCase() + p.substring(1)).join(" ");
    });
  }

  get mapboxParams() {
    return {
      access_token: process.env.MAPBOX_TOKEN,
      limit: 5,
      language: "es",
    };
  }

  get weatherParams() {
    return {
      appid: process.env.OPENWEATHER_TOKEN,
      units: "metric",
      lang: "es",
    };
  }

  async ciudades(lugar = "") {
    const instance = axios.create({
      baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
      params: this.mapboxParams,
    });

    try {
      const resp = await instance.get();
      return resp.data.features.map((ciudad) => ({
        id: ciudad.id,
        nombre: ciudad.place_name,
        lng: ciudad.center[0],
        lat: ciudad.center[1],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async obtenerTiempo(lat, lon) {
    const instance = axios.create({
      baseURL: `https://api.openweathermap.org/data/2.5/weather`,
      params: { ...this.weatherParams, lat, lon }, // se desestructura el objeto recibido desde weatherParams y se le agrega lon y lat
    });

    try {
      const resp = await instance.get();
      const datos = resp.data.main;
      // return datos;
      return {
        temperatura: datos.temp,
        min: datos.temp_min,
        max: datos.temp_max,
        descripcion: resp.data.weather[0].description,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar) {
    // prevenir duplicados
    if (this.historial.includes(lugar.toLowerCase())) return;

    this.historial = this.historial.splice(0, 5);
    this.historial.unshift(lugar.toLowerCase());

    // grabar en BD
    this.grabarEnBD();
  }

  grabarEnBD() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.historial));
  }

  leerEnBD() {
    if (!fs.readFileSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data;
  }
}

module.exports = Busquedas;
