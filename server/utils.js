module.exports = {
	checkUser: (req, res, next) => {
		if(req.session){
			let userID, username;
			({userID, username} = req.session)
			res.status(200).send({userID, username});
		} else {
			res.status(200).send({message: "No Sesssion logged"})
		}
		next();
	},
	createSession: (req, res, userID) => {
		let username;
		({username} = req.body)
		req.session.regenerate( () => {
			req.session.userID = userID;
			req.session.username = username;
			res.status(200).send({userID, username});
		});
	},
	expireSession: (req, res, next) => {
		let userID;
		({userID} = req.body)
		req.session.destroy((err) => {
			res.status(200).send({"response_message": `${userID} session destroyed`});
		});
	}
}

