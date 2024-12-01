const User = require('../models/User');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.createUser  = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar conta, tente novamente!" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.updateUser  = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.update(req.body); 
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteUser  = async (req, res) => {
    const { email, id } = req.body; 

    try {
        let user;
        if (email) {
            user = await User.findOne({ where: { email } });
        } else if (id) {
            user = await User.findByPk(id);
        }

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.destroy();
        res.status(204).send(); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getUserByEmailOrId = async (req, res) => {
    const { email, id } = req.query; 

    try {
        let user;
        if (email) {
            user = await User.findOne({ where: { email } });
        } else if (id) {
            user = await User.findByPk(id);
        }

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getUserEvents = async (req, res) => {
    const { user_id } = req.params; 

    try {
        const registrations = await Registration.findAll({
            where: { user_id },
            include: {
                model: Event,
                attributes: ['id', 'name', 'date', 'location']
            }
        });

        const events = registrations.map(registration => {
            const eventDate = new Date(registration.Event.date);
            return {
                id: registration.Event.id,
                name: registration.Event.name,
                location: registration.Event.location,
                date: eventDate.toISOString().split('T')[0] 
            };
        });

        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};