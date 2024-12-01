const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 
const Event = require('./Event'); 

class Registration extends Model {}

Registration.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id'
        }
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Event, 
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Registration',
    timestamps: true
});


Registration.belongsTo(User, { foreignKey: 'user_id' });
Registration.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = Registration;