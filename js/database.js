





function loadDatabases() {
    config = {
        locateFile: filename => `/dist/${filename}`
    }
    // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
    // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
    initSqlJs(config).then(function (SQL) {
        //Create the database
        var db = new SQL.Database();
        // Run a query without reading the results
        db.run("CREATE TABLE test (col1, col2);");
        // Insert two rows: (1,111) and (2,222)
        db.run("INSERT INTO test VALUES (?,?), (?,?)", [1, 111, 2, 222]);

        // Prepare a statement
        var stmt = db.prepare("SELECT * FROM test WHERE col1 BETWEEN $start AND $end");
        stmt.getAsObject({ $start: 1, $end: 1 }); // {col1:1, col2:111}

        // Bind new values
        stmt.bind({ $start: 1, $end: 2 });
        while (stmt.step()) { //
            var row = stmt.getAsObject();
            console.log('Here is a row: ' + JSON.stringify(row));
        }
    });
}

