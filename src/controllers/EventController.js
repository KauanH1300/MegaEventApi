const Event = require('../models/Event');
const { Op } = require('sequelize');

exports.createEvent = async (req, res) => {
    try {
        const eventDate = new Date(req.body.date);
        
        if (isNaN(eventDate)) {
            return res.status(400).json({ error: 'Data inválida' });
        }

        req.body.date = eventDate.toISOString().slice(0, 19).replace('T', ' '); 
        
        const event = await Event.create(req.body);

        const{createdAt, updatedAt, ...eventResponse} = event.get({plain: true})
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const { date, location, name } = req.query;

        const where = {};
        if (date) {
            where.date = {
                [Op.eq]: new Date(date).toISOString().slice(0, 19).replace('T', ' ')
            };
        }
        if (location) {
            where.location = {
                [Op.like]: `%${location}%`
            };
        }
        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            };
        }

        const events = await Event.findAll({
            where,
            attributes: ['id', 'name', 'location', 'date', 'event_type', 'available_slots']
        });

        const formattedEvents = events.map(event => {
            const eventDate = new Date(event.date);
            return {
                id: event.id,
                name: event.name,
                location: event.location,
                date: eventDate.toISOString().split('T')[0],
                event_type: event.event_type,
                available_slots: event.available_slots
            };
        });

        res.status(200).json(formattedEvents);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }

        
        await event.update(req.body);
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }

        await event.destroy();
        res.status(204).send(); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};