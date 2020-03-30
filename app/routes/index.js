const adminRoutes = require('./admin_routes');
module.exports = function(app, db) {
 adminRoutes(app, db);
 // Other route groups could go here, in the future
};
