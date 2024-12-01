const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const userRoutes = require('./routes/UserRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();
app.use(bodyParser.json());


sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado!');
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });

// Usando as rotas
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});