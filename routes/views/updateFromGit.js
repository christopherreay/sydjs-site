var keystone = require('keystone');

var Organisation = keystone.list('Organisation');

exports = module.exports = function(req, res) {
  
  var view = new keystone.View(req, res),
    locals = res.locals;

  locals.orgID = req.query.id
  
  // locals.section = 'members';
  
  debugger;

  var organisationID =  req.query.orgID;
  var chainName      =  req.query.chainName;

  Organisation.model.findOne({"_id": organisationID})
    .exec
    ( function(err, organisation)
      { debugger;
        console.log("organisation", organisation);

        var sysExec   = require('child_process').exec;
        var fs        = require('fs');

        var groupName         = organisation.key.replace(/-/g, "");
        var groupLog          = "groupLogs/"+groupName;
        shell.mkdir("-p", groupLog);
        var listOfChains = organisation.listOfChains.split("|");

        
        var i                 = listOfChains.indexOf(chainName);

        if (i != -1)
        { var bsPort          = parseInt(organisation.bootstrapPort);
          var publicPortCount = parseInt(organisation.publicPortCount);

          bsPort              = bsPort + (publicPortCount * 2 * i) + i;
          var publicPortStart = bsPort+1;
          var publicPortEnd   = publicPortStart + ( publicPortCount * 2 ) -1;


          console.log(groupName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) );

          var commandLineArgs   = [groupName, chainName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) - 1, "2>&1 | tee -a "+groupLog*"/"*chainName+".log >> "+groupDir+"/allServers.log"].join(" ");
          var execString        = "/home/holochain/Scripts/hc.blowAwayAndPullAndRestart "+commandLineArgs;

          sysExec
          ( execString, 
            { /*"env": newEnv,*/
            },
            function(error, stdout, stderr)
            { debugger;

              console.log(stdout);
              console.log(stderr);
              //add this stdout to doc.osUser
              //ThisDoc.osUser += "<div>"+stdout+"</div>";
            }
          ) 
        }
        else
        { if (fs.existsSync("/home/holochain/"+groupName+"/"+chainName)) 
          { debugger;

            listOfChains.push(chainName);
            organisation.update( { "_id":organisationID }, { $set: { "listOfChains": listOfChains.join("|") }});

            i                 = listOfChains.indexOf(chainName);

            var bsPort          = parseInt(organisation.bootstrapPort);
            var publicPortCount = parseInt(organisation.publicPortCount);

            bsPort              = bsPort + (publicPortCount * 2 * i) + i;
            var publicPortStart = bsPort+1;
            var publicPortEnd   = publicPortStart + ( publicPortCount * 2 ) -1;


            console.log(groupName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) );

            var commandLineArgs   = [groupName, chainName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) - 1, "2>&1 | tee -a "+groupDir*"/"*chainName+".log >> "+groupDir+"/allServers.log"].join(" ");
            var execString        = "/home/holochain/Scripts/hc.blowAwayAndPullAndRestart "+commandLineArgs;

            sysExec
            ( execString, 
              { /*"env": newEnv,*/
              },
              function(error, stdout, stderr)
              { debugger;

                console.log(stdout);
                console.log(stderr)
                //add this stdout to doc.osUser
                //ThisDoc.osUser += "<div>"+stdout+"</div>";
              }
            ) 
          }
        }
      }
    );

  //console.log("view", view);

  //view.render('site/organisation');
  
}