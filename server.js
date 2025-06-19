
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); //define que estamos usando json

const clientes = [];

app.get("/", (req, res) => {
    res.send("Hello World")
});

app.get("/cliente", (req, res) => {
    res.send(clientes)
});

app.get("/cliente/:id", (req, res) => {
    const id = req.params.id;
    const cliente = clientes.filter(cliente => cliente.id == id);
    res.send(cliente);
})

app.post("/cliente", (req, res) => {
   // const nome = req.body.nome;
   let cliente = req.body;
   cliente.id= clientes.length + 1;
   clientes.push(req.body);
   res.send("cliente cadastrado com sucesso!");
});

app.put("/cliente/:id", (req, res) => {
    const id = req.params.id;
    for(let i = 0; i < clientes.length; i++){
        if(clientes[i].id == id){
            let cliente = req.body;
            cliente.id = id;
            cliente[i] = cliente;
     }
    }
    res.send("cliente com ID " + "atualizado com sucesso");
});

app.listen(port, ()=> {

    console.log("Servidor rodando na porta https://localhost:3000/");
}); //ohhhh
