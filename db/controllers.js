const db = require('./index.js');

module.exports = {
 getUsersCategories: function(cb) {
},
 getAllFriends: function(userID, cb) {
  db.Friendships.findAll({
    where: {
      userID: userID
    }
  }).then((results) => {
    cb(results)
  })
 }
}


