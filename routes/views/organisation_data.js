var keystone = require('keystone');

var Organisation = keystone.list('Organisation');

exports = module.exports = function(req, res) {
  
  var view = new keystone.View(req, res),
    locals = res.locals;

  console.log(req.query.id);
  var orgID = req.query.orgID
  
  // locals.section = 'members';
  
  //view.query('organisations', Organisation.model.find({"_id": req.query.orgID}).sort('name'), 'members');

  Organisation.model.findOne({"_id": orgID})
    .exec
    ( function(err, organisation)
      { res.json({"organisation": organisation});
      }
    );  
}
