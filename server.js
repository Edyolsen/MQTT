const express = require('express');
const bodyParser = require('body-parser');
const aedes = require('aedes')();
const cors = require('cors');

const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mqttServer = require('net').createServer(aedes.handle);
const mqttPort = 1883;

mqttServer.listen(mqttPort, () => {
    console.log(`MQTT server is running on port ${mqttPort}`);
});

aedes.on('client', (client) => {
    console.log("New client connected: ", client)
});

aedes.on('clientDisconnect', (client) => {
    console.log("Client disconnected: ", client);
})

//aedes.on('publish', (packet, client) => {
//   console.log(`Mensagem recebida pelo cliente ${client} - Tópico: ${packet.topic} => ${packet.payload.toString()}`)
//});

aedes.on('publish', async function (packet, client) {
    console.log('Client \x1b[31m' + (client ? client.id : 'BROCKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to brocker', aedes.id)
})



//app.use(cors());

app.get('/', (req, res) => {
    res.send({ message: "API MQTT RODANDO" });
});

app.post('/echo', (req, res) => {
    const { email, senha } = req.body
    console.log(email);
    console.log(senha);

    res.send(req.body);
});

app.post('/send', (req, res) => {
    try {
        const mensagem = req.body.mensagem;
        aedes.publish({ topic: 'esp32/data', payload: mensagem });
        res.status(200).send({ message: 'Message published' });
    } catch (error) {

    }

})


app.listen(port, () => {
    console.log("Servidor rodando na porta " + port);

})

