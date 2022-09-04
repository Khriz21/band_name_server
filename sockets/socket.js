const { io } = require("../index");
const Bands = require("../models/bands");
const Band = require("../models/band");

const bands = new Bands();

bands.addBand(new Band("Queen"));
bands.addBand(new Band("Kiss"));
bands.addBand(new Band("Rata blanca"));
bands.addBand(new Band("Bilma Palma"));
bands.addBand(new Band("Mago de Oz"));

io.on("connection", (client) => {
  console.log("Cliente conectado");

  client.emit("active-bands", bands.getBands());

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  client.on("message", (payload) => {
    console.log("Mensaje", payload.name);

    io.emit("message", { admin: "Nuevo mensaje" });
  });

  client.on("emit-message", (payload) => {
    // emite el mensaje a todos el mensaje, menos a quien lo emiotió
    client.broadcast.emit("new-message", payload);
  });

  client.on("vote-band", (payload)=>{
    bands.voteBand(payload.id);
    io.emit("active-bands", bands.getBands());
    //console.log(payload);
  });

  client.on("add-band", (payload)=>{
    bands.addBand(new Band(payload.name));
    io.emit("active-bands", bands.getBands());
    //console.log(payload);
  });

  client.on("delete-band", (payload)=>{

    bands.deleteBand(payload.id);
    io.emit("active-bands", bands.getBands());
    //console.log(payload);
  });
  
});
