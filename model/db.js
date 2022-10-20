const db = require('mongoose');
db.connect(process.env.MONGOURI);

module.exports = db 
