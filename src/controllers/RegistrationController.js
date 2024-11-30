const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

const createRegistration = async (req, res) => {
    const { user_id, event_id } = req.body;

    try {
        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }

        const registrationsCount = await Registration.count({ where: { event_id } });
        if (registrationsCount >= event.available_slots) {
            return res.status(400).json({ error: 'Não há slots disponíveis para este evento' });
        }

        const existingRegistration = await Registration.findOne({
            where: { user_id, event_id }
        });

        if (existingRegistration) {
            return res.status(400).json({ error: 'Usuário já inscrito neste evento' });
        }

        const registration = await Registration.create({ user_id, event_id });
        res.status(201).json(registration);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name', 'email']
                },
                {
                    model: Event,
                    attributes: ['name', 'date']
                }
            ],
            attributes: []
        });

        const formattedRegistrations = registrations.map(registration => {
            return {
                "Nome": registration.User.name,
                "Email": registration.User.email,
                "Nome Do Evento": registration.Event.name,
                "Data Do Evento": registration.Event.date.toISOString().split('T')[0]
            };
        });

        res.status(200).json(formattedRegistrations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteRegistration = async (req, res) => {
    const { user_id, email } = req.body;

    try {
        const user = await User.findOne({ where: { id: user_id, email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const registration = await Registration.findOne({ where: { user_id } });
        if (!registration) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }

        await registration.destroy();
        res.status(200).json({ message: 'Inscrição deletada com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createRegistration,
    getRegistrations,
    deleteRegistration
};