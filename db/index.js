const keys = require('../config.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('hectorfriendlydb', keys.pgresLogin, keys.pgresPW, {
	host: 'hrnyc12hector.csoqhkc1zx8z.us-east-2.rds.amazonaws.com',
	dialect: 'postgres',

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
})

const Users = sequelize.define('users', {
	userID: {
		type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
	},
	userName: {
		type: Sequelize.STRING
	},
	passHash: {
		type: Sequelize.STRING
	},
	categories: {
		type: Sequelize.STRING
	},
	bio: {
		type: Sequelize.STRING
	}
})

const Events = sequelize.define('events', {
	eventID: {
		type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
	},
	status: {
		type: Sequelize.STRING
	},
	creatorID: {
		type: Sequelize.INTEGER
	},
	date: {
		type: Sequelize.DATE
	},
	chatroomID: {
		type: Sequelize.INTEGER
	}

})

const UserEvents = sequelize.define('userEvents', {
	eventID: {
		type: Sequelize.INTEGER, 
	},
	userID: {
		type: Sequelize.INTEGER
	}
})

Users.sync({force: false})
Events.sync({force: false})
UserEvents.sync({force: false})



module.exports = {
	sequelize: sequelize,
	Users: Users,
	Events: Events,
	UserEvents: UserEvents
}