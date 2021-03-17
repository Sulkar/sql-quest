




async function loadDB() {

    // The producing code (this may take some time)
    const sqlPromise = initSqlJs({
        locateFile: file => `/dist/${file}`
    });
    const dataPromise = fetch("/data/mitarbeiterDB.db").then(res => res.arrayBuffer());

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    return new SQL.Database(new Uint8Array(buf));

}

var db2;
loadDB().then(function (dbCon) {
    db2 = dbCon;
    console.log(db2);
    $(".btnCode-db").click(function () {
        var contents1 = db2.exec("SELECT * FROM sqlite_master WHERE type = 'table'");
        var contents2 = db2.exec("SELECT * FROM pragma_table_info ('mitarbeiter')");
        console.log(contents1);
        console.log(contents2);
    });

}, function (error) { console.log(error) });


