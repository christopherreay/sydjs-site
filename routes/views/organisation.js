var keystone = require('keystone');

var Organisation = keystone.list('Organisation');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	console.log(req.query.id);
	
	// locals.section = 'members';
	
	view.query('organisations', Organisation.model.find({"_id": req.query.id}).sort('name'), 'members');
	
	console.log("members", locals.organisations);

	view.render('site/organisations');
	
}
