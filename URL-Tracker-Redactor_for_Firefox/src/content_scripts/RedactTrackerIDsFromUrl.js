/*
 * This script runs in the browser window and intercepts all click events.
 * It inspects the URL in question and rewrites the query string parameters according to the set rules

 * The ruleset is a list of regexp statements kept in an array.
 * At exec time the array is looped through the rules (regexp rewrites) applied in order.


API documentation

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest

 */

var steps = [];

// only regexp procedures are accepted at this point

steps.push({
    procedure: "regexp",
    parameters: [{
            value: "s/(utm)_(source|campaign|medium|term|content)=[^&]*[&]*//g",
            notes: "Edit querystring to remove Google Analytics tags"
        }
    ],
    notes: "Edit querystring to remove Google Analytics tags"

});

steps.push({
    procedure: "regexp",
    parameters: [{
            value: "s/(hsa)_(acc|cam|grp|ad|net|src|ver|la|ol)=[^&]*[&]*//g",
            notes: "Edit querystring to remove HubSpot tags"
        }
    ],
    notes: "Edit querystring to remove HubSpot tracking tags"

});

steps.push({
    procedure: "regexp",
    parameters: [{
            value: "s/(li_fat_id)=[^&]*[&]*//g",
            notes: "Edit querystring to remove tracking id from linkind"
        }
    ],
    notes: "Edit querystring to remove linkedin tracking tags"

});

console.debug("URL redacter");




var EXLUDE_ITEMS = {};
var WEBREQUEST_DATA = {};
var capture_checkbox = true;
var auto_scroll_checkbox = true;
//StorageChange();

//console.debug("browser.webRequest.onBeforeRequest.hasListener(listener): " + browser.webRequest.onBeforeRequest.hasListener(listener) );
console.debug("## 1.1.3");
try{
browser.webRequest.onBeforeRequest.addListener(
  function(test) {
	  console.debug("browser.webRequest.onBeforeRequest" );
	  console.debug("browser.webRequest.onBeforeRequest" + test);
    test["typ"] = "onBeforeRequest";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  },
  ["requestBody"]
);
}catch(g){
	console.error(g);
}


document.addEventListener("click", function (evt) {
	
    console.debug("document.addEventListener");
    console.debug(evt);

    console.debug(window.location);


    const origin = evt.target.closest("a");

    console.debug(origin);
    console.debug(window.location);

    if (origin) {
        // console.clear();
    	
    	 console.debug(origin);
        var url = "origin";
        url = origin.href;
        console.debug(url);
        
        
        var qs = "origin.search";
        qs = origin.search;
        console.debug(qs);
        
        
        console.debug(`You clicked ${origin.href}`);

        try {
            // only consider URLs with a query string
        	   console.debug(qs);
        	   console.debug(qs.length);
            if (qs) {
                console.debug("has query string");

                // to do - only consider URL with a query string above a certain minimum length
if (qs.length > 15000){
	
	
	
                console.debug("query string too short");
                var new_qs = qs;
                var new_url = origin.href;
                
                // loop through all steps (rewrite rules)
                var i = 0;
                while (i < 12 && i < steps.length){
                	new_url = execute_rule_step(steps[i],new_url );
                	console.log('URL-Tracker-Redactor replaces "' + qs + '" with this URL: "' + new_url + '"');
                
                	i++;
                }
                
                
                console.log('URL-Tracker-Redactor replaces "' + origin.href + '" with this URL: "' + new_url + '"');
                // issue a immediate redirect to the redacted URL.

                // write the changes to the log for user's information / later inspection
                console.debug("prevet default");
                //evt.preventDefault();
                // use "assign" to preserve user's navigation history (lets the user use the back button)
                window.location.assign(new_url);

                
                
                // somehow this is causing another page to load with original URL, into another tab
                return false;

}else{
	
	console.debug("query string too short, so just move it along");
}

            } else {

                console.debug("no query string, so just move it along");
            }

        } catch (f) {
            console.error(f);
        }

    }
});





function setdata_webRequest(e) {
  if (capture_checkbox == true) {
    if (not_on_exlude_list(e.url)) {
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
    }
  }
}

function execute_rule_step(rule_step, url) {
    // console.debug("execute_rule_step");
    var new_url = "";
    new_url = url;
    console.debug("### apply step: " + JSON.stringify(rule_step) + " to " + new_url);

    // syntax is STEP NAME ( PARAMETER VALUE)
    var step_name = "";

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

    } catch (e) {
        console.error(e);
    }

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
            // console.debug("flags_ext: " + flags_ext);
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
