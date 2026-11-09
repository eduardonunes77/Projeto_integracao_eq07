const express = require('express');
const cors = require('cors');
const loki = require('lokijs');

const app = express();
app.use(cors());
app.use(express.json());

// Cria um banco de dados em arquivo simples que não dá erro no Linux
const db = new loki('banco.db', {
    autosave: true,
    autosaveInterval: 4000,
    autoload: true,
    autoloadCallback: databaseInitialize
});

let enquete;

function databaseInitialize() {
    enquete = db.getCollection('enquete');
    if (enquete === null) {
        enquete = db.addCollection('enquete');
        // Inicializa com as opções zeradas
        enquete.insert({ categoria: 'racismo', votos: 0 });
        enquete.insert({ categoria: 'bullying', votos: 0 });
        enquete.insert({ categoria: 'cyberbullying', votos: 0 });
        enquete.insert({ categoria: 'exclusao', votos: 0 });
        enquete.insert({ categoria: 'nenhuma', votos: 0 });
    }
}

// Rota para buscar os votos
app.get('/api/enquete', (req, res) => {
    if (!enquete) return res.json({});
    const dados = enquete.find();
    const resultados = {};
    dados.forEach(item => {
        resultados[item.categoria] = item.votos;
    });
    res.json(resultados);
});

// Rota para somar o novo voto
app.post('/api/enquete', (req, res) => {
    const { categoria } = req.body;
    if (enquete) {
        const item = enquete.findOne({ categoria: categoria });
        if (item) {
            item.votos += 1;
            enquete.update(item);
        }
    }
    res.json({ ok: true });
});

app.listen(3000, () => console.log('Servidor ligado com sucesso!'));