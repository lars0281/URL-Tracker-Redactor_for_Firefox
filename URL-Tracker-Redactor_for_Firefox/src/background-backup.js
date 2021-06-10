
console.debug("start URL-Tracker-Redactor background");

let salt;

let db;

let indexedDB;

// databases:

// May 15 2021


/*
 * Apply rules to determine where link end up. Some links result in redirect,
 * but in the querystring there are values to indicate what the redirect URL
 * will be. Use rules to compute this URL without having to call the URL.
 * 
 * Lookup link to check if ends in a redirect (use HTTP HEAD method)
 * 
 
 * 
 * 
 */



//add listener to open the admin page when user clicks on the icon in the
//toolbar
browser.browserAction.onClicked.addListener(() => {
 // use this functionality to get a full tabpage
 browser.tabs.create({
     url: "/rule-admin.html"
 });
 // Can replace the above with a direct referal to the html, in the manifest.
 // - but this would not provide a full tab-page
 // "brower_action": {
 // "default_popup": "navigate-collection.html"

});


var in_memory_policies = {};

in_memory_policies["sourceAlllRuleDB"] = {};
in_memory_policies["sourceUrlRuleDB"] = {};
in_memory_policies["sourceDomainRuleDB"] = {};
in_memory_policies["sourceHostnameRuleDB"] = {};
in_memory_policies["destinationUrlRuleDB"] = {};
in_memory_policies["destinationDomainRuleDB"] = {};
in_memory_policies["destinationHostnameRuleDB"] = {};



var index_db_config = [{
    dbname: "sourceAllPolicyDB",
    objectstore: [{
            name: "sourceAllPolicyStore",
            keyPath: "keyId",
            autoIncrement: false,
            index: [{
                    n: "keyId",
                    o: "keyId",
                    unique: "true"
                }
            ]
        }
    ]
},{ dbname: "sourceFulldomainRuleDB", 
	objectstore: [
		{name:"sourceFulldomainRuleStore",
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
},{ dbname: "sourceUrlRuleDB", 
objectstore: [
	{name:"sourceUrlRuleStore",
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
},{ dbname: "sourceDomainRuleDB", 
objectstore: [
{name:"sourceDomainRuleStore",
	keyPath: "refId", 
	autoIncrement: false, 
	index:[
		{
		n: "refId",
		o: "refId",  
		unique: "true" }
		]
}
]
},{ dbname: "destinationFulldomainRuleDB", 
objectstore: [
{name:"destinationFulldomainRuleStore",
	keyPath: "refId", 
	autoIncrement: false, 
	index:[
		{
		n: "refId",
		o: "refId",  
		unique: "true" }
		]
}
]
},{ dbname: "destinationUrlRuleDB", 
objectstore: [
{name:"destinationUrlRuleStore",
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
},{ dbname: "destinationDomainRuleDB", 
objectstore: [
{name:"destinationDomainRuleStore",
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
}
];




// processing rules related

var steps = [];

// only regexp procedures are accepted at this point

steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "utm_source",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove Google Analytics tags"
});

steps.push({
    procedure: "qs_remove_param",
    parameters: [{
        value: "utm_campaign",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove Google Analytics tags"
});
steps.push({
    procedure: "qs_remove_param",
    parameters: [{
        value: "utm_medium",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove Google Analytics tags"
});
steps.push({
    procedure: "qs_remove_param",
    parameters: [{
        value: "utm_term",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove Google Analytics tags"
});
steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "utm_content",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove Google Analytics tags"
});




steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_acc",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});
steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_cam",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});


steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_grp",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});


steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_ad",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});

steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_net",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});


steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_src",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});

steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_ver",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});

steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_la",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});

steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "hsa_ol",
            notes: ""
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});


steps.push({
    procedure: "qs_remove_param",
    parameters: [{
            value: "li_fat_id",
            notes: "Edit querystring to remove tracking id from linkind"
        }
    ],
    notes: "Edit querystring to remove linkedin tracking tags"

});




//all default rules/policies
var default_policies = [ {
     dbname: 'sourceAllPolicyDB',
     dbstore: 'sourceAllPolicyStore',
     keyPath: 'keyId',
     policy: {
         keyId: 'all_urls',
         url_match: 'all_urls',
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
             }, {
                 procedure: "regexp",
                 parameters: [{
                         value: "s/(utm|hsa)_[a-z]*=[^&]*//g",
                         notes: "delete parameters with names starting with utm_ and hsa_"
                     }
                 ],
                 notes: "remove suspicious parameters from querystring"
             }
         ],
         notes: 'remove tracking id from urls to thrrd parties',
         createtime: '202001010001'
     }
 }];

/*
 * list of query string parameter which are removed
 * 
 * 
 * */



// context menu related





var EXLUDE_ITEMS = {};
var WEBREQUEST_DATA = {};
var capture_checkbox = true;
var auto_scroll_checkbox = true;
StorageChange();



browser.webRequest.onBeforeRequest.addListener(
  function(test) {
	  console.debug("browser.webRequest.onBeforeRequest" );
	  console.debug("browser.webRequest.onBeforeRequest" + test);
    test["typ"] = "onBeforeRequest";
    //setdata_webRequest(test);
    //console.debug(computed_urlfilters(steps));
    return {redirectUrl: computed_redirect_url(test)};
    //return { redirectUrl: 'http://www.google.com' }
  },
  {
	  // compute the - potentially long - list of filters from the rewrite step rules (all of type qs_remove_param)
//urls: ["*://*/*&utm_source=*", "*://*/*&utm_campaign=*", "*://*/*&utm_medium=*", "*://*/*&utm_term=*", "*://*/*&utm_content=*" ]
	  	 urls: computed_urlfilters(steps)
//    urls: ["<all_urls>"]
  },
  ["blocking"]
);
// "blocking"  "requestBody"



indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.msIndexedDB;



var request = indexedDB.open("destinationUrlRuleDB", 1);
request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.debug("create objectstore destinationUrlRuleStore in destinationUrlRuleDB");
    var objectStore2 = db.createObjectStore('destinationUrlRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request.onerror = function (event) {
    console.debug("dp open request error 201");
};
request.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.debug("db open request error 2");
    };
    db.onsuccess = function (event) {
        console.debug("db open request success 2");
    };
};


// url match syntax
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns

function computed_urlfilters(steps) {
	 console.debug("#computed_urlfilters" );
	 
	 // loop through all steps to get which querystring parameters are in scope for removal
	 var reg = /qs/i;
	 var filter = [];
	 try{
	 for (var i = 0; i < steps.length; i++){
		    var obj = steps[i];
		   // console.debug(JSON.stringify(obj));
		    
		    // only accept the qs_remove_param procedure
		   // console.debug( "->" + obj.procedure + "<-");
//		    console.debug( reg.test(obj.procedure ));
		    if (reg.test(obj.procedure )){
//		    	console.debug("£££££");
//console.debug(obj.parameters);
//console.debug(obj.parameters[0]);
//console.debug(obj.parameters[0].value);
			   
		    	// anchor with "&"
			    filter.push("*://*/*&" + obj.parameters[0].value +  "=*");
		    	// anchor with "?"
			    filter.push("*://*/*?" + obj.parameters[0].value +  "=*");

		    }
		    
		}
}catch(h){
	 console.error(h);
}
console.debug("url match");
console.debug(filter);
return filter;
}

function computed_redirect_url(e) {
	 console.debug("#setdata_webRequest" );
	 console.debug(e);
	 console.debug(JSON.stringify(e));
	 
	 var url = e.url;
	 
	 var new_url = url;
	 try{
	 
	  // loop through all steps (rewrite rules) maximum of 100 steps
    var i = 0;
    while (i < 100 && i < steps.length){
    	new_url = execute_rule_step(steps[i],new_url );
    	//console.debug('#applying step: '+ JSON.stringify(steps[i]) + "to" + new_url );
    
    	i++;
    }
    
	 }catch(h){
		 console.error(h);
	 }
    console.info('URL-Tracker-Redactor replaces "' +e.url + '" with this URL: "' + new_url + '"');
    return new_url;
    
}

function setdata_webRequest(e) {
	 console.debug("#setdata_webRequest" );
	 console.debug(e);
	 console.debug(JSON.stringify(e));
	 
	 var url = e.url;
	 
	 var new_url = url;
	 try{
	 
	  // loop through all steps (rewrite rules)
     var i = 0;
     while (i < 12 && i < steps.length){
     	new_url = execute_rule_step(steps[i],new_url );
     	console.debug('URL-Tracker-Redactor replaces "' + qs + '" with this URL: "' + new_url + '"');
     
     	i++;
     }
     
	 }catch(h){
		 console.error(h);
	 }
     console.log('URL-Tracker-Redactor replaces "' + origin.href + '" with this URL: "' + new_url + '"');

     e.url = new_url;
     console.debug(JSON.stringify(e));
     // issue a immediate redirect to the redacted URL.
	 
  if (capture_checkbox == true) {
		 console.debug("capture_checkbox = true" );
    if (not_on_exlude_list(e.url)) {
		 console.debug("not on exclude list" );

    	if (e.requestId.indexOf("fakeRequest") >= 0) {
        return;
      }
      i = 0;
      if (WEBREQUEST_DATA[e.requestId] == undefined) {
        WEBREQUEST_DATA[e.requestId] = [];
      }
      while (true) {
        if (e.typ == "onCompleted" || e.typ == "onResponseStarted") {
          i = WEBREQUEST_DATA[e.requestId].length - 1;
          WEBREQUEST_DATA[e.requestId][i][e.typ] = e;
          break;
        }
        if (WEBREQUEST_DATA[e.requestId][i] == undefined) {
          WEBREQUEST_DATA[e.requestId][i] = {};
        }
        if (WEBREQUEST_DATA[e.requestId][i][e.typ] != undefined) {
          i++;
        } else {
          WEBREQUEST_DATA[e.requestId][i][e.typ] = e;
          break;
        }
      }
      set_data_html(e.requestId, i, e.typ);
    }else{
		 console.debug("is on exclude list" );

    }
  }else{
		 console.debug("capture_checkbox = false" );

  }
}



function notify(request) {
	 console.debug("#notify" );
  console.debug(request.data)
  data = request.data;
  for (value in data) {
    //checked
    if (value == "onBeforeRequest") {
      document.getElementById("select_method").value = data[value].method;
      document.getElementById("header_url").value = data[value].url;
      string = "";
      if (data[value].requestBody != undefined) {
        if (data[value].requestBody.formData != undefined) {
          for (var i in data[value].requestBody.formData) {
            string += i + "=" + data[value].requestBody.formData[i] + "&";
          }
          string = string.substr(0, string.length - 1);
        } else if (data[value].requestBody.raw != undefined) {
          utf8decode = new TextDecoder("utf-8");
          string = utf8decode.decode(data[value].requestBody.raw[0].bytes);
        }
      }
      document.getElementById("post_data").textContent = string;
      document.getElementById("content_length_label").textContent =
        browser.i18n.getMessage("content_length_label") + string.length;
    } else if (value == "onSendHeaders") {
      string = "";
      for (var i of data[value].requestHeaders) {
        string += i.name + ": " + i.value + "\r\n";
      }
      document.getElementById("header_data").textContent = string;
    } else if (value == "onAuthRequired") {
    } else if (value == "onErrorOccurred") {
    }
  }
}

function replay_send() {
	 console.debug("#replay_send" );
  url = document.getElementById("header_url").value;
  method = document.getElementById("select_method").value;
  post = document.getElementById("post_data").textContent;
  header = document.getElementById("header_data").textContent,
    //console.log(header)
    (temp_headers = header.replace(/\r\n/g, "<br>"));
  temp_headers = temp_headers.split("<br>");
  //console.log(temp_headers)
  // The data we are going to send in our request
  var myHeaders = new Headers();
  for (temp_header of temp_headers) {
    split = temp_header.split(": ", 2);
    //console.log(split)
    if (split != "") {
      myHeaders.append(split[0], split[1]);
    }
  }
  data = {
    method: method
  };
  if (method != "GET") {
    //console.log(post ,":",post.length,":", method)
    myHeaders.delete("Content-type");
    myHeaders.append(
      "Content-type",
      "application/x-www-form-urlencoded;charset=UTF-8"
    );
    //console.log(post ,":",post.length,":", method)
    if (post.length != 0) {
      data.body = post;
    }
  }
  data.headers = myHeaders;
  fetch(url, data)
    .then(function(response) {
      response.blob().then(function(data) {
        objectURL = URL.createObjectURL(data);
        //console.log(objectURL);
        if (RESEND_TAB_NEW == true) {
          if (RESENDED_TAB == true) {
            tab_exists(objectURL);
          } else {
            RESENDED_TAB = true;
            tab_create(objectURL);
          }
        } else {
          tab_exists(objectURL);
        }
      });
    })
    .catch(function(err) {
      console.error("Fetch Error:", err);
    });
}

function tab_create(objectURL) {
	 console.debug("#tab_create" );
  browser.windows.getAll(
    {
      windowTypes: ["normal"]
    },
    function(getwindows) {
      //console.log(getwindows)
      for (windows of getwindows) {
        if (windows.type == "normal") {
          WINDOW_ID = windows.id;
          break;
        }
      }
      browser.tabs.create(
        {
          windowId: WINDOW_ID,
          url: objectURL
        },
        function(tab) {
          if (browser.runtime.lastError) {
            onError(browser.runtime.lastError);
          } else {
            TAB_ID = tab.id;
          }
        }
      );
    }
  );
}

function tab_exists(objectURL) {
	 console.debug("#tab_exists" );
  browser.tabs.get(TAB_ID, function() {
    if (browser.runtime.lastError) {
      tab_create(objectURL);
    } else {
      browser.tabs.update(
        TAB_ID,
        {
          url: objectURL
        },
        function() {
          //browser.tabs.create({url: bloburl} , function (){
          if (browser.runtime.lastError) {
            onError(browser.runtime.lastError);
          }
        }
      );
    }
  });
}

function StorageChange() {
	 console.debug("#StorageChange" );
  //console.log("New Storage")
  gettingItem = browser.storage.local.get(function(item) {
    if (item["new_tab_open"] == true) {
      RESEND_TAB_NEW = true;
    } else {
      RESEND_TAB_NEW = false;
    }
  });
}

function onError(error) {
  console.error("Error:", error);
  alert("Error:" + error);
}
browser.storage.onChanged.addListener(StorageChange);
browser.runtime.onMessage.addListener(notify);
document
  .getElementById("replay_send_button")
  .addEventListener("click", replay_send);
document.getElementById("post_data").addEventListener("input", function() {
  document.getElementById("content_length_label").textContent =
    browser.i18n.getMessage("content_length_label") +
    document.getElementById("post_data").textContent.length;
});



indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.msIndexedDB;

// listener for message sent from the admin page of the plugin
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	   console.debug("message:" + JSON.stringify(message));
	   console.debug("sender:" + JSON.stringify(sender));
	   console.debug("sendResponse:" + sendResponse);

    console.debug("received from page:  message: " + JSON.stringify(message) + " message.type=" + message.type);

    
    console.debug("request:" + message[0]);
    console.debug("request:" + message.request);

    console.debug("request:" + JSON.stringify(message.request));
    console.debug("request:" + JSON.stringify(message.request.sendRule));

    console.debug("request:" + message.request.sendRule);

    console.debug("request:" + message.linkurl);

    try {

        if (message.request.sendRule == 'toEditPopup') {
            console.debug("contact edit popup:");

            var page_message = message.message;
            console.debug("page_message:" + page_message);
            // Simple example: Get data from extension's local storage
            // var result = localStorage.getItem('whatever');
            
            
            
            var result = JSON.parse('{"test":"one"}');
            // Reply result to content script
            sendResponse(result);
        }

    
} catch (e) {
    console.debug(e);
}

    try {

    	// make call to rule editing popup containing the rule to display in it.
    	
    	
    	
    	
        if (message && message.type == 'page') {
            console.debug("page_message:");
            var page_message = message.message;
            console.debug("page_message:" + page_message);
            // Simple example: Get data from extension's local storage
            // var result = localStorage.getItem('whatever');
            var result = JSON.parse('{"test":"one"}');
            // Reply result to content script
            sendResponse(result);
        }

        if (message && message.request == 'skinny_lookup' && message.linkurl != '') {
            console.debug("look up :" + message.linkurl);
            var true_destination_url = "";
            true_destination_url = skinny_lookup(message.linkurl);
            sendResponse({
                true_destination_url: true_destination_url,
                linkUrl: message.linkurl,
                success: "true"
            });
        }
    } catch (e) {
        console.debug(e);
    }

});

if (!window.indexedDB) {
    console.debug("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
} else {
    console.debug("1.1.0");
}

let pendingCollectedUrls = [];

browser.contextMenus.onClicked.addListener((info, tab) => {
    console.debug("background.js: browser.contextMenus.onClicked.addListener");
    console.debug("background.js: browser.contextMenus.onClicked.addListener:info:" + JSON.stringify(info));
    console.debug("background.js: browser.contextMenus.onClicked.addListener:tab:" + JSON.stringify(tab));

    /*
	 * When the user has selected from the context meny to revel the true end
	 * point of a url
	 * 
	 */
    if (info.menuItemId == "glovebox-link-reveal") {
        console.debug("glovebox-link-reveal");
        // console.debug(info);
        // console.debug(tab);
        reveal_true_url_endpoint(info, tab);

    }else if (info.menuItemId == "selected-text-lookup") {
        console.debug("selected-text-lookup");
        // console.debug(info);
        // console.debug(tab);
        selected_text_lookup(info, tab);

    }

    
    
    
    
    console.debug("#### request completed");
});

// add listener to open the admin page when user clicks on the icon in the
// toolbar
browser.browserAction.onClicked.addListener(() => {
    // use this functionality to get a full tabpage
    browser.tabs.create({
        url: "/rule-admin.html"
    });
    // Can replace the above with a direct referal to the html, in the manifest.
    // - but this would not provide a full tab-page
    // "brower_action": {
    // "default_popup": "navigate-collection.html"

});


var request = indexedDB.open("sourceFulldomainRuleDB", 1);
request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.debug("create objectstore sourceFulldomainRuleStore in sourceFulldomainRuleDB");
    var objectStore2 = db.createObjectStore('sourceFulldomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request.onerror = function (event) {
    console.debug("dp open request error 201");
};
request.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.debug("db open request error 2");
    };
    db.onsuccess = function (event) {
        console.debug("db open request success 2");
    };
};

var request2 = indexedDB.open('sourceUrlRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.debug("background.js: create objectstore sourceUrlRuleStore in sourceUrlRuleDB");
    var objectStore2 = db.createObjectStore('sourceUrlRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.debug("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.debug("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.debug("background.js: db open request success 2");
    };
};

// create database
request2 = indexedDB.open('sourceDomainRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.debug("background.js: create objectstore sourceDomainRuleStore in sourceDomainRuleDB");
    objectStore2 = db.createObjectStore('sourceDomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.debug("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.debug("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.debug("background.js: db open request success 2");
    };
};

// create
request2 = indexedDB.open('destinationDomainRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.debug("background.js: create objectstore destinationDomainRuleStore in destinationDomainRuleDB");
    objectStore2 = db.createObjectStore('destinationDomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.debug("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.debug("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.debug("background.js: db open request success 2");
    };
};

// create
// create
request2 = indexedDB.open('destinationFulldomainRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.debug("background.js: create objectstore destinationFulldomainRuleStore in destinationFulldomainRuleDB");
    objectStore2 = db.createObjectStore('destinationFulldomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.debug("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.debug("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.debug("background.js: db open request success 2");
    };
};

// create destinationUrlRuleDB
var request6 = indexedDB.open('destinationUrlRuleDB', 1);
request6.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.debug("background.js: create objectstore destinationUrlRuleStore in destinationUrlRuleDB");
    var objectStore6 = db.createObjectStore('destinationUrlRuleStore', {
            keyPath: 'keyId'
        });

    objectStore6.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request6.onerror = function (event) {
    console.debug("background.js: dp open request error 201");
};
request6.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.debug("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.debug("background.js: db open request success 2");
    };
};



// add defaults

generate_default_link_rules();


function skinny_lookup(url, info) {
    console.debug("#start: skinny_lookup: " + url);
    var true_destination_url = "";
    var xhr = new XMLHttpRequest();
    // mark "false" to indicate synchronous
    try {
        xhr.open('HEAD', url, false);
        // request plain text return to look for http-based redirects too
        // xhr.responseType = 'blob';
    } catch (e) {
        console.debug(e);
    }
    try {
        xhr.onload = function () {
            console.debug(xhr);

            // check for a Location HTTP header in the response
            console.debug(xhr);
            true_destination_url = xhr.responseURL;
        };
    } catch (e) {
        console.debug(e);
    }
    xhr.onerror = () => console.debug(xhr.statusText);
    try {

        xhr.send();
    } catch (e) {
        // console.debug(xhr);
        console.debug(e);
    }

    try {

        return true_destination_url;
    } catch (e) {
        // console.debug(xhr);
        console.debug(e);
    }
}




/*
 * 
 */

function selected_text_lookup(info, tab) {
	  console.debug("#start: selected_text_lookup");
	  console.debug(info);
	  console.debug(tab);
}

// receive notice when user rightclick on a link and selects "reveal the true
// endpoint of URL"

// make call back to page script to run additonal code


function reveal_true_url_endpoint(info, tab) {
 // console.debug("#start: reveal_true_url_endpoint");
 // console.debug(info);
 // console.debug(tab);

  // console.debug("###calling ");
    // console.debug(destination_url_rules);

    // information on which link was selected, use this to correctly
    // identify it in the content script.

    var tabId = tab.id;
    var frameId = info.frameId;
    var targetElementId = info.targetElementId;

    var linkUrl = info.linkUrl;
    var linkText = info.linkText;

    console.debug("urlendpoint: " + info.linkUrl);
   // console.debug("tabId: " + tabId);

    console.debug("location page: " + info.pageUrl);

    var true_destination_url = "";

    // setup a ruleset. With some default values and adilito for user to
    // configure automatic behaviour.


    var new_url = info.linkUrl;
   // console.debug("#### " + new_url);

    // apply rules to generate new URL. The rules are a collection of
    // rewrite statements applied to the submitted URL.
    // The rules are scoped in two ways: by source/destination and complete
    // URL (protocol fully-qualified domain port path), full domain
    // (protocol fully-qualified domain port ) and domain ( domain port )
    // The rewrite rules are applied in sequentially.

    // The source rules (if any) are applied first.

    // Then the destination rules are applied. And on top of any changes
    // made previosuly.

    // Two URLs are submitted: the URL of the page where the link is found,
    // and the link itself.


    // new_url = "";
    rules_enforcement(info.pageUrl, new_url).then(function(re){
    	  // console.debug("#### " + re);

  		new_url = re;
    	
    
    console.debug("#### after first rewrite: " + new_url);
    // if the rules caused the URL to be changed, there might also be rules
    // governing the new URL, so run through it again.

    return rules_enforcement(info.pageUrl, new_url);
    }).then(function (re){
    	new_url = re;
    console.debug("#### after second rewrite: " + new_url);
    

    // new_url = rules_enforcement(info.pageUrl ,new_url);
    // console.debug("#### " + new_url);

    // Call the URL by default if not rules applies to the URL.
    // If the URL has not been changed, assume no rule pertained to it, so
    // look it up directly.


    // console.debug("true_destination_url: " + true_destination_url );


    // check linkURL against URL


    // send message back to the content script with this info

    return getRedirectUrl(new_url);

}).then(function (url) {

        // verify that the URL satify the minimum requirements
        var url_wellformed_regexp = /.*/i;

        // console.debug(url_wellformed_regexp);
        // console.debug("url_wellformed_regexp.text("+url+"): " +
        // url_wellformed_regexp.test(url));
        if (url.length > 9 && url_wellformed_regexp.test(url)) {
            true_destination_url = url;
        } else {
            true_destination_url = new_url;
        }

        // make attempt to clean the URL returned. In case of URL shorteners,
        // any manner of "villany" may be lurking
        
        return rules_enforcement(info.pageUrl, true_destination_url);
    }).then(function (res) {
console.debug(res);
         true_destination_url = res;
        

        return browser.tabs.executeScript(tabId, {
            file: "content_scripts/RevealUrl.js",
            frameId: frameId
        });

    }).then(function (result) {

        // query for the one active tab
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });

    }).then(function (tabs) {
// console.debug(tabs);
        // send message back to the active tab
        console.debug("#call back to content script");
        return browser.tabs.sendMessage(tabs[0].id, {
            targetElementId: targetElementId,
            true_destination_url: true_destination_url,
            linkText: linkText,
            linkUrl: linkUrl,
            success: "true"
        });
        // }).then(function (res) {
        // console.debug("###### getHTML response " + JSON.stringify(res));
        // glovebox_token_ciphertext = res.response.token;

    });

}

function getRedirectUrl(url) {
    // console.debug("##### getRedirectUrl.start: " + url);
    try {
        var p = new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, true);
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    // resolve(xhr.response);
                    var reader = new FileReader();
                    console.debug(xhr.response);
                    console.debug(xhr);

                    // check for a Location HTTP header in the response
                    // console.debug(xhr.responseURL);

                    var redirectURL = "";

                    redirectURL = xhr.responseURL;
                    // consider also looking for a html-based redirect in the
                    // body of the retruend document.

                    // consider making this recursive, by calling the redirect
                    // URL to see if it results in another redirect


                    reader.readAsDataURL(xhr.response);
                    reader.onload = function (e) {

                        resolve(redirectURL);

                    };

                };

                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
            });
        return p;
    } catch (e) {
        console.debug(e);
    }
}

function rules_enforcement(sourcePageUrl, url) {

	// console.debug("# rules_enforcement begin");
	// console.debug("sourcePageUrl: " + sourcePageUrl);
	// console.debug("url: " + url);
	
    // apply rules to generate new URL. The rules are a collection of
    // rewrite statements applied to the submitted URL.
    // The rules are scoped in two ways: by source/destination and complete URL
    // (protocol fully-qualified domain port path), full domain (protocol
    // fully-qualified domain port ) and domain ( domain port )
    // The rewrite rules are applied in sequentially.

    // The source rules (if any) are applied first.

    // Then the destination rules are applied. And on top of any changes made
    // previosuly.

    // Two URLs are submitted: the URL of the page where the link is found, and
    // the link itself.


    var new_url = url;
    
    return new Promise(
            function (resolve, reject) {

            	console.debug("# rules_enforcement begin promise");

    // start with source-based rules.
    // these are rules based on the the url of the "page" where the links are
    // located.
    console.debug("source based rewriting");
    // new_url = circumstantial_rules_enforcement(window.location.href,
    // new_url,source_url_rules,source_fulldomain_rules,source_domain_rules);
    // new_url = source_rules_enforcement(sourcePageUrl, new_url,
	// source_url_rules,
    // source_fulldomain_rules, source_domain_rules);

    source_rules_enforcement(sourcePageUrl, new_url).then(function (two) {
        new_url = two;
        console.debug(new_url);
        // then do destination-based rules
        // note that this is in addition to any changes made above.
           return destination_rules_enforcement(new_url, new_url);
    }).then(function(n){
        new_url = n;

    console.debug(new_url);

	console.debug("# rules_enforcement promise resolved");

    resolve(new_url);
    });
            });
    
}


// enforce rules that pertain to links found on the specified address.
function source_rules_enforcement(location, linkurl) {

	console.debug("# source_rules_enforcement begin");
	
    var new_url = linkurl;

    return new Promise(
        function (resolve, reject) {
        	console.debug("# source_rules_enforcement begin promise");

        // use this to lookup any rules that may apply to links found on the
		// page of
        // this url
        var protocolfulldomainportpath = "";
        protocolfulldomainportpath = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2$3');

        var protocolfulldomainport = "";
        protocolfulldomainport = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2');

        // lookup rules for this location domain ("top"-level example domain.com
		// )
        // ignoring the first word in the fully qualified domain name

        var domainport = "";
        domainport = location.replace(/^http[s]*:\/\/[^\.]*\.([^\/]*)\/([^\?]*).*/i, '$1');

        // sourceDomainRuleStore in sourceDomainRuleDB
        // sourceFulldomainRuleStore in sourceFulldomainRuleDB
        // create objectstore sourceUrlRuleStore in sourceUrlRuleDB");
        console.debug("lookup: " + domainport);
        
        try {

            loadFromIndexedDB_async("sourceDomainRuleDB", "sourceDomainRuleStore", domainport).then(function (three) {
                console.debug("########## 0");
          // console.debug(three);

                if (three) {
            console.debug("carry out rule on: " + new_url);
                    new_url = execute_rule(three, new_url);
                }

                // if anything returned, apply it

                // proceed with looking for more rules scopde for
				// protocolfulldomainport

                return loadFromIndexedDB_async("sourceFulldomainRuleDB", "sourceFulldomainRuleStore", protocolfulldomainport);
            }).then(function (one) {

                console.debug("########## 1");
           // console.debug(one);
                if (one) {
                    console.debug("carry out rule on: " + new_url);
                    new_url = execute_rule(one, new_url);

                }

                return loadFromIndexedDB_async("sourceUrlRuleDB", "sourceUrlRuleStore", protocolfulldomainportpath);
            }).then(function (two) {
                console.debug("########## 2");
            // console.debug(two);
                if (two) {
                    console.debug("carry out rule on: " + new_url);
                    new_url = execute_rule(two, new_url);
                }

                console.debug("# # # #  resolve new_url: " + new_url);
            	console.debug("# source_rules_enforcement promise resolved");

                resolve(new_url);

            });

        } catch (e) {
            console.debug(e);

            console.debug("# # # # new_url: " + new_url);
        	console.debug("# source_rules_enforcement promise resolved");
            resolve(new_url);

        }

    });

}


function destination_rules_enforcement(location, linkurl){
	
	/*
	 * This is subject to rewriting, for now, accept the parameter for the
	 * location of the link to be rewritten, but do not use the value for
	 * anything
	 */
	
console.debug("# destination_rules_enforcement begin");
	
    var new_url = linkurl;

    return new Promise(
        function (resolve, reject) {
        	console.debug("# destination_rules_enforcement begin promise");

        // use this to lookup any rules that may apply to links found on the
		// page of
        // this url
        var protocolfulldomainportpath = "";
        protocolfulldomainportpath = linkurl.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2$3');

        var protocolfulldomainport = "";
        protocolfulldomainport = linkurl.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2');

        // lookup rules for this location domain ("top"-level example domain.com
		// )
        // ignoring the first word in the fully qualified domain name

        var domainport = "";
        domainport = linkurl.replace(/^http[s]*:\/\/[^\.]*\.([^\/]*)\/([^\?]*).*/i, '$1');

        // sourceDomainRuleStore in sourceDomainRuleDB
        // sourceFulldomainRuleStore in sourceFulldomainRuleDB
        // create objectstore sourceUrlRuleStore in sourceUrlRuleDB");
        console.debug("lookup: " + domainport);
        
        try {

            loadFromIndexedDB_async("destinationDomainRuleDB", "destinationDomainRuleStore", domainport).then(function (three) {
                console.debug("########## 0");
          // console.debug(three);

                if (three) {
            console.debug("carry out rule on: " + new_url);
                    new_url = execute_rule(three, new_url);
                }

                // if anything returned, apply it

                // proceed with looking for more rules scopde for
				// protocolfulldomainport

                return loadFromIndexedDB_async("destinationFulldomainRuleDB", "destinationFulldomainRuleStore", protocolfulldomainport);
            }).then(function (one) {

                console.debug("########## 1");
           // console.debug(one);
                if (one) {
                    console.debug("carry out rule on: " + new_url);
                    new_url = execute_rule(one, new_url);

                }

                return loadFromIndexedDB_async("destinationUrlRuleDB", "destinationUrlRuleStore", protocolfulldomainportpath);
            }).then(function (two) {
                console.debug("########## 2");
            // console.debug(two);
                if (two) {
                    console.debug("carry out rule on: " + new_url);
                    new_url = execute_rule(two, new_url);
                }

                console.debug("# # # #  resolve new_url: " + new_url);
            	console.debug("# destination_rules_enforcement promise resolved");

                resolve(new_url);

            });

        } catch (e) {
            console.debug(e);

            console.debug("# # # # new_url: " + new_url);
        	console.debug("# destination_rules_enforcement promise resolved");
            resolve(new_url);

        }

    });

	
}



function execute_rule_set(rule_set, url) {
   // console.debug("execute_rule_set");
   // console.debug(rule_set);
    var new_url = "";
    new_url = url;
    for (let m = 0; m < rule_set.length; m++) {
        new_url = execute_rule_step(rule_set[m], new_url);
    }
    return new_url;
}



function loadFromIndexedDB_async(dbName, storeName, id) {
  // console.debug("loadFromIndexedDB:0");
  // console.debug("loadFromIndexedDB:1 " + dbName);
  // console.debug("loadFromIndexedDB:2 " + storeName);
  // console.debug("loadFromIndexedDB:3 " + id);

    return new Promise(
        function (resolve, reject) {
        var dbRequest = indexedDB.open(dbName);

        dbRequest.onerror = function (event) {
            reject(Error("Error text"));
        };

        dbRequest.onupgradeneeded = function (event) {
            // Objectstore does not exist. Nothing to load
            event.target.transaction.abort();
            reject(Error('Not found'));
        };

        dbRequest.onsuccess = function (event) {
            // console.debug("loadFromIndexedDB:onsuccess ");

            var database = event.target.result;
            var transaction = database.transaction([storeName]);
            // console.debug("loadFromIndexedDB:transaction: " +
            // JSON.stringify(transaction));
            var objectStore = transaction.objectStore(storeName);
            // console.debug("loadFromIndexedDB:objectStore: " +
            // JSON.stringify(objectStore));
            var objectRequest = objectStore.get(id);

            // console.debug("loadFromIndexedDB:objectRequest: " +
            // JSON.stringify(objectRequest));


            try {

                objectRequest.onerror = function (event) {
                    // reject(Error('Error text'));
                    reject('Error text');
                };

                objectRequest.onsuccess = function (event) {
                    if (objectRequest.result) {
   // console.debug("loadFromIndexedDB:result " +
	// JSON.stringify(objectRequest.result));

                        resolve(objectRequest.result);
                    } else {
                        // reject(Error('object not found'));
                        resolve(null);

                    }
                };

            } catch (error) {
                console.debug(error);

            }

        };
    });
}


function execute_rule(rule, url) {
    var new_url = "";
    new_url = url;
    try {
    // console.debug("execute_rule url: " + url);
    // console.debug("execute_rule rule: " + JSON.stringify(rule));
    // console.debug("execute_rule: " + JSON.stringify(rule.steps));
    // console.debug("execute_rule: " + rule.steps.length);
        // loop through the steps contained in this rule
        // step-order is essential
        // the output of one is the input of the next

        for (var i = 0; i < rule.steps.length; i++) {
   // console.debug("### apply step: " + JSON.stringify(rule.steps[i]) + " to " +
	// new_url);
            new_url = execute_rule_step(rule.steps[i], new_url);
        }
   // console.debug("### apply step: " + rule + " to " + new_url);
    } catch (e) {}
    return new_url;
}

function execute_rule_step(rule_step, url) {
 // console.debug("execute_rule_step");
    var new_url = "";
    new_url = url;
 // console.debug("### apply step: " + JSON.stringify(rule_step) + " to " +
	// new_url);

    // syntax is STEP NAME ( PARAMETER VALUE)
    var step_name = ""

        step_name = rule_step.procedure;
    // var param_regexp = /\(/;
    // if (param_regexp.test(rule_step)) {
    // parameter_value = rule_step.replace(/[^(]*\(/i, '').replace(/\) *$/i,
    // '');
    // }
    console.debug("step_name: " + step_name);
    var parameter_value = "";
    try {
        // consider only cases with at most a single parameter
        parameter_value = rule_step.parameters[0].value;

    } catch (e) {}

 
    console.debug("parameter_value: " + parameter_value);
    switch (step_name) {
    case 'regexp':
        try {
            // make allowances for g and i settings
            // Parse parameter which follows the sed-syntax
            // This means that the second character is the delimiter
            var delimiter = "";
            delimiter = parameter_value.replace(/^s(.).*/i, '$1');
            var flags_ext = new RegExp("[s]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "(.*)$");
            //console.debug("flags_ext: " + flags_ext);
            var flags = "";
            flags = parameter_value.replace(flags_ext, '$1').replace(/ /g, '');
            // console.debug("flags: " + flags);
            var pattern_ext = new RegExp("[s]*" + delimiter + "([^" + delimiter + "]*)" + delimiter + ".*$");
            // console.debug("pattern_ext: " + pattern_ext);
            var pattern = "";
            pattern = parameter_value.replace(pattern_ext, '$1');
            // console.debug("pattern: " + pattern);
            var val_ext = new RegExp(".*" + delimiter + "([^" + delimiter + "]*)" + delimiter + "[ gi]*$");
            var val = "";
            val = parameter_value.replace(val_ext, '$1');
            // console.debug("val_ext: " + val_ext)
            // console.debug("return val: " + val)
            // console.debug(new RegExp(pattern, flags));
            new_url = new_url.replace(new RegExp(pattern, flags), val);
        } catch (e) {
            console.debug(e);
        }
        break;
    case 'qs_param':
        // console.debug(new_url);
        // console.debug("get query string parameter named: " + parameter_value);
        var u = "";
        // remove everything infront of and behind the parameter
        var reg_exp2 = new RegExp(".*[?&]" + parameter_value + "=([^&]*).*");
        // console.debug(reg_exp2);
        u = new_url.replace(reg_exp2, '$1');
        // console.debug(u);
        // remove everything infront of the parameter
        var reg_exp1 = new RegExp(".*[\?&]" + parameter_value + "=([^&]*)$");
        // console.debug(reg_exp1);
        // console.debug(u);
        // u = url.replace(reg_exp1, '$1' );
        // new_url = url_rewrite_step_qs_param(new_url, parameter_value);
        new_url = u;
        break;
    case 'qs_remove_param':
     //    console.debug(new_url);
        // console.debug("get query string parameter named: " + parameter_value);
        var u = "";
        // remove everything infront of and behind the parameter
        var reg_exp2 = new RegExp( "([\?&]{1,})" + parameter_value + "=[^&]{1,}([&]*)", 'gi');
     //    console.debug(reg_exp2);
       u = new_url.replace(reg_exp2, '$1$2');
        
        console.debug(u);
        new_url = u.replace(new RegExp("&&*"), '&');
        break;
    case 'uri_decode':
        try {
            // for some reason decodeURI does not work
            new_url = new_url.replace(/%40/g, '@').replace(/%3A/g, ':').replace(/%3B/g, ';').replace(/%3C/g, '<').replace(/%3D/g, '=').replace(/%3E/g, '>').replace(/%3F/g, '?').replace(/%20/g, ' ').replace(/%21/g, '!').replace(/%22/g, '"').replace(/%23/g, '#').replace(/%25/g, '%').replace(/%26/g, '&').replace(/%28/g, '(').replace(/%29/g, ')').replace(/%2A/g, '*').replace(/%2B/g, '+').replace(/%2C/g, ',').replace(/%2D/g, '-').replace(/%2E/g, '.').replace(/%2F/g, '/').replace(/%5B/g, '[').replace(/%5C/g, '\\').replace(/%5D/g, ']').replace(/%5E/g, '^').replace(/%5F/g, '_').replace(/%60/g, "'").replace(/%25/g, '%');
        } catch (e) { // catches a malformed URI
            console.error(e);
        }
        break;
    case 'base64_decode':
        console.debug(new_url);
        new_url = atob(new_url);
        break;
    case 'JSON_path':
        console.debug(new_url);
        console.debug(JSON.parse(new_url)[parameter_value]);

        new_url = JSON.parse(new_url)[parameter_value];
        break;
    case 'replace_with':
        console.debug(new_url);
        new_url = parameter_value;
        break;
    case 'skinny_lookup':
        // lookup the URL and if it returns a HTTP 403 redirect and a Location
        // header, insert that.
        // Itterate up to three times incase on redirect leads to another.
        console.debug("lookup the URL without revealing anything");
        // new_url = parameter_value;
        break;
    default:
    }

    return new_url;

}



function refresh_inmemory_policy_datastore_async(dbname, dbstorename) {
    // read out all policies from the policy database and compare the current in-memory has arrays with the just-read data.
    // Add what is missing and remove the surplus.
    return new Promise(
        function (resolve, reject) {
        console.debug("#####################################");
        console.debug("#####################################");
        console.debug("#####################################");

        dump_db_2_hash_async(dbname, dbstorename).then(function (res) {
            one = res;
            console.debug(JSON.stringify(one));

            // loop through all returned objects and insert them in the hash array
            console.debug(one.length);
            console.debug(one[0]);
            console.debug(one[0].keyId);
            for (var i = 0; i < one.length; i++) {
                // copy over the whole object, change this later
                //ourceHostnamePolicyDB_inmemory[one[i].keyId] = one[i];
                in_memory_policies[dbname][one[i].keyId] = one[i];
            }
            // add functionality for removign any entires no longer present in the database
            resolve(true);
        });
    });
}


function dump_db_2_hash_async(dbName, storeName3) {

    return new Promise(
        function (resolve, reject) {
        // access database
        console.debug("-------------------------------------");

        console.debug("dump_db access database: " + dbName);
        var dbRequest = indexedDB.open(dbName);

        //     try {
        dbRequest.onsuccess = function (event3) {
            var database3 = event3.target.result;

            //console.debug("access datastore: " + storeName3);

            var transaction3 = database3.transaction([storeName3]);
            var objectStore3 = transaction3.objectStore(storeName3);

            var allRecords3 = objectStore3.getAll();
            allRecords3.onsuccess = function () {
                console.debug("-------------------------------------");
                console.debug("-------------------------------------");

                const res3 = allRecords3.result;
                console.debug(res3);
                console.debug("## results" + JSON.stringify(res3));
                //listOfKeys = listOfKeys + ',"privateKeys":' + JSON.stringify(res3) + '';
                console.debug("-------------------------------------");
                console.debug("-------------------------------------");

                // get private(and their public component) signing keys
                database3.close();
                resolve(res3);

            };
            database3.close();

        }
        //            dbRequest.close();
        //      } catch (e) {
        //         console.debug(e);
        //         resolve("error");
        //    }
    });
}




/*
 * Crate an instance IndexedDB
 * Takes a JSON structure specifying the configuration
 * 
 * {
    dbname: "sourceUrlRuleDB",
    objectstore: [{
            name: "sourceUrlRuleStore",
            keyPath: "keyId",
            autoIncrement: false,
            index: [{
                    n: "keyId",
                    o: "keyId",
                    unique: "true"
                }
            ]
        }
    ]
}
 * 
 * */
function create_indexeddb_async(indexedDB, dbconfig) {

    console.debug("# create_indexeddb_async: " + JSON.stringify(dbconfig));

    // To do: add logic so as not to try to create tables already present


    return new Promise(
        function (resolve, reject) {

        console.debug("database config: " + JSON.stringify(dbconfig));
       // console.debug("database name: " + dbconfig.dbname);
       // console.debug("objectstore name: " + dbconfig.objectstore[0].name);
       // console.debug("key: " + dbconfig.objectstore[0].keyPath);
       // console.debug("index: " + JSON.stringify(dbconfig.objectstore[0].index[0].unique));

        let db;

        // ########
        var request7 = indexedDB.open(dbconfig.dbname, 1);
        request7.onupgradeneeded = function (event5) {
            db = event5.target.result;
            db.onerror = function (event4) {};
            // Create an objectStore in this database to keep offers to passout decryption keys in a secure way.
            console.debug("create objectstore " + dbconfig.objectstore[0].name + " in " + dbconfig.dbname + " for secure key offers");
            var objectStore = db.createObjectStore(dbconfig.objectstore[0].name, {
                    keyPath: dbconfig.objectstore[0].keyPath
                });

            console.debug("db create objectstore index " + dbconfig.objectstore[0].index[0].n);

            objectStore.createIndex(dbconfig.objectstore[0].index[0].n, dbconfig.objectstore[0].index[0].o, {
                unique: dbconfig.objectstore[0].index[0].unique
            });
            console.debug("completed");
            resolve(true);
        };
        request7.onerror = function (event1) {
            console.debug("dp open request error 201");
        };
        request7.onsuccess = function (event) {
            console.debug("db open success");
            var db_1 = event.target.result;
            console.debug(db_1);
            db_1.onerror = function (event2) {
                console.debug("db open request error 2");

                console.debug("db create objectstore");

                var objectStore = db_1.createObjectStore(dbconfig.objectstore[0].name, {
                        keyPath: dbconfig.objectstore[0].keyPath
                    });

                console.debug("db create objectstore index " + dbconfig.objectstore[0].index[0].n);

                objectStore.createIndex(dbconfig.objectstore[0].index[0].n, dbconfig.objectstore[0].index[0].o, {
                    unique: dbconfig.objectstore[0].index[0].unique
                });
                console.debug("completed");
                resolve(true);
            };
            db_1.onsuccess = function (event3) {
                console.debug("db open request success 2");
                var objectStore = db_1.createObjectStore(dbconfig.objectstore[0].name, {
                        keyPath: dbconfig.objectstore[0].keyPath
                    });

                console.debug("db create objectstore index " + dbconfig.objectstore[0].index[0].n);

                objectStore.createIndex(dbconfig.objectstore[0].index[0].n, dbconfig.objectstore[0].index[0].o, {
                    unique: dbconfig.objectstore[0].index[0].unique
                });
                console.debug("completed");
                resolve(true);
            };
            console.debug("completed");
            resolve(true);
        };

    });

}


function generate_default_link_rules() {

    console.debug("generate_default_link_rules begin");

    // add rule objects to database
    try {
        var p = [];
      


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
        })
        .catch(error => {
            console.error(error.message)
        });

    } catch (f) {
        console.debug(f);
    }
}


function saveToIndexedDB_async(dbName, storeName, keyId, object) {

    console.debug("saveToIndexedDB_async:dbname " + dbName);
    console.debug("saveToIndexedDB_async:objectstorename " + storeName);
    console.debug("saveToIndexedDB_async:keyId " + keyId);
    console.debug("saveToIndexedDB_async:object " + JSON.stringify(object));

    // indexedDB = window.indexedDB || window.webkitIndexedDB ||
    // window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        // console.debug("saveToIndexedDB: 0 resolve=" + resolve )
        // console.debug("saveToIndexedDB: 0 reject=" + reject )

        // if (object.taskTitle === undefined)
        // reject(Error('object has no taskTitle.'));

        var dbRequest;

        try {

            dbRequest = indexedDB.open(dbName);
        } catch (error) {
            console.debug(error);

        }
        console.debug("saveToIndexedDB_async: 1 dbRequest=" + dbRequest);

        dbRequest.onerror = function (event) {
            console.debug("saveToIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        console.debug("saveToIndexedDB: 2" + JSON.stringify(dbRequest));

        dbRequest.onupgradeneeded = function (event) {
            console.debug("saveToIndexedDB: 21");
            var database = event.target.result;
            console.debug("saveToIndexedDB:db create obj store " + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        console.debug("saveToIndexedDB: 3" + JSON.stringify(dbRequest));
        try {

            dbRequest.onsuccess = function (event) {
                console.debug("saveToIndexedDB: 31");
                var database = event.target.result;
                console.debug("saveToIndexedDB: 32");
                var transaction = database.transaction([storeName], 'readwrite');
                console.debug("saveToIndexedDB: 33");
                var objectStore = transaction.objectStore(storeName);
                console.debug("saveToIndexedDB:objectStore put: " + JSON.stringify(object));

                var objectRequest = objectStore.put(object); // Overwrite if
                // already
                // exists

                console.debug("saveToIndexedDB:objectRequest: " + JSON.stringify(objectRequest));

                objectRequest.onerror = function (event) {
                    console.debug("saveToIndexedDB:error: " + storeName);

                    reject(Error('Error text'));
                };

                objectRequest.onsuccess = function (event) {
                    console.debug("saveToIndexedDB:success: " + storeName);
                    resolve('Data saved OK');
                };
            };

        } catch (error) {
            console.debug(error);

        }

    });
}



