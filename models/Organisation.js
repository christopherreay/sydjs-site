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
  ""
  {
    bootstrapPort: 	   { type: String, initial: true   },
  	publicPortStart: 	 { type: String, initial: true   },
    publicPortCount:   { type: String, initial: true,  default: "5" },
	},
	"Description",
	{ description: { type: Types.Markdown },
    location: Types.Location

	}
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

  var githubURL       = ThisDoc.githubURL;
  var groupName       = ThisDoc.key.replace(/-/g, "");
  var bsPort          = parseInt(ThisDoc.bootstrapPort);
  var publicPortStart = parseInt(ThisDoc.publicPortStart);
  var publicPortCount = parseInt(ThisDoc.publicPortCount);

  console.log(githubURL, groupName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) -1 );

  var commandLineArgs   = [githubURL, groupName, bsPort, publicPortStart, publicPortStart + ( publicPortCount * 2 ) -1 ].join(" ");
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
    }
  ) 
  
});


/**
 * Registration
 * ============
 */

Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
