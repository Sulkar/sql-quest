$( document ).ready(function() {

	var execBtn = document.getElementById("execute");
	var outputElm = document.getElementById('output');
	var errorElm = document.getElementById('error');
	var commandsElm = document.getElementById('commands');
	var dbFileElm = document.getElementById('dbfile');
	var savedbElm = document.getElementById('savedb');

	var jsonDatabases; 
	var currentTables = [];

	// Start the worker in which sql.js will run
	var worker = new Worker("dist/worker.sql-wasm.js");
	worker.onerror = error;
	// Open a database
	worker.postMessage({ action: 'open' });

	// lädt JSON TableData
	var requestURL = 'data/sqlTableData.json';
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();

	request.onload = function() {
		var tempJson = request.response;
		jsonDatabases = tempJson['databases'];
		// DropDown Element mit den Namen der Datenbanken in der JSON Datei erweitern:
		for(var i = 0; i < jsonDatabases.length; i++) {
			$("#selectTable").append(new Option(jsonDatabases[i]['name'], jsonDatabases[i]['id']));
		}
	}

	// lädt anhand der ID eine Datenbank
	function execLoadJsonDB(id) {
		if(id != "init"){
			// lösche alle bereits vorhandenen Tabellen
			currentTables.forEach(function(table, index){
				execute('DROP TABLE ' + table + ';')
			});
			currentTables = [];
			
			id = parseInt(id);
			noerror();
			// baut Query zusammen
			var tempSQLQuery = "";
			for(var i = 0; i < jsonDatabases[id]['tables'].length; i++){
				// Name der Tabelle wird gespeichert
				currentTables.push(jsonDatabases[id]['tables'][i]['name']);
				// SQL zum Erstellen der Tabelle
				tempSQLQuery += jsonDatabases[id]['tables'][i].table;
				// SQL zum Hinzufügen der Rows
				for(var j = 0; j < jsonDatabases[id]['tables'][i]['rows'].length; j++) {
					tempSQLQuery += jsonDatabases[id]['tables'][i]['rows'][j].row;
				}
			}
			// erstellt einen Informations
			var tempInfos = "Aktuelle Datenbank: " + jsonDatabases[id]['name'];
			currentTables.forEach(function(table, index){
				tempInfos += "<br>" + (index+1) + ". Tabelle: " + table;
			});
			$("#tableInfo").html(tempInfos);
			// führt den zusammengebauten Query aus
			execute(tempSQLQuery + "SELECT name, sql FROM sqlite_master WHERE type='table';");
			
			// TEST fill Code Selection
			fillSelectWithTables(currentTables);
		}
	}

	// DropDown event Listener
	$('#selectTable').on('change', function() {
		if(this.value != "init"){
			editor.setValue("SELECT * FROM ");
			execLoadJsonDB(this.value)
		}
	});

	// Connect to the HTML element we 'print' to
	function print(text) {
		outputElm.innerHTML = text.replace(/\n/g, '<br>');
	}
	function error(e) {
		console.log(e);
		errorElm.style.height = '2em';
		errorElm.textContent = e.message;
	}

	function noerror() {
		errorElm.style.height = '0';
	}

	// Run a command in the database
	function execute(commands) {
		tic();
		worker.onmessage = function (event) {
			var results = event.data.results;
			toc("Executing SQL");
			if (!results) {
				error({message: event.data.error});
				return;
			}

			tic();
			outputElm.innerHTML = "";
			for (var i = 0; i < results.length; i++) {
				outputElm.appendChild(tableCreate(results[i].columns, results[i].values));
			}
			toc("Displaying results");
		}
		worker.postMessage({ action: 'exec', sql: commands });
		outputElm.textContent = "Fetching results...";
	}

	// Create an HTML table
	var tableCreate = function () {
		function valconcat(vals, tagName) {
			if (vals.length === 0) return '';
			var open = '<' + tagName + '>', close = '</' + tagName + '>';
			return open + vals.join(close + open) + close;
		}
		return function (columns, values) {
			var tbl = document.createElement('table');
			var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
			var rows = values.map(function (v) { return valconcat(v, 'td'); });
			html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
			tbl.innerHTML = html;
			return tbl;
		}
	}();

	// Execute the commands when the button is clicked
	function execEditorContents() {
		noerror()
		execute(editor.getValue() + ';');
	}
	execBtn.addEventListener("click", execEditorContents, true);

	// Performance measurement functions
	var tictime;
	if (!window.performance || !performance.now) { window.performance = { now: Date.now } }
	function tic() { tictime = performance.now() }
	function toc(msg) {
		var dt = performance.now() - tictime;
		console.log((msg || 'toc') + ": " + dt + "ms");
	}

	// Add syntax highlighting to the textarea
	var editor = CodeMirror.fromTextArea(commandsElm, {
		mode: 'text/x-mysql',
		viewportMargin: Infinity,
		indentWithTabs: true,
		smartIndent: true,
		lineNumbers: true,
		matchBrackets: true,
		autofocus: true,
		extraKeys: {
			"Ctrl-Enter": execEditorContents,
			"Ctrl-S": savedb,
		}
	});

	// Load a db from a file
	dbFileElm.onchange = function () {
		var f = dbFileElm.files[0];
		var r = new FileReader();
		r.onload = function () {
			worker.onmessage = function () {
				toc("Loading database from file");
				// Show the schema of the loaded database
				editor.setValue("SELECT `name`, `sql`\n  FROM `sqlite_master`\n  WHERE type='table';");
				execEditorContents();
			};
			tic();
			try {
				worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
			}
			catch (exception) {
				worker.postMessage({ action: 'open', buffer: r.result });
			}
		}
		r.readAsArrayBuffer(f);
	}

	// Save the db to a file
	function savedb() {
		worker.onmessage = function (event) {
			toc("Exporting the database");
			var arraybuff = event.data.buffer;
			var blob = new Blob([arraybuff]);
			var a = document.createElement("a");
			document.body.appendChild(a);
			a.href = window.URL.createObjectURL(blob);
			a.download = "sql.db";
			a.onclick = function () {
				setTimeout(function () {
					window.URL.revokeObjectURL(a.href);
				}, 1500);
			};
			a.click();
		};
		tic();
		worker.postMessage({ action: 'export' });
	}
	savedbElm.addEventListener("click", savedb, true);

	// fill Button Selection with current tables
	function fillSelectWithTables(currentTables){
		$('#selectFROM option').remove();
		$("#selectFROM").append(new Option("..."));
		for(var i = 0; i < currentTables.length; i++) {
			console.log(currentTables[i]);
			$("#selectFROM").append(new Option(currentTables[i]));
		}
	}
});