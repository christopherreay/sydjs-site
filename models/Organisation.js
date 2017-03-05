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
	portStart: 	{ type: String, initial: true  },
	portCount: 	{ type: String, initial: true,  default: "5" },
	githubRepo: Types.Url,
	},
	"Description",
	{ description: { type: Types.Markdown },
	}
);

/**
 * Relationships
 * =============
 */

Organisation.relationship({ ref: 'User', refPath: 'organisation', path: 'members' });


// `true` means this is a parallel middleware. You **must** specify `true`
// as the second parameter if you want to use parallel middleware.
Organisation.schema.pre('save', function(next) {

  debugger;

  var crypt     = require('crypt3');
  var uuid      = require('node-uuid');
  var sysExec   = require('child_process').exec;
  var fs        = require('fs');

  
  var ThisDoc = this;

  var jobID             = uuid.v1();


  var password          = crypt(ThisDoc.initialPassword);


  var group             = "thisEquals";
  var name              = ThisDoc.systemUser.charAt(0).toUpperCase() + ThisDoc.systemUser.substr(1);
  var projectTitle      = group + name;
  var lowerName         = name.toLowerCase();
  var lowerProjectTitle = projectTitle.toLowerCase();
  
  var backEndURL        = "github_administrator:christopherreay/thisEqualsThat_backEnd.git";
  var frontEndURL       = "github_administrator:christopherreay/thisEqualsThat_frontEnd.git";

  var pyramidPort       = ThisDoc.pyramidPort

  var commandLineArgs   = [jobID, group, name, projectTitle, lowerName, lowerProjectTitle, backEndURL, frontEndURL, pyramidPort, "&>/home/administrator/log/createEnv"+projectTitle].join(" ");
  var execString        = "sudo /home/administrator/Scripts/createUser.asRoot "+commandLineArgs;
  
  fs.writeFile
  ( "/home/administrator/tmp/"+jobID, 
    lowerName+":"+password,
    function(err)
    { if (err) throw err;
      console.log("saved job data");

      console.log(execString);

      sysExec
      ( execString, 
        { /*"env": newEnv,*/
        },
        function(error, stdout, stderr)
        { debugger;

          console.log(stdout);
          //add this stdout to doc.osUser
          ThisDoc.osUser += "<div>"+stdout+"</div>";

          var request = require('request');
          
          var requestOptions =
          { "url":  'https://api.cloudflare.com/client/v4/zones/f63113e3084e5ca07af9ecdc3c939732/dns_records',
            "method": "post",
            "headers":
                { "X-Auth-Email": "christopherreay@gmail.com",
                  "X-Auth-Key":   "da9e0bedb7f4d1a9b47a6f3b51a8eb31eb252",
                  "Content-Type": "application/json",
                },
            "json":
                { "type":     "A",
                  "name":     lowerName+".freefreecrowdfunding.org",
                  "content":  "178.62.57.25",
                  "proxied":  true,
                },
          };

          request
          ( requestOptions,
            function (error, response, body) 
            { if (error) 
              { return console.log('cloudflare update failed:', error);
              }
              debugger;
              if (body.success == true)
              { console.log('Upload successful!  Server responded with:', body);
                ThisDoc.cloudflareJSON  = body;
                ThisDoc.cloudflareDNSID = body.result.id;
              }
              ThisDoc.cloudflareHistory = body;

              next();
            }
          );
        }
      );

    }
  );
});

/**
 * Registration
 * ============
 */

Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
