var keystone = require('keystone');
var Types = keystone.Field.Types;
var shell = require('shelljs');

var absoluteAddress = "/home/holochain";

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
  var groupLog        = absoluteAddress+"/groupLogs/"+groupName;
  
  console.log(groupName);

  shell.mkdir("-p", groupLog);
  var commandLineArgs   = [githubURL, groupName, "2>&1 | tee -a "+groupLog+"/allServers.log > /dev/null"].join(" ");
  var execString        = absoluteAddress+"/Scripts/hc.initialiseGroup "+commandLineArgs;
  console.log(execString);

  var fileContentsList = [execString];
  child_process.execSync
  ( execString
  );


  function recursiveCallbackChains(currentIndex, highCount)
  { if (currentIndex == highCount)
    { return;
    }
    else
    { debugger;
      var chainName = listOfChains[currentIndex];

      var bsPort          = parseInt(ThisDoc.bootstrapPort);
      var publicPortCount = parseInt(ThisDoc.publicPortCount);

      bsPort              = bsPort + (publicPortCount * 2 * currentIndex) + currentIndex;
      var publicPortStart = bsPort+1;
      var publicPortEnd   = publicPortStart + ( publicPortCount * 2 ) -1;
    

      commandLineArgs2   = [groupName, chainName, bsPort, publicPortStart, publicPortEnd, "2>&1 | tee -a "+groupLog+"/"+chainName+".log >> "+groupLog+"/allServers.log"].join(" ");
      var execString2    = absoluteAddress+"/Scripts/hc.initialiseChain "+commandLineArgs2;
      console.log(execString2);

      child_process.exec
      ( execString2,
        function()
        { setImmediate(function(){recursiveCallbackChains(currentIndex +1)});
        }
      );
    }

  };

  recursiveCallbackChains(0, listOfChains.length);
}
);


/**
 * Registration
 * ============
 */

Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
