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
  githubURL:          { type: Types.Url,    initial: true   },
	},
  "Server Stuff",
  { 
    bootstrapPort: 	   { type: String, initial: true   },
  	//publicPortStart: 	 { type: String, initial: true   },
    publicPortCount:   { type: String, initial: true,  default: "5" },
    listOfChains: 
         { type: String, default: "simpleExample|slackChat" },
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
Organisation.schema.post('save', function(ThisDoc) {

  debugger;

  var child_process   = require('child_process');
  var fs              = require('fs');

  
  console.log(ThisDoc);

  var listOfChains    = ThisDoc.listOfChains.split("|");

  var githubURL       = ThisDoc.githubURL;
  var groupName       = ThisDoc.key.replace(/-/g, "");

  console.log(groupName);

  var commandLineArgs   = [githubURL, groupName].join(" ");
  var execString        = "/home/holochain/Scripts/hc.initialiseGroup "+commandLineArgs;
  console.log(execString);

  var fileContentsList = [execString];
  child_process.execSync
  ( execString
  );
  for (var i=0, size=listOfChains.length; i < size; i++)
  { debugger;
    var chainName = listOfChains[i];

    var bsPort          = parseInt(ThisDoc.bootstrapPort);
    var publicPortCount = parseInt(ThisDoc.publicPortCount);

    bsPort              = bsPort + (publicPortCount * 2 * i) + i;
    var publicPortStart = bsPort+1;
    var publicPortEnd   = publicPortStart + ( publicPortCount * 2 ) -1;
  

    commandLineArgs2   = [groupName, chainName, bsPort, publicPortStart, publicPortEnd ].join(" ");
    var execString2        = "/home/holochain/Scripts/hc.initialiseChain "+commandLineArgs2;
    console.log(execString2);

    child_process.exec
    ( execString2
    );

    //fileContentsList.push(execString2);


  }
}
);


/**
 * Registration
 * ============
 */

Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
