const db = require('./index.js');

module.exports = {
 getUsersCategories: function(cb) {
  //  return sequelize.query("SELECT userevents.eventID WHERE userID=1 FROM userevents LEFT JOIN events ON userevents.eventID=events.eventID ORDER BY events.date")
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


