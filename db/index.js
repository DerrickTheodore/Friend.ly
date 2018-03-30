const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;
const sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
	host: process.env.RDS_HOSTNAME,
	dialect: 'postgres',
  pool: {
		max: 5,
		min: 0,
		idle: 20000,
		acquire: 20000
	}
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
	});
	
const Users = sequelize.define('users', {
	userID: {
		type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
	},
	username: {
		type: Sequelize.STRING
	},
	passHash: {
		type: Sequelize.STRING
	},
	bio: {
		type: Sequelize.STRING,
		defaultValue: "Tell us a little bit about yourself?"
	},
	email: {
		type: Sequelize.STRING
	},
	gender: {
		type: Sequelize.STRING
	},
	facebookID: {
		type: Sequelize.STRING,
	},
	profilePic: {
		type: Sequelize.STRING,
		defaultValue: 'https://previews.123rf.com/images/diddleman/diddleman1204/diddleman120400002/13058158-no-user-profile-picture-hand-drawn-.jpg'
	},
	facebookLoginPage: {
		type: Sequelize.STRING
	},
	endpoints: {
		type: Sequelize.ARRAY(Sequelize.TEXT)
	},
	endpointauths: {
		type: Sequelize.ARRAY(Sequelize.TEXT)
	}
})

const Friendships = sequelize.define('friendships', {
	userID: {
		type: Sequelize.INTEGER, 
	},
	friendID: {
		type: Sequelize.INTEGER
	}
})

const Events = sequelize.define('events', {
	eventID: {
		type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
	},
	eventName: {
		type: Sequelize.STRING
	},
	status: {
		type: Sequelize.STRING, defaultValue: 'active'
	},
	creatorID: {
		type: Sequelize.INTEGER
	},
	startDate: {
		type: Sequelize.STRING
	},
	endDate: {
		type: Sequelize.STRING
	},
	capacity: {
		type: Sequelize.INTEGER
	},
	imgLink: {
		type: Sequelize.STRING
	},
	category: {
		type: Sequelize.STRING
	},
	eventDesc: {
		type: Sequelize.STRING
	},
	creatorName: {
		type: Sequelize.STRING
	},
	current: {
		type: Sequelize.INTEGER, defaultValue: 1
	},
	locationname: {
		type: Sequelize.STRING
	},
	locationgeo: {
		type: Sequelize.JSON
	}

})

const UserEvents = sequelize.define('userevents', {
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

Friendships.sync({force: false})

Users.prototype.comparePassword = function (pwAttempt, callback) {
	bcrypt.compare(pwAttempt, this.passHash, (err, isMatch) => {
		callback(isMatch)
	})
}

module.exports = {
	sequelize: sequelize,
	Users: Users,
	Events: Events,
	UserEvents: UserEvents,
	Op: Op,
	Friendships: Friendships
}
