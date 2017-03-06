var keystone = require('keystone');

var Organisation = keystone.list('Organisation');

exports = module.exports = function(req, res) {
  
  var view = new keystone.View(req, res),
    locals = res.locals;

  locals.orgID = req.query.id
  
  // locals.section = 'members';
  
  debugger;

  var callbacks = view.query
  ( 'organisations', 
    Organisation.model.find({"_id": req.query.orgID}).sort('name'), 
    function()
    { console.log("SOME OPAQUE SHIT");
      members();
    }
  );

  Organisation.model.findOne({"_id": req.query.orgID})
    .exec
    ( function(err, organisation)
      { debugger;
        console.log("organisation", organisation);

        var uuid      = require('uuid');
        var sysExec   = require('child_process').exec;
        var fs        = require('fs');

        var groupName       = organisation.key.replace(/-/g, "");
        var bsPort          = parseInt(organisation.bootstrapPort);
        var publicPortStart = parseInt(organisation.publicPortStart);
        var publicPortCount = parseInt(organisation.publicPortCount);


        console.log(groupName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) );

        var commandLineArgs   = [groupName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) - 1].join(" ");
        var execString        = "/home/holochain/Scripts/hc.blowAwayAndPullAndRestart "+commandLineArgs;

        sysExec
        ( execString, 
          { /*"env": newEnv,*/
          },
          function(error, stdout, stderr)
          { debugger;

            console.log(stdout);
            //add this stdout to doc.osUser
            //ThisDoc.osUser += "<div>"+stdout+"</div>";
          }
        ) 
      }
    );

  //console.log("view", view);

  //view.render('site/organisation');
  
}