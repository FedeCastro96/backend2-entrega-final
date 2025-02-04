import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://fedecastro96:coderhouse@cluster0.lbre4.mongodb.net/MongoAvanzado2?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexión exitosa"))
  .catch((error) => console.log("Vamos a morir, tenemos un error:", error));
