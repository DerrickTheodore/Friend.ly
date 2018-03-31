const router = require('express').Router();
const db = require('../db/index.js');
const controller = require('../db/controllers.js');
const util = require('./utils.js');
const bcrypt = require('bcrypt');
const cloudinarySDK = require('../service_wrappers/cloudinary.js')
const multer  = require('multer')
const webPush = require('web-push');
const upload = multer({'dest': 'upload/'});
// let vapidKeys = require('../config.js').vapidKeys
const createfFileOnReq = upload.single('file');

router.post('/sendNotifs', (req, res) => {
	let eventID = req.body.eventID;
	db.sequelize.query(`select endpoints, endpointauths from users inner join userevents on users."userID" = userevents."userID" where userevents."eventID" = ${eventID}`, {type: db.sequelize.QueryTypes.SELECT})
	.then((results) => {
		results.forEach(result => {
			let payload = "Someone has joined your event!"
			if (result.endpoints !== null) {
			let pushSubscription = {
				endpoint: result.endpoints[0],
				keys: {
					p256dh: process.env.vapidPub,
					auth: result.endpointauths[0]
				}
			}
			webPush.sendNotification(pushSubscription, payload,{}).then((res) => {
				
			}).catch((err) => {
				console.log(err)
			})
		}
	})
})
})

router.post('/subscribeNotifs', (req, res) => {
	webPush.setGCMAPIKey(req.body.publicKey)
	webPush.setVapidDetails(
		'mailto:wjeichhold@gmail.com',
		process.env.vapidPub,
		process.env.vapidPriv
		)
		db.Users.find({
	  where: {
	    userID: req.body.id
	  }
	})
	.then((user) => {
		let newEndpoint = req.body.notificationEndPoint;
		let newAuth = req.body.auth;
		if (user.dataValues.endpoints === null || user.dataValues.endpoints.indexOf(newEndpoint) === -1) {
				user.update({
	    			endpoints: db.sequelize.fn('array_append', db.sequelize.col('endpoints'), newEndpoint),
	    			endpointauths: db.sequelize.fn('array_append', db.sequelize.col('endpointauths'), newAuth)
		  		})
				.then(user => res.status(200).send({response: 'endpoint added to user field'}))
		} else {
			res.send('duplicate endpoint found')
		}
	})
})

router.get('/checklogin', util.checkUser, (req, res) => {
	res.end()
})

router.post('/logout', util.expireSession, (req, res) => {
	res.end()
})

router.post('/facebookLogin', (req, res) => {
	let fbID = req.body.id;
	let email = req.body.email;
	let username = req.body.username;
	let picture = req.body.picture
	let fbLink = req.body.link;
	let gender = req.body.gender;

	db.Users.findOne({where: {facebookID: fbID}}).then( (user) => {
		if (!user) {
			db.Users.findCreateFind({where: {
				facebookID: fbID, 
				username: username, 
				email: email, 
				profilePic: picture,
				facebookLoginPage: fbLink,
				gender: gender,
			}})
			.spread((user, created) => {
				let userID = user.dataValues.userID
				util.createSession(req, res, userID)
			})
		} else {
			let userID = user.dataValues.userID
			util.createSession(req, res, userID)
		}
	})
})

router.post('/signup', (req, res) => {
	let username = req.body.username;
	db.Users.findOne({where: {username: username}}).then((foundUser) => {
		if (!foundUser) {
				bcrypt.hash(req.body.password, 4)
				.then((hash) => {
					db.Users.findCreateFind({where: {username: username, passHash: hash, email: req.body.email}})
					.spread((user, created) => {
						({userID, username} = user.dataValues)
						res.status(200).send({userID, username});
					})
				})
		} else {
			({userID, username} = foundUser.dataValues)
			res.status(200).send({response: 'Already a member', userID, username});
		}
	})
})

router.post('/login', (req, res) => {
	let username = req.body.username
	let password = req.body.password
	db.Users.findOne({where: {username: username}})
	.then((user) => {
		if (!user) {
			res.status(200).send({response: 'member not found'});
		} else {
			user.comparePassword(req.body.password, (isMatch) => {
				if (!isMatch) {
					res.status(200).send({response: 'invalid password'})
				} else {
					let userID = user.dataValues.userID
					util.createSession(req, res, userID)
				}
			})
		}
	})
})

router.get('/dashboard/events', (req, res) => {
	const userID = req.query.userID;
	db.UserEvents.findAll({where: {userID: userID}}).then((events) => {
		let eventsData = [];
		eventsData = events.map(({ eventID }) => {
			return db.Events.findOne({where: {eventID: eventID}})
		})
		Promise.all(eventsData)
		.then((results) => {
			res.status(200).send(results);
		})
		.catch(err => console.log(err))
	})
})

router.get('/dashboard/events/members', (req, res) => {
  const eventID = req.query.eventID;
  db.UserEvents.findAll({where: {eventID : eventID}}).then((events) => {
    let memberData = [];

    memberData = events.map(({userID}) => {
      return db.Users.findOne({where: {userID: userID}})
    })

    Promise.all(memberData)
    .then((results) => {
      res.status(200).send(results)
    })
  })
})

router.get('/profile/data/:userID', (req, res) => {
	let userID = req.params.userID;
	db.Users.findOne({where: {userID: userID}}).then((user) => {
		let userClientSideData = {
			userID: user.dataValues.userID,
			username: user.dataValues.username,
			bio: user.dataValues.bio,
			email: user.dataValues.email,
			gender: user.dataValues.gender,
			createdAt: user.dataValues.createdAt,
			updatedAt: user.dataValues.updatedAt,
			profilePic: user.dataValues.profilePic,
			facebookID: user.dataValues.facebookID,
			facebookLoginPage: user.dataValues.facebookLoginPage
		};
			db.Friendships.findAll({where: { userID }}).then((initFriendships) => {
					db.Friendships.findAll({where: { friendID: userID }}).then((uninitFriendships) => {
					const friendRequest = initFriendships.reduce((arrayOfRequest, { friendID: friendedMeBackID}) => {
						let friendObj = { friendID: friendedMeBackID, access: false};
						return arrayOfRequest.concat([db.Friendships.findOne({where: { userID: friendedMeBackID, friendID: userID }}), friendObj])
					}, [])
					const recievedFriendRequest = uninitFriendships.reduce((arrayOfRequest, { userID: friendedMeBackID, friendID }) => {
						let friendObj = { friendID: friendedMeBackID, access: true};
						return arrayOfRequest.concat([db.Friendships.findOne({where: { userID: friendID, friendID: friendedMeBackID }}), friendObj])
					}, [])
					Promise.all([...recievedFriendRequest, ...friendRequest])
					.then((friendRequestResults) => {
							const pendingFriendRequest = [];
							const pendingFriendRequestData = [];
							const friends = {};
							friendRequestResults.forEach((isFriend, idx, results) => {
								if(idx % 2 === 0) {
									if(isFriend === null) {
										pendingFriendRequest.push([isFriend, results[ ++idx ]])
										pendingFriendRequestData.push(db.Users.findOne({where: { userID: results[ idx ].friendID}}))
									} else {
										friends[ ++idx ] = [isFriend, results[idx]]
									}
								}
							})
						friendsData = Object.values(friends).map((friendshipObj) => {
							let friendID = friendshipObj[1].friendID
							return db.Users.findOne({where: { userID: friendID }})
						})
				Promise.all(friendsData)
				.then((results) => {
					Promise.all(pendingFriendRequestData)
					.then((pendingFriendRequestResolved) => {
					const friend_array = results.reduce((friend_arr, friend) => {
						let pull_data = 'username email gender bio userID profilePic'
						let friend_object = {};
						for(let attr in friend.dataValues) {
							if(pull_data.includes(attr)) {
								friend_object[attr] = friend.dataValues[attr]
							}
						}

						return friend_arr.concat([friend_object]);
					}, [])

					userClientSideData.friends = friend_array;
					userClientSideData.allPendingFriendRequest = pendingFriendRequest.map((FR_WithData, idx) => {
						({profilePic, username, facebookLoginPage, gender} = pendingFriendRequestResolved[idx])
						return FR_WithData.concat({profilePic, username, facebookLoginPage, gender})
					})	

					db.UserEvents.findAll({where: {userID: userID}}).then((events) => {
						let eventsData = [];

						eventsData = events.map(({ eventID }) => {
							return db.Events.findOne({where: {eventID: eventID}})
						})

								Promise.all(eventsData)
								.then((results) => {

									db.UserEvents.findAll({where: { userID }})
									.then((userEvents) => {
										const joinedEvents = userEvents.map(({ eventID }) => db.Events.findOne({where: { eventID } }))
										Promise.all(joinedEvents)
										.then((joinedEventsData) => {
											let categoryObj = joinedEventsData.reduce((categoryObj, joinedEventData) => {
												categoryObj[joinedEventData.category] = 1 || (categoryObj[joinedEventData.category] += 1)
												return categoryObj;
											}, {})
											userClientSideData.categories = categoryObj
											userClientSideData.events = results;
											res.status(200).send(userClientSideData);
										})
										.catch(err => console.log(err))
									})
								})
								.catch(err => console.log(err))
							})
							.catch(err => console.log(err))
						})
						.catch(err => console.log(err))
					})
					.catch(err => console.log(err))
				})
				.catch(err => console.log(err))
			})
			.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
	})
	.catch(err => console.log(err))
})

router.post('/profile_img_update', createfFileOnReq, ({ file: { path: imageFile }, query: { userID } } , res) => {
	
	cloudinarySDK
	.v2
	.uploader
	.upload(`${imageFile}`, 
	{
		public_id: `${userID}`,
	}, (err, { secure_url }) => {
		if(err) console.log(err)
		db.Users.find({
			where: { userID }
		})
		.then(user => {
			return user.update({
				profilePic: secure_url 
			})
		})
		.catch(err => console.log(err))
		.then(updatedUser => {
			
			res.status(200).send({'response_message': `updated userID:${updatedUser.dataValues.userID} info`});
		})
		.catch(err => console.log(err))
  })
})

router.post('/profile_form_update', (req, res) => {
	let queryData = req.query;
	let userID = req.body.userID;

	queryData = Object.values(queryData)
	.reduce((filter, query, idx) => {
		if(query) { filter[Object.keys(queryData)[idx]] = query }
		return filter;
	}, {})
	
	db.Users.find({
		where: { userID: userID }
	})
	.then(user => {
		return user.update(queryData)
	})
	.then(updatedUser => {
		res.status(200).send({'response_message': `updated userID:${updatedUser.dataValues.userID} info`});
	})
	.catch(err => console.log(err))
});

router.post('/friendship_update', (req, res) => {
	let friendID = req.body.friendID;
	let userID = req.body.userID;

	if(Number(req.body.add)) {
		db.Friendships.findOne({where: {userID, friendID}}).then((foundFriendship) => {
			if (!foundFriendship) {
				db.Friendships.findCreateFind({where: {userID, friendID}})
				.then((friendship) => {
					res.status(200).send({response: friendship});
				})
			} else {
				res.status(301).send({response: `Already friends ${foundFriendship}`});
			}
		})
	} else {
		db.Friendships.findAll({
			where: {
				userID: {
					[db.Op.or]: [userID, friendID]
				},
				friendID: {
					[db.Op.or]: [userID, friendID]
				}
			}
		}).then((foundFriendships) => {
				const unfriend = foundFriendships.map(({ id }) => db.Friendships.destroy({where: {id}}))
				Promise.all(unfriend)
				.then(results => res.status(200).send(results))
				.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
	}
})

router.post('/event_attendance_update', (req, res) => {
	let eventID = req.body.eventID;
	let userID = req.body.userID;

	db.UserEvents.findOne({where: {userID, eventID}}).then((foundEvent) => {
		if (!foundEvent) {
			db.UserEvents.findCreateFind({where: {userID, eventID}})
			.then((event) => {
				res.status(200).send({response: event});
			})
		} else {
			res.status(200).send({response: `Already attending eventID ${foundEvent.dataValues.eventID}`});
		}
	})
})

router.post('/createEvent', (req, res) => {
	const CATEGORIES = {
		arts: 'https://librariestaskforce.blog.gov.uk/wp-content/uploads/sites/159/2016/08/LD_IconCulture.png',
		drinks: 'https://d27t3nufpewl0w.cloudfront.net/lichess/e7fd1e30904c7fcb9b86dd6aba626f3d536be03c_raster.png',
		gaming: 'https://www.shareicon.net/download/2015/08/29/92894_game_2133x2133.png',
		exercise: 'https://www.shareicon.net/download/2015/09/22/104946_fitness_512x512.png',
		music: 'https://cdn4.iconfinder.com/data/icons/music-and-entertainment/512/Music_Entertainment_Crowd-512.png',
		food: 'https://housing.umn.edu/sites/housing.umn.edu/files/dining_icon-01.png',
		outdoors: 'https://cdn0.iconfinder.com/data/icons/camping-circular/128/camping_outdoors_equipment-07-512.png',
		movies: 'https://cdn4.iconfinder.com/data/icons/ballicons-2-new-generation-of-flat-icons/100/cinema-256.png'
	}
	let eventName = req.body.eventName;
	let capacity = req.body.capacity;
	let creatorID = req.body.creatorID;
	let category = req.body.category;
	let eventDesc = req.body.eventDesc;
	let startDate = req.body.startDate;
	let endDate = req.body.endDate;
	let imgLink = CATEGORIES[ req.body.category ]
	let locationname = req.body.locationName;
	let locationgeo = req.body.locationGeo;

	db.Users.findOne({where: {userID: creatorID}}).then(user => {
		const creatorName = user.username;
		db.Events.findCreateFind({where: {imgLink: imgLink, startDate: startDate, endDate: endDate, eventName: eventName, capacity: capacity, eventDesc: eventDesc, category: category, creatorID: creatorID, creatorName: creatorName, locationname: locationname, locationgeo: locationgeo}}).spread((event, created) => {
			db.UserEvents.findCreateFind({where: {userID: creatorID, eventID: event.dataValues.eventID}}).spread((userevent, created) => {
				res.send(userevent.dataValues)
			})
		})
	})
})

router.post('/confirmEvent', (req, res) => {

  db.Events.findOne({where: {eventID: req.body.eventID}}).then(event => {
    if (event.creatorID === req.body.userID) {
      event.update({status: 'closed'}).then(updatedEvent => {
      	db.UserEvents.findAll({where: {eventID: updatedEvent.eventID}}).then(userIDs => {
      		let emails = [];
 					let users = userIDs.map(userID => {
      			return db.Users.findOne({where: {userID: userID.dataValues.userID}})
      		});
      		      		
      		Promise.all(users).then((users) => {
      			users.forEach(user => {
      				if(user.userID !== updatedEvent.creatorID) {
      					emails.push(user.email)
      				}
      			});
      			const result = {emails: emails, event: updatedEvent};
      			res.send(result);
      		})
      	})
      })
  }})
})

router.post('/editEvent', (req, res) => {
  db.Events.findOne({where: {eventID: req.body.eventID}}).then((event) => {
    if (event.creatorID === req.body.userID) {
      event.update({
        eventName : req.body.event.eventName,
        eventDesc: req.body.event.eventDesc,
        capacity: req.body.event.capacity
      }).then(() => {
        res.end()
      })
    } else {
      res.end()
    }
  })
})

router.get('/profile/events', (req, res) => {
  let userID = req.query.userID
	db.UserEvents.findAll({where: { userID: userID }})
	.then((events) => {
		const allUserEvents = events.map((event) => {
			return db.Events.findOne({where: {eventID: event.eventID}})
		})
		
		Promise.all(allUserEvents)
		.then((results) => {
			res.status(200).send(results)
		})
		.catch(err => res.status(500).send(err))
	})
	.catch(err => res.status(500).send(err))
})

/////////////// SEARCH COMPONENT REQUEST /////////////////////////

router.get('/search/events', (req, res) => {
  const term = req.query.term;
	const like = {[db.Op.iLike]: '%' + term + '%'};
	const where = {[db.Op.and]: [
		{status: 'active'},
		{[db.Op.or]: [
			{category: like},
			{eventName: like},
			{eventDesc: like}
		]}
	]};

	db.Events.findAll({where: where}).then((events) => {
		res.send(events)
	})
})

router.get('/search/userevents', (req, res) => {
    const eventID = req.query.eventID;
    const userID = req.query.userID;
    db.UserEvents.findOne({where: {eventID: eventID, userID: userID }}).then(event => {
      res.send(event);
    });
})

router.post('/search/userevents/add', (req, res) => {
	const userID = req.body.userID;
	const eventID = req.body.eventID;
	db.Events.findOne({where: {eventID: eventID}}).then(event => {
		if(event.current < event.capacity && event.status === 'active'){
			event.update({current: event.current + 1}).then(event => {
				db.UserEvents.create({userID, eventID}).then(userEvent => {
					res.send(userEvent);
				})
			})
		} else {
			res.send('full');
		}
	})
})

module.exports = router;
