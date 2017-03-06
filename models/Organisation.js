var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Organisations Model
 * ===================
 */

var Organisation = new keystone.List('Organisation', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Organisation.add
(	{ name: { type: String, index: true, initial: true },
  	logo: { type: Types.CloudinaryImage },
	},
	"Project Repo",
	{
  githubRepo:          Types.Url,
	},
  "Server Stuff"
  { 
    bootstrapPort: 	   { type: String, initial: true   },
  	publicPortStart: 	 { type: String, initial: true   },
    publicPortCount:   { type: String, initial: true,  default: "5" },
    chainNames:        { type: String, default: "simpleExample|slackChat" },
	},
	"Description",
	{ description: { type: Types.Markdown },
    location: Types.Location
	},
);

/**
 * Relationships
 * =============
 */

Organisation.relationship({ ref: 'User', refPath: 'organisation', path: 'members' });

// `true` means this is a parallel middleware. You **must** specify `true`
// as the second parameter if you want to use parallel middleware.
env_tet.schema.pre('save', function(next) {

  debugger;

  var uuid            = require('node-uuid');
  var sysExec         = require('child_process').exec;
  var fs              = require('fs');

  
  var ThisDoc = this;

  var listOfDirectories = ThisDoc.listOfDirectories.split("|");

  var githubURL       = ThisDoc.githubURL;
  var groupName       = ThisDoc.key.replace(/-/g, "");

  console.log(githubURL, groupName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) -1 );

  var commandLineArgs   = [githubURL, groupName].join[" "];
  var execString        = "/home/holochain/Scripts/hc.initialiseGroup "+commandLineArgs;

  sysExec
  ( execString, 
    { /*"env": newEnv,*/
    },
    function(error, stdout, stderr)
    { debugger;

      console.log(stdout);
      //add this stdout to doc.osUser
      //ThisDoc.osUser += "<div>"+stdout+"</div>";

      for (var i=0, size=listOfDirectories.length; i < size; i++)
      { var chainName = listOfDirectories[i];

        var bsPort          = parseInt(ThisDoc.bootstrapPort);
        var publicPortCount = parseInt(ThisDoc.publicPortCount);

        bsPort              = bsPort + (publicPortCount * 2 * i) + i;
        var publicPortStart = bsPort+1;
        var publicPortEnd   = publicPortStart + ( publicPortCount * 2 ) -1;
      

        var commandLineArgs   = [groupName, chainName, bsPort, publicPortStart, publicPortEnd ].join(" ");
        var execString        = "/home/holochain/Scripts/hc.initialiseChain "+commandLineArgs;

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
        );
      }
    }
  ) 
  
});


/**
 * Registration
 * ============
 */

Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
