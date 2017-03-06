var keystone = require('keystone');

var Organisation = keystone.list('Organisation');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	console.log(req.query.id);
	locals.orgID = req.query.orgID
	
	// locals.section = 'members';
	
	view.query('organisations', Organisation.model.find({"_id": req.query.orgID}).sort('name'), 'members');

	view.render('site/organisation');
	
}
