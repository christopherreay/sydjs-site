$().ready
	( function()
		{ $(".rebuildFromGithub").on
			(	"click",
				function(event)
				{	var ajaxOptions =
					{	"url":       "/updateFromGit",
            "method":    "GET",
						"dataType":  "json",
						"data":
            { "orgID": $(event.target).attr("orgID"),
              "chainName": $(".updateThisChain").val() 
            },

					};

          $.ajax(ajaxOptions);
				}
			)
		}
	)