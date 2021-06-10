export { 
	default_policies, 
	index_db_config
	};




var index_db_config = [{ dbname: "sourceHostnameQueryStringPolicyDB", 
	objectstore: [
		{name:"sourceHostnameQueryStringPolicyStore",
			keyPath: "keyId", 
			autoIncrement: false, 
			index:[
				{
				n: "keyId",
				o: "keyId",  
				unique: "true" }
				]
		}
	]
},{ dbname: "sourceURLQueryStringPolicyDB", 
objectstore: [
	{name:"sourceURLQueryStringPolicyStore",
		keyPath: "keyId", 
		autoIncrement: false, 
		index:[
			{
			n: "keyId",
			o: "keyId",  
			unique: "true" }
			]
	}
]
},{ dbname: "sourceDomainQueryStringPolicyDB", 
objectstore: [
{name:"sourceDomainQueryStringPolicyStore",
	keyPath: "keyId", 
	autoIncrement: false, 
	index:[
		{
		n: "keyId",
		o: "keyId",  
		unique: "true" }
		]
}
]
},{ dbname: "destinationHostnameQueryStringPolicyDB", 
objectstore: [
{name:"destinationHostnameQueryStringPolicyStore",
	keyPath: "keyId", 
	autoIncrement: false, 
	index:[
		{
		n: "keyId",
		o: "keyId",  
		unique: "true" }
		]
}
]
},{ dbname: "destinationURLQueryStringPolicyDB", 
objectstore: [
{name:"destinationURLQueryStringPolicyStore",
	keyPath: "keyId", 
	autoIncrement: false, 
	index:[
		{
		n: "keyId",
		o: "keyId",  
		unique: "true" }
		]
}
]
},{ dbname: "destinationDomainQueryStringPolicyDB", 
objectstore: [
{name:"destinationDomainQueryStringPolicyStore",
	keyPath: "keyId", 
	autoIncrement: false, 
	index:[
		{
		n: "keyId",
		o: "keyId",  
		unique: "true" }
		]
}
]
},{ dbname: "destinationAllQueryStringPolicyDB", 
	objectstore: [
		{name:"destinationAllQueryStringPolicyStore",
			keyPath: "keyId", 
			autoIncrement: false, 
			index:[
				{
				n: "keyId",
				o: "keyId",  
				unique: "true" }
				]
		}
		]
		},{ dbname: "sourceAllQueryStringPolicyDB", 
			objectstore: [
				{name:"sourceAllQueryStringPolicyStore",
					keyPath: "keyId", 
					autoIncrement: false, 
					index:[
						{
						n: "keyId",
						o: "keyId",  
						unique: "true" }
						]
				}
				]
				}];



var default_policies = [ {
        dbname: 'destinationAllQueryStringPolicyDB',
        dbstore: 'destinationAllQueryStringPolicyStore',
        keyPath: 'keyId',
        policy: {
            keyId: 'all_urls',
            url_match: 'all_urls',
            "steps": [{
                    "procedure": "regexp",
                    "parameters": [{
                            "value": "s/(utm)_(source|campaign|medium|term|content)=[^&]*//gi",
                            "notes": "remove Google Analytigs tracking tags"
                        }
                    ],
                    "notes": "all external links"
                },{
                    "procedure": "regexp",
                    "parameters": [{
                            "value": "s/(hsa)_(acc|cam|grp|ad|net|src|ver|la|ol)=[^&]*//gi",
                            "notes": "remove HubSpot tracking tags"
                        }
                    ],
                    "notes": "all external links"
                }
            ],
            notes: 'edit outbound urls',
            createtime: '202001010001'
        }
    }

];


function generate_default_link_rules_async() {

    console.debug("generate_default_link_rules_async begin");

    // add rule objects to database
    try {
    	   return new Promise(
    	            function (resolve, reject) {
        var p = [];
        p.push(saveToIndexedDB_async('sourceAllUrlsRuleDB', 'sourceAllUrlsStore', 'keyId', {
            keyId: 'all_urls',
            url_match: 'all_urls',
            scope: 'Domain',
            steps: [{
                procedure: "regexp",
                parameters: [{
                        value: "sD^(http)Ddisabled$1Dg",
                        notes: "prefix the protocol with the word disbaled"
                    }
                ],
                notes: "disable fully qualified URLs pointing to non-local domains"
            }
        ],
            notes: 'yahoo.com pagelink sanitation policy',
            createtime: '202001010001'
        }));
        

        p.push(saveToIndexedDB_async('sourceDomainRuleDB', 'sourceDomainRuleStore', 'keyId', {
                keyId: 'google.com',
                sourceDomain: 'google.com',
                url_match: 'google.com',
                scope: 'Domain',
                direction: 'source',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sDfbclid=[^&]*DDg",
                                notes: "remove fbclid from qs"
                            }
                        ],
                        notes: "edit querystring"
                    }
                ],
                notes: 'remove tracking id from urls to thrrd parties',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('sourceDomainRuleDB', 'sourceDomainRuleStore', 'keyId', {
                keyId: 'facebook.com',
                sourceDomain: 'facebook.com',
                url_match: 'facebook.com',
                scope: 'Domain',
                direction: 'source',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sDfbclid=[^&]*DDg",
                                notes: "remove fbclid from qs"
                            }
                        ],
                        notes: "tracking token from querystring"
                    },{
                        procedure: "regexp",
                        parameters: [{
                                value: "s/(utm|hsa)_(source|campaign|medium|term|content)=[^&]*//g",
                                notes: "delete parameters with names starting with utm_ and hsa_ and ending in source|campaign|medium|term|content"
                            }
                        ],
                        notes: "remove suspicious parameters from querystring"
                    }
                ],
                notes: 'remove tracking id from all URLs',
                createtime: '202001010001'
            }));

        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.linkedin.com/',
                sourceFulldomain: 'https://www.linkedin.com/',
                url_match: 'https://www.linkedin.com/',
                scope: 'Fulldomain',
                direction: 'source',
                 steps: [{
                    procedure: "regexp",
                    parameters: [{
                            value: "s/(utm|hsa)_[a-z]*=[^&]*//g",
                            notes: "delete parameters with names starting with utm_ and hsa_"
                        }
                    ],
                    notes: "remove suspicious parameters from querystring"
                }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
     

  
         
         
        console.debug(p);
        // Using .catch:
        Promise.all(p)
        .then(values => {
            console.debug(values);
            resolve(values);
        })
        .catch(error => {
            console.error(error.message)
        });    	            });
    } catch (f) {
        console.debug(f);
    }
}


function indexeddb_setup_async(indexedDB) {
    console.debug("# indexeddb_setup_async start");
    return new Promise(
        function (resolve, reject) {


        try {
            var p = [];

            for (var i = 0; i < index_db_config.length; i++) {

                p.push(create_indexeddb_async(indexedDB, index_db_config[i]));
            }

            // Using .catch:
            Promise.all(p)
            .then(values => {
                console.debug(values);
                
                resolve(values);
            })
            .catch(error => {
                console.error(error.message)
            });
        } catch (f) {
            console.error(f);
        }
    });

}

