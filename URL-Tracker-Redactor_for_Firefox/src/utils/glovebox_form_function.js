
export {
    addObject,
    CompareRowOfNumbers,
    CompareRowOfText,
    createTable,
    createTableRow,
    create_step_row,
    deleteObject,
    GetDateSortingKey,
    getRank,
    getStepCount,
    get_parent_domain,
    isStepRow,
    reflow,
    setup_database_objects_table_async,
    sortColumn,
    SortTable,
    TableLastSortedColumn,
    updateObject,
    writeTableCell,
    writeTableHeaderRow,
    writeTableNode,
    writeTableRow
};

/* v 1.0.0
 * Standard "toolkit" across all Glovebox's add-ons
 */

import {
    arrayBufferToBase64,
    arrayBufferToString,
    base64ToArrayBuffer,
    convertArrayBufferViewtoString,
    convertStringToArrayBufferView,
    download_file,
    indexeddb_setup_async,
    refresh_policies_async,
    setup_default_policies_async,
    SHA1,
    stringToArrayBuffer

}
from "./glovebox_utils.js"

import {
    backup_all_databases_async,
    //    	create_indexeddb_async,
    deleteFromIndexedDB_async,
    //        dump_db,
    //        flush_all_keys_async,
    import_into_db_async,
    loadFromIndexedDB_async,
    //        READ_DB_async,
    saveToIndexedDB_async
}
from "./glovebox_db_ops.js"

import {
    render_tables
}
from "../rule-admin.js"



//create a step row
function create_step_row() {
    console.debug("create_step_row");
    var newRow = document.createElement('tr');
    newRow.setAttribute("class", "step_row");

    // first cell if which rank this step has in the overall policy object

    var newcell_l = document.createElement('td');
    newcell_l.setAttribute("class", "rank");
    // compute rank
    newcell_l.appendChild(document.createTextNode((getStepCount() + 1)));
    newRow.appendChild(newcell_l);

    // table cell for the procedure
    var newcell_2 = document.createElement('td');
    newcell_2.setAttribute("class", "procedure");
    newcell_2.setAttribute("j_name", "procedure");

    // create drop-down list in this cell

    newcell_2.appendChild(create_processing_type_dropdown_list);

    //newcell_2.appendChild(document.createTextNode("dropdown"));
    //newcell_2.setAttribute("contenteditable", "true");

    newRow.appendChild(newcell_2);

    // table cell for parameters

    var newcell_3 = document.createElement('td');
    newcell_3.setAttribute("class", "parameters");

    // within the parameters cell, setup a table for the parameters
    // where each row has two cells
    var newtable_2 = document.createElement('table');
    newtable_2.setAttribute("class", "parameters_table");
    newtable_2.setAttribute("j_name", "parameters");

    // parameter table row
    var newrow_2 = document.createElement('tr');
    newrow_2.setAttribute("class", "parameter");

    // parameter table cell for the parameter value

    var newcell_31 = document.createElement('td');
    newcell_31.setAttribute("class", "updatable_user_typed_value");
    newcell_31.setAttribute("j_name", "value");
    newcell_31.setAttribute("contenteditable", "true");

    newcell_31.appendChild(document.createTextNode("default"));

    newrow_2.appendChild(newcell_31);

    // parameter table cell for the parameter notes/remarks

    var newcell_32 = document.createElement('td');
    newcell_32.setAttribute("class", "updatable_user_typed_value");
    newcell_32.setAttribute("j_name", "notes");
    newcell_32.setAttribute("contenteditable", "true");

    newcell_32.appendChild(document.createTextNode("default"));

    // edit_cell2.setAttribute("contenteditable", "true");
    // edit_cell2.setAttribute("class", "value_editable");

    newrow_2.appendChild(newcell_32);

    newtable_2.appendChild(newrow_2);
    newcell_3.appendChild(newtable_2);
    newRow.appendChild(newcell_3);

    // notes
    var newcell_4 = document.createElement('td');
    newcell_4.setAttribute("class", "updatable_user_typed_value");
    newcell_4.setAttribute("j_name", "notes");
    newcell_4.setAttribute("contenteditable", "true");
    // create drop-down list in this cell
    newcell_4.appendChild(document.createTextNode("text"));
    newRow.appendChild(newcell_4);

    // cell for buttons
    var newcell_5 = document.createElement('td');
    newcell_5.setAttribute("class", "buttons");
    // create new edit button
    var newbutton_1 = document.createElement('button');
    newbutton_1.setAttribute("class", "editstep_button");
    // newbutton_1.setAttribute("id", "button_generate_default");
    newbutton_1.appendChild(document.createTextNode("edit"));
    newcell_5.appendChild(newbutton_1);

    // create new up button
    var newbutton_2 = document.createElement('button');
    newbutton_2.setAttribute("class", "deletestep_button");
    // newbutton_2.setAttribute("id", "button_generate_default");
    newbutton_2.appendChild(document.createTextNode("up"));

    newcell_5.appendChild(newbutton_2);

    // create new delete button
    var newbutton_3 = document.createElement('button');
    newbutton_3.setAttribute("class", "deletestep_button");
    // newbutton_3.setAttribute("id", "button_generate_default");
    newbutton_3.appendChild(document.createTextNode("delete"));

    newcell_5.appendChild(newbutton_3);

    // create new delete button
    var newbutton_4 = document.createElement('button');
    newbutton_4.setAttribute("class", "downstep_button");
    // newbutton_4.setAttribute("id", "button_generate_default");
    newbutton_4.appendChild(document.createTextNode("down"));

    newcell_5.appendChild(newbutton_4);
    newRow.appendChild(newcell_5);

    // attach event listeners to buttons in this row
    attachButtonEventlisteners(newRow);
    return newRow;
}

function getStepCount() {
    console.debug("# getStepCount");

    var res = document.querySelectorAll("tr.step_row").length;
    console.debug("step count = " + res);
    return res;

}

function getRank(tablerownode) {
    console.debug("# getRank");
    console.debug(tablerownode);

    var max_itterations = 5;
    var m = 0;

    var rank = 1;

    var previous_row = tablerownode.previousSibling;
    while (m < max_itterations && isStepRow(previous_row)) {
        previous_row = previous_row.previousSibling;
        rank++;
        m++;

    }
    console.debug("rank = " + rank);
    return rank;
}

function isStepRow(node) {

    console.debug("# isStepRow");
    console.debug(node);
    try {
        if (node.getAttribute('class') == 'step_row') {
            console.debug("is step row = true");
            return true;
        } else {
            console.debug("is step row = false");
            return false;
        }
    } catch (e) {
        console.debug("is step row = false");
        return false;
    }
}



function get_parent_domain(url){
	
	return url.replace(/^http[s]*:\/\/[^\.]*\.([^\/]*)\/.*/i, '$1');
	
}

//this updateObject is written generically
//but what it will display will be particular to the implementation
// read out from the form the required pieces of information (which object and in what table it is)
function addObject(event) {
    console.debug("# updateObject");
    console.debug(event);

    // identify which database and datastore the new object goes to
    var indexedDbName = null;

    var container = event.target.parentNode;

    try {
        indexedDbName = container.querySelector("table.scrollTable").getAttribute('indexedDbName');
    } catch (e) {
        console.debug(e);
    }

    var objectStoreName = null;

    try {
        objectStoreName = container.querySelector("table.scrollTable").getAttribute('objectStoreName');
    } catch (e) {
        console.debug(e);
    }

    console.debug("objectStoreName: " + objectStoreName);
    console.debug("indexedDbName: " + indexedDbName);

    return browser.storage.sync.set({
        'indexedDbName': indexedDbName,
        'objectStoreName': objectStoreName
    }).then(function (res) {

        var w = window.open('popup/add-policy.html', 'test01', 'width=1000,height=600,resizeable,scrollbars');
        console.debug(w);

    });

}

//this updateObject is written generically
//but what it will display will be particular to the implementation
// read out from the form the required pieces of information (which object and in what table it is)
function updateObject(event) {
    console.debug("# updateObject");
    console.debug(event);

    var object_id = null;

    try {
        object_id = event.target.parentNode.parentNode.getAttribute('object_id');
        console.debug(event.target.parentNode.parentNode.getAttribute('object_id'));
        console.debug(event.target.parentNode.getAttribute('object_id'));
    } catch (e) {
        consolde.debug(e);
    }

    var indexedDbName = null;

    try {
        indexedDbName = event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('indexedDbName');
    } catch (e) {
        consolde.debug(e);
    }

    var objectStoreName = null;

    try {
        objectStoreName = event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('objectStoreName');
    } catch (e) {
        consolde.debug(e);
    }

    // get the id of the object which is to be modified from the table row object

    console.debug("objectStoreName: " + objectStoreName);
    console.debug("object_id: " + object_id);

    // var popup = window.open("<html><title>sub</title></html>");


    // create popup window where fields can be edited


    // two different popups depending on wheather not this is a rule based on
    // source URL (where the link is found)
    // or destination (where the link goes to)

    // Add the url to the pending urls and open a popup.
    // pendingCollectedURLs.push(info.srcURL);
    var popup = null;
    try {

        // open up the popup
        var obj;
        // read object out of database

        loadFromIndexedDB_async(indexedDbName, objectStoreName, object_id).then(function (res) {
            obj = res;
            console.debug(obj);

            // place the identity of the object to be edited in storage

            return browser.storage.sync.set({
                'object_id': object_id,
                'indexedDbName': indexedDbName,
                'objectStoreName': objectStoreName
            });
        }).then(function (g) {

            console.debug(g);
            //});

            // the popup is now open

            // console.debug("read back: " + browser.storage.sync.get(['editThisRule', 'type', 'key']));
            //browser.storage.sync.get(['editThisRule', 'type', 'key']).then(function(e){
            // 	console.debug(e);
            // 	});

            //console.debug("read back: " + browser.storage.sync.get(['editThisRule', 'type', 'key'], function (data){
            // 	console.debug(data);
            //} ));

            // send message to background, and have background send it to the popup
            //	browser.runtime.sendMessage({
            //		request: {"sendRule":"toEditPopup","editThisObject": obj}
            //	}, function (response) {
            //		console.debug("message sent to backgroup.js with response: " + JSON.stringify(response));
            //	});

        });

        var w = window.open('popup/edit-policy.html', 'test01', 'width=1000,height=600,resizeable,scrollbars');
        console.debug(w);

    } catch (err) {
        console.error(err);
    }

}

//this updateObject is written generically
//but what it will display will be particular to the implementation
// read out fro mthe form the required pieces of information (which object and in what table it is)
function deleteObject(event) {
    console.debug("# deleteObject");
    console.debug(event);

    var object_id = event.target.parentNode.parentNode.getAttribute('object_id');

    var indexedDbName = event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('indexedDbName');

    var objectStoreName = event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('objectStoreName');

    var p = deleteFromIndexedDB_async(indexedDbName, objectStoreName, object_id);

    p.then(function (res) {
        console.debug(res)
    });

    // send update message to in-memory database


    // send message to background, to request a refresh of the in-memory databases for this policy object
    browser.runtime.sendMessage({
        request: {
            "policy": "single_delete",
            "delete_details": {
                "database": indexedDbName,
                "datastore": objectStoreName,
                "object_id": object_id
            }
        }
    }, function (response) {
        console.debug("message sent to backgroup.js with response: " + JSON.stringify(response));
    });

    // remove item from table

    var object_table = document.querySelector('table[indexeddbname="' + indexedDbName + '"]');
    //console.debug(object_table);

    var object_row = object_table.querySelector('tr[object_id="' + object_id + '"]');
    //	console.debug(object_row);

    object_row.remove();

}

//create table for database objects
//append the created table node object as a child to the node passed in the "node" parameter
function setup_database_objects_table_async(indexedDbName, objectStoreName, keyId_json_path, table_id, node, table_conf, header_conf, column_conf) {

    /*
     * indexedDbName
     * objectStore
     * keyId_json_path
     * table_id
     * node    DOM node below which the table object is appended
     * table_conf
     * header_conf
     * column_conf
     */
    try {
        return new Promise(
            function (resolve, reject) {

            //var table_conf = JSON.parse(JSON.stringify(t));
            //var header_conf = JSON.parse(JSON.stringify(h));
            //var column_conf = JSON.parse(JSON.stringify(c));


            console.debug("# setup_database_objects_table");
            //console.debug("objectStore: " + objectStoreName);
            //console.debug("indexedDbName: " + indexedDbName);
            // console.debug("node: " + JSON.stringify(node));

            //console.debug("table_conf: " + JSON.stringify(table_conf));
            //console.debug("header_conf: " + JSON.stringify(header_conf));
            //console.debug("column_conf: " + JSON.stringify(column_conf));


            // ##########
            // list all objects in db
            // ##########


            // var table_obj = createTable(table_conf, key);

            var div_table_obj = document.createElement("div");
            div_table_obj.setAttribute("class", "tableContainer");
            var table_obj = document.createElement("table");

            table_obj.setAttribute("class", "scrollTable");
            table_obj.setAttribute("width", "100%");
            table_obj.setAttribute("id", table_id);
            table_obj.setAttribute("indexedDbName", indexedDbName);
            table_obj.setAttribute("objectStoreName", objectStoreName);

            div_table_obj.appendChild(table_obj);

            var thead = document.createElement("thead");
            thead.setAttribute("class", "fixedHeader");
            thead.appendChild(writeTableHeaderRow("normalRow", header_conf));

            table_obj.appendChild(thead);

            node.appendChild(table_obj);

            var tbody = document.createElement("tbody");
            tbody.setAttribute("class", "scrollContent");

            node.appendChild(tbody);

            var dbRequest = indexedDB.open(indexedDbName);
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
                var transaction = database.transaction(objectStoreName, 'readonly');
                var objectStore = transaction.objectStore(objectStoreName);

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items
                    // in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        // console.debug(res);
                        for (const url of res) {

                            const tr = writeTableRow(url, column_conf, keyId_json_path);

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

                }

            };
            table_obj.appendChild(tbody);

            try {
                console.debug("insert before");
                console.debug(node.querySelectorAll("button")[0]);
                node.insertBefore(table_obj, node.querySelectorAll("button")[0]);
            } catch (e) {
                node.appendChild(table_obj);

            }

            resolve(div_table_obj);

        });
    } catch (e) {
        console.debug(e)
    }

}

var TableLastSortedColumn = -1;

// pass in a JSON with a descrition columns
// return

function createTable(data, table_conf, row_conf, column_conf) {
    // console.debug("# createTable" );
    // console.debug("data: " + JSON.stringify(data));
    // console.debug("table_conf: " + JSON.stringify(table_conf));
    // console.debug("row_conf: " + JSON.stringify(row_conf));
    // console.debug("column_conf: " + JSON.stringify(column_conf));

    var table_obj = null;

    try {
        table_obj = document.createElement("table");

        if (table_conf.hasOwnProperty('class')) {
            table_obj.setAttribute("class", table_conf.class);
        }
        // table_obj.setAttribute("width", "100%");

        // loop though data to create one row for each
        var i = 0;
        while (i < data.length && i < 5) {

            var tr_i = createTableRow(data[i], row_conf, column_conf);

            table_obj.appendChild(tr_i);
            i++;
        }

    } catch (e) {
        console.debug(e)
    }

    return table_obj;
}

function createTableRow(data, row_conf, column_conf) {
    console.debug("# createTableRow start");
    console.debug("data: " + JSON.stringify(data));
    console.debug("row_conf: " + JSON.stringify(row_conf));
    console.debug("column_conf: " + JSON.stringify(column_conf));

    var row_obj = null;

    try {
        row_obj = document.createElement("tr");

        if (row_conf.hasOwnProperty('class')) {
            row_obj.setAttribute("class", row_conf.class);
        }

        // table_obj.setAttribute("id", table_id);

        // loop though column conf to create one column for each
        var i = 0;
        var column_count = column_conf.length;
        // console.debug("column_count: " + column_count);
        while (i < column_count && i < 5) {

            var tr_i = writeTableCell(data, column_conf[i]);

            row_obj.appendChild(tr_i);
            i++;
        }

    } catch (e) {
        console.debug(e)
    }

    return row_obj;

}

// ensure fixed header row in scrollable table
// http://www.imaputz.com/cssStuff/bigFourVersion.html

// return table row (header) object
function writeTableHeaderRow(row_class, row_conf) {
    //  console.debug("## writeTableHeaderRow");


    var tr = null;

    try {

        // t_head.setAttribute("style", "position: absolute; color: #000");

        tr = document.createElement("tr");
        // tr.setAttribute("style", "display: block; position: relative; color:
        // #000");
        tr.setAttribute("class", row_class);

        for (var i = 0; i < row_conf.length; i++) {
            var obj = row_conf[i];
            // create a column for each

            // console.debug(JSON.stringify(obj));
            // console.debug("create column header ");

            var i_col = document.createElement("th");

            i_col.setAttribute("col_num", i);
            // i_col.setAttribute("style", "background: #C96; text-align: left;
            // border-top: 1px; padding: 4px" );

            // create clickable link
            var a_ref = document.createElement("a");
            // set data type here
            // T for text
            // D for dates
            // N for numbers
            // a_ref.setAttribute("href", "javascript:SortTable("+i+",'T'," +
            // table_id +");");
            // i_col.innerHTML = obj.text;
            i_col.appendChild(document.createTextNode(obj.text));

            // create event listener to trigger sorting on the column
            i_col.addEventListener('click', function (event) {
                // SortTable(i, 'T', table_id);
                sortColumn(event);
            })
            i_col.appendChild(a_ref);
            tr.appendChild(i_col);

        }
    } catch (e) {
        console.debug(e)
    }

    return tr;

}

function sortColumn(event) {

    console.debug(event);

    console.debug(event.target);
    console.debug(event.target.th);
    var node = event.target;
    // get the number of the column

    var col_num = event.target.getAttribute('col_num');
    console.debug("col_num: " + col_num);
    // get the type of sort (text etc.)
    var sort_type = "T";
    console.debug("sort_type: " + sort_type);

    // get the direction of sort

    // id of table
    var table_id = event.target.parentNode.parentNode.parentNode.getAttribute('id');

    console.debug(event.target.parentNode);
    console.debug(event.target.parentNode.parentNode);
    console.debug(event.target.parentNode.parentNode.parentNode);
    console.debug(event.target.parentNode.parentNode.parentNode.getAttribute('id'));

    console.debug("table_id: " + table_id);

    SortTable(col_num, sort_type, table_id);
    // trigger redraw/reflow
    // document.getElementsByTagName('body')[0].focus();

    console.debug("table_id: " + table_id);
    console.debug(document.getElementById(table_id));
    reflow(document.getElementById(table_id));

}

function SortTable() {
    var sortColumn = parseInt(arguments[0]);
    var type = arguments.length > 1 ? arguments[1] : 'T';
    var TableIDvalue = arguments.length > 2 ? arguments[2] : '';
    var dateformat = arguments.length > 3 ? arguments[3] : '';

    var table = document.getElementById(TableIDvalue);

    // console.debug(sortColumn);
    // console.debug(type);
    // console.debug(TableIDvalue);
    // console.debug(table);

    var tbody = table.getElementsByTagName("tbody")[0];
    // get the principal rows in the table
    // var rows = tbody.getElementsByTagName("tr");

    var rows = tbody.querySelectorAll('tr.normalRow');
    var arrayOfRows = new Array();
    type = type.toUpperCase();
    dateformat = dateformat.toLowerCase();
    for (var i = 0, len = rows.length; i < len; i++) {
        arrayOfRows[i] = new Object;
        arrayOfRows[i].oldIndex = i;
        // console.debug(rows);
        // console.debug(rows[i]);
        // console.debug(rows[i].getElementsByTagName("td"));
        // console.debug(sortColumn);
        // console.debug(rows[i].getElementsByTagName("td")[sortColumn]);
        var celltext = rows[i].getElementsByTagName("td")[sortColumn].innerHTML.replace(/<[^>]*>/g, "");
        if (type == 'D') {
            arrayOfRows[i].value = GetDateSortingKey(dateformat, celltext);
        } else {
            var re = type == "N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
            console.debug(celltext.replace(re, "").substr(0, 25).toLowerCase());
            arrayOfRows[i].value = celltext.replace(re, "").substr(0, 25).toLowerCase();
        }
    }
    if (sortColumn == TableLastSortedColumn) {
        arrayOfRows.reverse();
    } else {
        TableLastSortedColumn = sortColumn;
        switch (type) {
        case "N":
            arrayOfRows.sort(CompareRowOfNumbers);
            break;
        case "D":
            arrayOfRows.sort(CompareRowOfNumbers);
            break;
        default:
            arrayOfRows.sort(CompareRowOfText);
        }
    }
    var newTableBody = document.createElement("tbody");
    newTableBody.setAttribute("class", "scrollContent");
    for (var i = 0, len = arrayOfRows.length; i < len; i++) {
        newTableBody.appendChild(rows[arrayOfRows[i].oldIndex].cloneNode(true));
    }

    var one = tbody.parentNode.replaceChild(newTableBody, tbody);

    reflow(one);

} // function SortTable()

function CompareRowOfText(a, b) {
    var aval = a.value;
    var bval = b.value;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfText()

function CompareRowOfNumbers(a, b) {
    var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
    var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfNumbers()

function GetDateSortingKey(format, text) {
    if (format.length < 1) {
        return "";
    }
    format = format.toLowerCase();
    text = text.toLowerCase();
    text = text.replace(/^[^a-z0-9]*/, "");
    text = text.replace(/[^a-z0-9]*$/, "");
    if (text.length < 1) {
        return "";
    }
    text = text.replace(/[^a-z0-9]+/g, ",");
    var date = text.split(",");
    if (date.length < 3) {
        return "";
    }
    var d = 0,
    m = 0,
    y = 0;
    for (var i = 0; i < 3; i++) {
        var ts = format.substr(i, 1);
        if (ts == "d") {
            d = date[i];
        } else if (ts == "m") {
            m = date[i];
        } else if (ts == "y") {
            y = date[i];
        }
    }
    d = d.replace(/^0/, "");
    if (d < 10) {
        d = "0" + d;
    }
    if (/[a-z]/.test(m)) {
        m = m.substr(0, 3);
        switch (m) {
        case "jan":
            m = String(1);
            break;
        case "feb":
            m = String(2);
            break;
        case "mar":
            m = String(3);
            break;
        case "apr":
            m = String(4);
            break;
        case "may":
            m = String(5);
            break;
        case "jun":
            m = String(6);
            break;
        case "jul":
            m = String(7);
            break;
        case "aug":
            m = String(8);
            break;
        case "sep":
            m = String(9);
            break;
        case "oct":
            m = String(10);
            break;
        case "nov":
            m = String(11);
            break;
        case "dec":
            m = String(12);
            break;
        default:
            m = String(0);
        }
    }
    m = m.replace(/^0/, "");
    if (m < 10) {
        m = "0" + m;
    }
    y = parseInt(y);
    if (y < 100) {
        y = parseInt(y) + 2000;
    }
    return "" + String(y) + "" + String(m) + "" + String(d) + "";
} // function GetDateSortingKey()


// return td object
function writeTableCell(data, cell_conf) {
    // console.debug("### writeTableCell ");
    // console.debug("data: " + JSON.stringify(data));
    // console.debug("cell_conf: " + JSON.stringify(cell_conf));

    var cell = null;
    try {

        cell = document.createElement("td");
        if (cell_conf.hasOwnProperty('class')) {
            cell.setAttribute("class", cell_conf['class']);
        }

        var json_path = "";
        if (cell_conf.hasOwnProperty('json_path')) {
            json_path = cell_conf['json_path'];

            cell.appendChild(document.createTextNode(data[json_path]));
        }
        // console.debug("json_path: " +json_path );
        // console.debug("data: " +data[json_path] );


    } catch (e) {
        console.debug(e)
    }
    return cell;
}

function writeTableNode(rule, node_conf, type, key) {
    // console.debug("### writeTableNode ");
    // console.debug("rule " + JSON.stringify(rule));
    // console.debug(rule);

    var node = null;
    var n = node_conf;
    try {
        // console.debug("node definition " + JSON.stringify(node_conf));

        node = document.createElement(node_conf.name);

        // node configuration has sub nodes ?
        if (node_conf.hasOwnProperty('subnodes')) {

            for (var i = 0; i < node_conf.subnodes.length; i++) {
                // var obj = node_conf.subnodes[i];
                // console.debug("###### has sub nodes " + JSON.stringify(obj));
                node.appendChild(writeTableNode(rule, node_conf.subnodes[i], type, key));
            }
        }

        if (node_conf.hasOwnProperty('class')) {
            node.setAttribute("class", node_conf['class']);
        }
        if (node_conf.hasOwnProperty('text')) {
            // node.appendChild(document.createTextNode(node_conf.text.substring(1)));
            node.appendChild(document.createTextNode(node_conf.text));

            // node.appendChild(document.createTextNode("HHHH"));
        }
        if (node_conf.hasOwnProperty('EventListener')) {

            var func = node_conf.EventListener.func;

            // console.debug("node hadeleteObjects event listener function:" +
            // func);

            // depending on the parameter set for which function to call

            switch (func) {
            case "deleteObject":
                // console.debug("####node has event listener
                // deleteDecryptionKey:" +
                // func);
                node.addEventListener('click', function () {
                    deleteObject(event);
                })
                break;
            case "updateObject":
                // console.debug("####node has event listener
                // updateEncryptionKey:" +
                // func);
                node.addEventListener('click', function (event) {
                    console.debug(event);
                    updateObject(event);
                })
                break;
            case "exportObject":
                // console.debug("####node has event listener exportPrivateKey:" +
                // func);
                node.addEventListener('click', function () {
                    exportObject(event);
                })
                break;
            }
        }
    } catch (e) {
        console.debug(e)
    }
    return node;
}

// return tr object
function writeTableRow(row_data, column_conf, keyId_json_path) {
    //console.trace("## writeTableRow");
    //console.trace("row_data " + JSON.stringify(row_data));
    //console.trace("column_conf " + JSON.stringify(column_conf));
    //console.trace("key " + JSON.stringify(key));
    // console.trace("type " + JSON.stringify(type));

    // start a table row
    const tr = document.createElement("tr");
    try {

        // look through the column definitions as to what goes into the fields in a
        // table row. For each definition create a data cell (td) in the table row (tr)
        var i = 0;
        while (i < column_conf.length && i < 15) {
            try {
                // each table row represents a unique value in the database. Add a reference to this in the row objwct itself


                if (row_data.hasOwnProperty(keyId_json_path)) {
                    tr.setAttribute('object_id', row_data[keyId_json_path]);
                }

                var cell_conf = column_conf[i];
                //   console.debug("cell_conf " + JSON.stringify(cell_conf));

                var i_col = document.createElement("td");

                // present according to the specification in the "format"-field in
                // the column configuration
                var presentation_format = "text";
                if (cell_conf.hasOwnProperty('presentation_format')) {
                    presentation_format = cell_conf.presentation_format;
                }
                // add any additional attributes to the node
                if (cell_conf.hasOwnProperty('other_attributes')) {
                    for (var a = 0; a < cell_conf.other_attributes.length; a++) {
                        Object.keys(cell_conf.other_attributes[a]).forEach(function (key) {
                            i_col.setAttribute(key, cell_conf.other_attributes[a][key]);
                        })

                    }
                }

                if (cell_conf.hasOwnProperty('json_path')) {
                    // use value json_path to lookup in the row_data json structure

                    var cell_data = row_data[cell_conf.json_path];

                    if (presentation_format == "JSON") {

                        i_col.appendChild(document.createTextNode(JSON.stringify(cell_data)));
                    } else if (presentation_format == "table") {
                        // render a table inside the cell based on the detailed
                        // specifications contained in the "cell_table_column_conf"
                        // is not was specified, forget it.
                        if (cell_conf.hasOwnProperty('cell_table_conf')) {
                            var cell_table_conf = cell_conf.cell_table_conf;

                            var cell_table = document.createElement("table");
                            cell_table.setAttribute('class', cell_table_conf.table_conf.class);

                            // loop through all data objects that need a separate
                            // row in the cell-level
                            // table
                            var cell_table_row_count = cell_data.length;

                            // set a maximum of row permitted in a table embedded
                            // inside a cell
                            var max_cell_table_rows = 8;
                            var k = 0;
                            while (k < cell_table_row_count && k < max_cell_table_rows) {
                                var cell_data_row = cell_data[k];

                                var cell_table_row = document.createElement("tr");
                                cell_table_row.setAttribute('class', cell_table_conf.row_conf.class);

                                // loop through all cells configure for this row

                                var cell_table_row_cell_count = cell_table_conf.column_conf.length;

                                // iterate over the number of configured columns
                                // (max 15)
                                var max_cell_table_cells = 15;
                                var m = 0;
                                while (m < cell_table_row_cell_count && m < max_cell_table_cells) {
                                    var cell_table_column_conf = cell_table_conf.column_conf[m];
                                	var cell_table_cell = document.createElement("td");
                                    try {
                                    	if (cell_table_column_conf.class) {
                                    		cell_table_cell.setAttribute('class', cell_table_column_conf.class);
                                    	}
                                        var cell_data_path = cell_table_column_conf.json_path;
                                        // look for path in "cell_data_path" variable in the row_data object
                                        var presentation_format = cell_table_column_conf.presentation_format;

                                        // depending on the presentation format take
                                        // configurable action here
                                        if (presentation_format == "table") {
                                            // create a small table to contain the list

                                            var list_table = createTable(cell_data_row[cell_data_path], cell_table_column_conf.cell_table_conf.table_conf, cell_table_column_conf.cell_table_conf.row_conf, cell_table_column_conf.cell_table_conf.column_conf);
                                            cell_table_cell.appendChild(list_table);

                                        } else {
                                            // present the data as text
                                            var newContent = document.createTextNode(cell_data_row[cell_data_path]);
                                            cell_table_cell.appendChild(newContent);
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                    cell_table_row.appendChild(cell_table_cell);
                                    m++
                                }

                                // add row to table
                                cell_table.appendChild(cell_table_row);
                                k++;
                            }

                            i_col.appendChild(cell_table);

                        } else {
                            console.error("cell_table_column_conf attribute missing");
                        }
                    } else if (presentation_format == "dropdown") {
                        // render a dropdown list

                    } else {
                        // for all other, treat as cell content as plain text
                        i_col.appendChild(document.createTextNode(row_data[cell_conf.json_path]));
                    }
                } else if (cell_conf.hasOwnProperty('node')) {

                    var node = writeTableNode(row_data, cell_conf.node);

                    // any eventlisteners defined ?

                    i_col.appendChild(node);

                }
            } catch (e) {
                console.error(e);
            }
            tr.setAttribute("class", "normalRow");
            tr.appendChild(i_col);
            i++;
        }
    } catch (e) {
        console.error(e);
    }

    return tr;
}

function reflow(elt) {
    void elt.offsetWidth;
    console.debug(elt.offsetHeight);
}

