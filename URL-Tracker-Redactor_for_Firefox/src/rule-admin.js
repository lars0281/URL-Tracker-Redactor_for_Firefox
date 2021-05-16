/* global loadStoredImages, removeStoredImages, saveToIndexedDB */

/*
 * 
 */

import { createTable, createTableRow , writeTableHeaderRow,writeTableRow, sortColumn, SortTable, CompareRowOfText, CompareRowOfNumbers, GetDateSortingKey , writeTableNode, writeTableCell, TableLastSortedColumn , reflow, saveToIndexedDB_async, deleteFromIndexedDB_async, READ_DB}  from "./utils/glovebox_utils.js"

console.debug("### rule-admin.js ");

// array of all rule databases
var parentArray = [
    ["sourceFulldomainRuleDB", "sourceFulldomainRuleStore", "sourceFulldomainRuleStore"], ["sourceDomainRuleDB", "sourceDomainRuleStore", "sourceDomainRuleStore"], ["sourceUrlRuleDB", "sourceUrlRuleStore", "sourceUrlRuleStore"], ["destinationFulldomainRuleDB", "destinationFulldomainRuleStore", "destinationFulldomainRuleStore"], ["destinationDomainRuleDB", "destinationDomainRuleStore", "destinationDomainRuleStore"], ["destinationUrlRuleDB", "destinationUrlRuleStore", "destinationUrlRuleStore"]
];

class NavigateCollectionUI {
    constructor(containerEl) {

       // console.debug("### rule-admin.js ");

        this.containerEl = containerEl;

        console.debug(document);

        this.state = {
            storedImages: [],
        };

        // create tables to present all available rules
        var table_conf = {};
        table_conf["conf"] = [ {
                "id": "1",
                "width": "100px"
            }, {
                "id": "1",
                "width": "290px"
            }, {
                "id": "1",
                "width": "290px"
            }, {
                "id": "1",
                "width": "100px"
            }, {
                "id": "1",
                "width": "100px"
            }, {
                "id": "1",
                "width": "100px"
            }
        ];

        // presentation_format: text, JSON, table, dropdown

        // setup column headers for table
        var header_conf = [];
        header_conf = [ {
                "id": "1",
                "text": "domain"
            }, {
                "id": "2",
                "text": "steps"
            }, {
                "id": "5",
                "text": "notes"
            }, {
                "id": "3",
                "text": "ed. bttn"
            }, {
                "id": "4",
                "text": "del. bttn"
            }
        ];

        // setup column configuration for table

        var column_conf = [];
        column_conf = [ {
                "id": "1",
                "json_path": "url_match",
                "presentation_format": "text"
            }, {
                "id": "2",
                "json_path": "steps",
                "presentation_format": "table",
                "cell_table_conf": {
                    "table_conf": {
                        "class": "steps_table"
                    },
                    "row_conf": {
                        "class": "step_row"
                    },
                    "column_conf": [{
                            "id": "31",
                            "class": "step_procedure_name",
                            "json_path": "procedure",
                            "presentation_format": "text"
                        }, {
                            "id": "32",
                            "class": "step_procedure_parameter",
                            "json_path": "parameters",
                            "presentation_format": "table",
                            "cell_table_conf": {
                                "table_conf": {
                                    "class": "parameter_table"
                                },
                                "row_conf": {
                                    "class": "parameter_row"
                                },
                                "column_conf": [{
                                        "class": "parameter_value",
                                        "json_path": "value",
                                        "presentation_format": "text"
                                    }, {
                                        "class": "parameter_notes",
                                        "json_path": "notes",
                                        "presentation_format": "text"
                                    }
                                ]
                            }
                            
                        }, {
                            "id": "33",
                            "class": "step_notes",
                            "json_path": "notes",
                            "presentation_format": "text"
                        }
                    ]
                }
            },  {
                "id": "3",
                "json_path": "notes",
                "presentation_format": "text"
            },{
                "id": "4",
                "node": {
                    "name": "form",
                    "class": "edit-rule-form",
                    "subnodes": [{
                            "name": "button",
                            "text": "edit",
                            "class": "edit-rule",
                            "EventListener": {
                                "type": "click",
                                "func": "editObject",
                                "parameter": "click"
                            }
                        }
                    ]
                }
            }, {
                "id": "5",
                "node": {
                    "name": "button",
                    "text": "delete",
                    "class": "delete-rule",
                    "EventListener": {
                        "type": "click",
                        "func": "deleteObject",
                        "parameter": "click"
                    }
                }
            },

        ];

        // console.debug(JSON.stringify(column_conf));

        // destinationDomainRule
        header_conf[0].text = "destinationDomainRule";

        // column_conf[0]["json_path"] = "destinationDomain";
        // column_conf[1].json_path = "steps";
        // column_conf[2].node.text = "update this rule3";
 // column_conf[2].node["class"] = "update-rule";
        column_conf[3].node.subnodes[0]["EventListener"].func = "updateObject";
        // column_conf[3].node.text = "delete2";
   // column_conf[3].node["class"] = "update-rule";
        column_conf[4].node["EventListener"].func = "deleteObject";
        // console.debug(JSON.stringify(column_conf));

        try {
            setup_rule_table('destination', 'destinationDomainRule', document.getElementById("destinationDomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.debug(e)
        }

        // destinationDomainRule
        header_conf[0].text = "destinationFulldomainRule";
        column_conf[0].json_path = "destinationFulldomain";

        try {
            setup_rule_table('destination', 'destinationFulldomainRule', document.getElementById("destinationFulldomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.debug(e)
        }

        // destinationUrl:"https://dagsavisen.us11.list-manage.com/track/click"

        // destinationUrlRule
        header_conf[0].text = "destinationUrlRule";
        column_conf[0].json_path = "destinationUrl";
        try {
            setup_rule_table('destination', 'destinationUrlRule', document.getElementById("destinationUrlRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.debug(e)
        }

        // sourceDomainRule
        header_conf[0].text = "sourceDomainRule";
        column_conf[0].json_path = "sourceDomain";

        try {
            setup_rule_table('source', 'sourceDomainRule', document.getElementById("sourceDomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.debug(e)
        }

        // sourceFulldomainRule
        header_conf[0].text = "sourceFulldomainRule";
        column_conf[0].json_path = "sourceFulldomain";
        try {
            setup_rule_table('source', 'sourceFulldomainRule', document.getElementById("sourceFulldomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.debug(e)
        }

        // sourceUrlRule
        header_conf[0].text = "sourceUrlRule";
        column_conf[0].json_path = "sourceUrl";

        try {
            setup_rule_table('source', 'sourceUrlRule', document.getElementById("sourceUrlRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.debug(e);
        }

        // attach event listeners to page buttons

        try {
            document.getElementById("button_generate_default").addEventListener('click',
                function () {
                console.debug("### button.generate-source-fulldomain-rule begin");
                generate_default_link_rules();
                console.debug("### button.generate-source-fulldomain-rule end");
            });

        } catch (e) {
            console.debug(e);
        }

        // list of mail tables
        var tables = ['destinationUrlRule', 'destinationFulldomainRule', 'destinationDomainRule', 'sourceUrlRule', 'sourceFulldomainRule', 'sourceDomainRule'];

        // loop through all tables and set up what buttons are needed for each
        for (var t = 0; t < tables.length; t++) {
            // console.debug("do: " + tables[t]);


            try {
                // console.debug("hide button status: "+
                // document.getElementById("hide_"+tables[t]+"_button").style.display);

                // show/hide button
                document.getElementById("hide_" + tables[t] + "_button").addEventListener('click',
                    function (event) {
                    if (event.target.getAttribute('bool') == '1') {
                        var target_id = event.target.getAttribute('target_id');
                        document.getElementById(target_id).style.display = 'none';
                        // show the table
                        event.target.setAttribute('bool', '0');
                        var newtext = document.createTextNode("show table");
                        event.target.replaceChild(newtext, event.target.childNodes[0]);
                    } else {
                        // disappear the table
                        event.target.setAttribute('bool', '1');
                        var target_id = event.target.getAttribute('target_id');
                        document.getElementById(target_id).style.display = 'block';
                        var newtext = document.createTextNode("hide table");
                        event.target.replaceChild(newtext, event.target.childNodes[0]);
                    }
                });

            } catch (e) {
                console.debug(e);
            }

        }

        // add backup button
        try {
            document.getElementById("backup-all-rules_button").addEventListener('click', () => {
                // document.querySelector("button.backup-all-keys").addEventListener('click',
                // ()
                // => {
                console.debug("backup rules ");

                console.debug("backup all keys start");
                backout_all_rules().then(function (e) {
                    console.debug("backup complete");
                    console.debug(e);
                });
            }, false);
        } catch (e) {
            console.debug(e)
        }

        // add event listener for import button

        console.debug("setup import form");
        try {
            document.getElementById('import-rules_button').addEventListener('click', function (evt) {
                console.debug("### reading import file");

                var input = document.createElement('input');
                input.type = 'file';

                input.onchange = e => {

                    // getting a hold of the file reference
                    var file = e.target.files[0];

                    // setting up the reader
                    var reader = new FileReader();
                    reader.readAsText(file, 'UTF-8');

                    // here we tell the reader what to do when it's done
                    // reading...
                    reader.onload = readerEvent => {
                        var content = readerEvent.target.result; // this is
                        // the
                        // content!
                        console.debug(content);

                        // add content to database
                        // loop parentArray
                        var p = [];
                        try {
                            for (var i = 0; i < parentArray.length; i++) {
                                console.debug(parentArray[i][0]);

                                console.debug("import into " + parentArray[i][0]);
                                var imported = JSON.parse(content);
                                console.debug("import  " + imported[parentArray[i][0]].length);

                                for (var j = 0; j < imported[parentArray[i][0]].length; j++) {
                                    console.debug("import  " + JSON.stringify(imported[parentArray[i][0]][j]));
                                    // add rule to data

                                    p.push(saveToIndexedDB_async(parentArray[i][0], parentArray[i][1], 'keyId', imported[parentArray[i][0]][j]));

                                }

                            }
                        } catch (e) {
                            console.debug(e);
                        }
                        console.debug(p);

                    }

                }

                input.click();

            });

        } catch (e) {
            console.debug(e);
        }

    }
}

function generate_default_link_rules() {

    console.debug("generate_default_link_rules begin");

    // add rule objects to database
    try {
        var p = [];
        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.google.com/',
                sourceFulldomain: 'https://www.google.com/',
                url_match: 'https://www.google.com/',
                scope: 'Fulldomain',
                direction: 'source',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "url",
                                notes: "read url from querystring"
                            }
                        ],
                        notes: "grab the url parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [],
                        notes: "uri decode"
                    }
                ],
                notes: '',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.facebook.com/',
                sourceFulldomain: 'https://www.facebook.com/',
                url_match: 'https://www.facebook.com/',
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
                                value: "s/(utm|hsa)_[a-z]*=[^&]*//g",
                                notes: "delete parameters with names starting with utm_ and hsa_"
                            }
                        ],
                        notes: "remove suspicious parameters from querystring"
                    }
                ],
                notes: 'remove tracking id from urls to thrrd parties',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.imdb.com/',
                sourceFulldomain: 'https://www.imdb.com/',
                url_match: 'https://www.imdb.com/',
                scope: 'Fulldomain',
                direction: 'source',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sDcharDCHARDg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
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
                },{
                    procedure: "regexp",
                    parameters: [{
                            value: "s/[&]*li_fat_id=[^&]*//g",
                            notes: "delete qs parameter with named li_fat_id"
                        }
                    ],
                    notes: "remove extraneous parameter from querystring"
                }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationDomainRuleDB', 'destinationDomainRuleStore', 'keyId', {
                keyId: 'ct.sendgrid.net',
                destinationDomain: 'ct.sendgrid.net',
                url_match: 'ct.sendgrid.net',
                scope: 'Domain',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD-D%Dg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.facebook.com/',
                destinationFulldomain: 'https://www.facebook.com/',
                url_match: 'https://www.facebook.com/',
                scope: 'Fulldomain',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
                keyId: 'http://ad.doubleclick.net/',
                destinationFulldomain: 'http://ad.doubleclick.net/',
                url_match: 'http://ad.doubleclick.net/',
                scope: 'Fulldomain',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD.*(http[s]*://[^&]*).*D$1Dg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }, {
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
            keyId: 'https://www.linkedin.com/',
            destinationFulldomain: 'https://www.linkedin.com/',
            url_match: 'https://www.linkedin.com/',
            scope: 'Fulldomain',
            direction: 'destination',
            steps: [{
                procedure: "regexp",
                parameters: [{
                        value: "s/trackingId=[^&]*//g",
                        notes: "delete trackingId from querystring"
                    }
                ],
                notes: "remove tracking token from querystring used inside the linkedin application"
            }
            ],
            notes: 'remove tracker',
            createtime: '202001010001'
        }));


        // boil
        // https://ad.doubleclick.net/ddm/trackclk/N1114924.158707LINKEDIN/B25010089.299078854;dc_trk_aid=491804324;dc_trk_cid=142315430;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=$%7BGDPR%7D;gdpr_consent=$%7BGDPR_CONSENT_755%7D;ltd=?li_fat_id=e1558f7d-a9f8-41dc-9c34-a654161f74be
        // https://ad.doubleclick.net/ddm/trackclk/N1114924.158707LINKEDIN/B25010089.299078854;dc_trk_aid=491804324;dc_trk_cid=142315430;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=$(GDPR);gdpr_consent=(GDPR_CONSENT_755);ltd=?li_fat_id=e1558f7d-a9f8-41dc-9c34-a654161f74be
        // down to
        // 'https://ad.doubleclick.net/ddm/trackclk/N1114924.158707LINKEDIN/B25010089.299078854;dc_trk_aid=491804324;dc_trk_cid=142315430;
        // returns
        // https://bcp.crwdcntrl.net/5/c=10025/camp_int=Advertiser_${9340650}^Campaign_${25010089}^clicks?https://www.ibm.com/cloud/bare-metal-servers?utm_content=000016GC&utm_term=10006171&p1=PSocial&p2=299078854&p3=142315430&dclid=CNjrjqPkmfACFdaNsgodXggDvQ
        // which is turn must be reduced to
        // https://www.ibm.com/cloud/bare-metal-servers

        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
                keyId: 'https://ad.doubleclick.net',
                destinationFulldomain: 'https://ad.doubleclick.net',
                url_match: 'https://ad.doubleclick.net',
                scope: 'Fulldomain',
                direction: 'destination',
                destinationFulldomain: 'https://ad.doubleclick.net',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "remove the querystring"
                            }
                        ],
                        notes: "reduce to ;dc_trk_aid=11111111;dc_trk_cid=000000"
                    }, {
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "remove semmi-colon separated parameters from path where no value has been set ;dc_rdid=  "
                            }
                        ],
                        notes: "reduce to ;dc_trk_aid=11111111;dc_trk_cid=000000"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));

        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://l.facebook.com/l.php',
                destinationUrl: 'https://l.facebook.com/l.php',
                url_match: 'https://l.facebook.com/l.php',
                 scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "u",
                                notes: "read u from querystring"
                            }
                        ],
                        notes: "grab the u parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],
                    notes: "uri decode"
                    }
                ],
                notes: '',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://www.google.com/url',
                destinationUrl: 'https://www.google.com/url',
                url_match: 'https://www.google.com/url',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "url",
                                notes: "read url from querystring"
                            }
                        ],
                        notes: "grab the url parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],notes: "uri decode"
                    }
                ],
                notes: '',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://ideas-admin.lego.com/mailing/email_link',
                destinationUrl: 'https://ideas-admin.lego.com/mailing/email_link',
                url_match: 'https://ideas-admin.lego.com/mailing/email_link',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "payLoad",
                                notes: "read payLoad from querystring"
                            }
                        ],
                        notes: "grab the payLoad parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],notes: "uri decode"
                    }, {
                        procedure: "base64_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],notes: "BASE64 decode"
                    }, {
                        procedure: "JSON_path",
                        parameters: [{
                                value: "url",
                                notes: "read url from object"
                            }
                        ],
                        notes: "get piece of JSON object"
                    }
                ],
                notes: 'handle links embedded in emails from LEGO',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://dagsavisen.us11.list-manage.com/track/click',
                destinationUrl: 'https://dagsavisen.us11.list-manage.com/track/click',
                url_match: 'https://dagsavisen.us11.list-manage.com/track/click',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "replace_with",
                        parameters: [{
                                value: "http://www.dagsavisen.no/minside",
                                notes: "replace"
                            },{
                                value: "http://www.dagsavisen.no/minside2",
                                notes: "replace2 "
                            },{
                                value: "http://www.dagsavisen.no/minside3",
                                notes: "replace 3"
                            }
                        ],
                        notes: "replace with http://www.dagsavisen.no/minside"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://www.youtube.com/watch',
                destinationUrl: 'https://www.youtube.com/watch',
                url_match: 'https://www.youtube.com/watch',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD(\\?v=[^&]*).*D$1Dg",
                                notes: "sed statement to remove all but the v parameter"
                            }
                        ],
                        notes: "youtube videos should be short, leave only v parameter in query string"
                    }
                ],
                notes: 'clean youtube URLs',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://www.flysas.com/en/flexible-booking/',
                destinationUrl: 'https://www.flysas.com/en/flexible-booking/',
                url_match: 'https://www.flysas.com/en/flexible-booking/',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "s/eCodsId=[^&]*//g",
                                notes: "sed-type regexp statement to delete CodsId from url"
                            }
                        ],
                        notes: "remove piece of querystring"
                    }
                ],
                notes: 'SAS tracing offers',
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

// create table

function setup_rule_table(type, key, node, t, h, c) {

    var table_conf = JSON.parse(JSON.stringify(t));
    var header_conf = JSON.parse(JSON.stringify(h));
    var column_conf = JSON.parse(JSON.stringify(c));

    try {
    // console.debug("# setup_rule_table" );
       // console.debug("type: " + type);
     // console.debug("key: " + key);
        // console.debug("node: " + JSON.stringify(node));
        // console.debug("table_conf: " + JSON.stringify(table_conf));
        // console.debug("header_conf: " + JSON.stringify(header_conf));
        // console.debug("column_conf: " + JSON.stringify(column_conf));

        if (node != null) {
            // ##########
            // list all objects in db
            // ##########


            // var table_obj = createTable(table_conf, key);

            var div_table_obj = document.createElement("div");
            div_table_obj.setAttribute("class", "tableContainer");
            var table_obj = document.createElement("table");

            // div_obj.setAttribute("style", "border: 4px; height: 185px;
            // border-top-color:
            // rgba(2, 225, 225, 0.9)");
            // div_table_obj.setAttribute("class", "tableContainer");
            // table_obj.setAttribute("style", "width: 800px; float: left");
            // table_obj.setAttribute("style", "display: block;max-height:
            // 150px;max-widht: 600px;overflow: auto;");
            table_obj.setAttribute("border", "0");
            table_obj.setAttribute("cellspacing", "0");
            table_obj.setAttribute("cellpadding", "0");
            table_obj.setAttribute("class", "scrollTable");
            table_obj.setAttribute("width", "100%");
            table_obj.setAttribute("id", key);

            // for (var i = 0; i < table_conf.length; i++) {
            // var obj = table_conf[i];
            // create a column for each

            // console.debug(JSON.stringify(obj));
            // console.debug("create column ");

            // setup column width for table
            // var col_i = document.createElement("col");
            // col_i.setAttribute("width", obj.width);
            // table_obj.appendChild(col_i);

            // }


            div_table_obj.appendChild(table_obj);

            var thead = document.createElement("thead");
            thead.setAttribute("class", "fixedHeader");
            thead.appendChild(writeTableHeaderRow(header_conf, key));

            table_obj.appendChild(thead);

            var tbody = document.createElement("tbody");
            tbody.setAttribute("class", "scrollContent");
            // tbody.setAttribute("style", "display: block;height: 100px;width:
            // 100%;overflow-y: auto;");


            var dbRequest = indexedDB.open(key + "DB");
            dbRequest.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                reject(Error('Not found'));
            };

            dbRequest.onsuccess = function (event) {
                var database = event.target.result;
                var transaction = database.transaction(key + 'Store', 'readonly');
                var objectStore = transaction.objectStore(key + 'Store');

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items
                    // in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        // console.debug(res);


                        for (const url of res) {

                            // create table row for each entry returned from
                            // database
                            // const tr = document.createElement("tr");
                            // console.debug("column_conf " +
                            // JSON.stringify(column_conf));
                            // console.debug("url" + JSON.stringify(url));
                            // console.debug("column_conf: " +
                            // JSON.stringify(column_conf));

                            const tr = writeTableRow(url, column_conf, type, key);

                            // create add row to table

                            tbody.appendChild(tr);

                        }

                    };
                    // add a line where information on a new key can be added to
                    // the database.
                    // document.querySelector("button.onAddDecryptionKey").onclick
                    // = this.onAddDecryptionKey;

                } else {
                    // Fallback to the traditional cursor approach if getAll
                    // isn't supported.
                    var timestamps = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.debug(cursor.value);
                            // timestamps.push(cursor.value);
                            cursor.continue();
                        } else {
                            // logTimestamps(timestamps);
                        }
                    };

                    document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                    const tr_last = document.createElement("tr");

                    const td = document.createElement("td");
                    td.innerHTML = "key name";
                    tr_last.appendChild(td);
                    const td2 = document.createElement("td");
                    td2.innerHTML = "key";
                    tr_last.appendChild(td2);
                    const td3 = document.createElement("td");
                    td3.innerHTML = "jwk";
                    tr_last.appendChild(td3);

                    tbody.appendChild(tr_last);

                }

            };
            table_obj.appendChild(tbody);

            node.appendChild(div_table_obj);
        }
    } catch (e) {
        console.debug(e)
    }

}


function submitAddNewRule(type, key) {
    console.debug("## submitAddNewRule");
    console.debug(type);
    console.debug(key);

}





function deleteObject(uuid, type, key) {
    console.debug("deleteObject");

    console.debug("type: " + type);
    console.debug("key: " + key);
    console.debug("uuid: " + uuid);

    var p = deleteFromIndexedDB_async(key + 'DB', key + 'Store', uuid);

    p.then(function (res) {
        console.debug(res)
    });

}

function updateObject(uuid, type, key, rule) {
    console.debug("updateObject");

    console.debug("type: " + type);
    console.debug("key: " + key);
    console.debug("uuid: " + uuid);
    console.debug("rule: " + JSON.stringify(rule));

    // var popup = window.open("<html><title>sub</title></html>");


    // create popup window where fields can be edited


    // two different popups depending on wheather not this is a rule based on
    // source URL (where the link is found)
    // or destination (where the link goes to)

    // Add the url to the pending urls and open a popup.
    // pendingCollectedUrls.push(info.srcUrl);
    var popup = null;
    try {
        // open up the popup


   

        // var w = window.open('', '',
		// 'width=1000,height=700,resizeable,scrollbars');
        
     // place the rule to be edited in storage
        
        browser.storage.sync.set({ 'editThisRule': rule, 'type': type, 'key': key }).then(function(g){
        	console.debug(g);
        	});
        
        var w = window.open('popup/edit-rule.html', 'test01', 'width=1000,height=600,resizeable,scrollbars');
        // the popup is now open

        console.debug("read back: " + browser.storage.sync.get(['editThisRule', 'type', 'key']));
        browser.storage.sync.get(['editThisRule', 'type', 'key']).then(function(e){
        	console.debug(e);
        	});

        console.debug("read back: " + browser.storage.sync.get(['editThisRule', 'type', 'key'], function (data){
        	console.debug(data);
        } ));
        
        // send message to background, and have background send it to the popup
        browser.runtime.sendMessage({
            request: {"sendRule":"toEditPopup","rule": rule}
        }, function (response) {
            console.debug("message sent to backgroup.js with response: " + JSON.stringify(response));
        });
        


    } catch (err) {
        console.error(err);
    }

}

function backout_all_rules() {
    console.debug("### backup_all_keys() begin");

    // return new Promise((resolve, reject) => {

    var listOfKeys = "{";

    // create list of databases and datastores to be backed up in the form of an
    // array of arrays with each field naming the database, datastore in the
    // database

    // //

    // ["acceptedKeyOffers", "acceptedKeyOffers", "acceptedKeyOffers"]
    // ["gloveboxKeys", "decryptionKeys", "decryptionKeys"],
    // ["gloveboxKeys", "encryptionKeys", "encryptionKeys"]
    // ["privateKeys", "keyPairs", "keyPairs"]


    try {
        for (var i = 0; i < parentArray.length; i++) {

            try {
                // await wait_promise(20); //wait for 2 seconds
                // var one = await
                // wait_promisedump_db(parentArray[i][0],parentArray[i][1],parentArray[i][2]);
                // var one =
                // dump_db(parentArray[i][0],parentArray[i][1],parentArray[i][2]);
                // var one;

                var db = parentArray[i][0];
                var dbName3 = parentArray[i][1];
                var storeName3 = parentArray[i][2];
                console.debug("### accessing db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);

                const one = READ_DB(db, dbName3, storeName3);
                console.debug("READ " + one);

                // console.debug("# appending: " +parentArray[i][0] + " " + one);
                // console.debug("#-#-#-#-# " + i + " " + listOfKeys);

                listOfKeys = listOfKeys + '"' + parentArray[i][0] + '":' + one + ',';
                console.debug("#-#-#-#-# (accumulating) " + i + " " + listOfKeys);

            } catch (e) {
                console.debug("ERROR");

                console.debug(e);
            }

        }
    } catch (e) {
        console.debug(e)
    }

    listOfKeys = listOfKeys.substring(0, listOfKeys.length - 1) + '}';

    // proceed with encryption
    // using passphrase specified in the form


    console.debug("#-#-#-#-# listOfKeys (complete) " + listOfKeys);
    // encrypt the data using the passphrase contained in the variable
    // backupFilePwd

    download_file("linklooker_rules_backup.json", listOfKeys);

    // download_file("glovebox_keys_backup.txt", listOfKeys, "text/plain");
    console.debug("### backup_all_keys() end");
    // resolve( "true");
    console.debug("backup completed, proceed to flush all keys.");
    // await flush_all_dbs();

    // });

}



function download_file(name, contents, mime_type) {

    console.debug("download_file BEGIN");

    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {
            type: mime_type
        });

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function (e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function () {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
    console.debug("download_file END");
}


// kick off
const navigateCollectionUI = new NavigateCollectionUI(document.getElementById('app'));
