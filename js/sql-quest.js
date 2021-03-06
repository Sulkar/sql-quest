$(document).ready(function () {

    //global variables
    var NR = 0;
    var CURRENT_SELECTED_ELEMENT = undefined;
    var NEXT_ELEMENT_NR = 0;
    var CURRENT_SELECTED_SQL_ELEMENT = "START";
    var ACTIVE_CODE_VIEW_DATA; // JSON Data holder
    var USED_TABLES = []; // listet alle genutzten Tabellen einer DB auf, um SELECTs entsprechend zu erstellen
    var CURRENT_SQL_DATABASE; //aktuell geladene DB im JSON Format

    //////////
    // INIT //

    //function: Datenbank und JSON für active code view werden geladen
    async function init(datenbankName) {
        //fetch Database
        const sqlPromise = initSqlJs({
            locateFile: file => `/dist/${file}`
        });
        const dataPromise = fetch("/data/" + datenbankName).then(res => res.arrayBuffer());

        //fetch active code view json
        const activeCodeViewPromise = fetch("/data/activeCodeViewData.json");

        const [SQL, bufferedDatabase, activeCodeView] = await Promise.all([sqlPromise, dataPromise, activeCodeViewPromise]);
        const jsonData = await activeCodeView.json();

        return [new SQL.Database(new Uint8Array(bufferedDatabase)), jsonData];
    }

    // START - when data is loaded
    init("mitarbeiterDB.db").then(function (initObject) {
        CURRENT_SQL_DATABASE = initObject[0];
        ACTIVE_CODE_VIEW_DATA = initObject[1];

        CURRENT_SQL_DATABASE_TABLES = getSqlTables();
        updateActiveCodeView();
        fillSelectionTables();

    }, function (error) { console.log(error) });

    ////////////
    // EVENTS //

    // Button: SELECT ___ FROM ___
    $('.btnSelect').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        CURRENT_SELECTED_ELEMENT = undefined;
        var elementSELECT_FROM = "<span class='codeline'>";
        elementSELECT_FROM += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " start parent sqlIdentifier inputFields' data-sql-element='SELECT'>SELECT";
        NR++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='SELECT_SELECT' data-next-element='" + (NR + 4) + "'>___</span>";
        NR++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + NR + "' data-goto-element='" + (NR - 4) + "'>FROM</span>";
        NR++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier active' data-sql-element='SELECT_FROM' data-next-element='" + (NR - 4) + "'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementSELECT_FROM += "</span></span>";
        $('.codeArea pre code').append(elementSELECT_FROM);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    // Button: WHERE ___ ___ ___ 
    $('.btnWhere').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementWHERE = "<span class='codeline'>";
        elementWHERE += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='WHERE'>WHERE";
        NR++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (NR + 2) + "'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (NR + 2) + "'>___</span>";
        NR++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (NR - 4) + "'>___</span>";
        NR++;
        elementWHERE += "</span></span>";

        if (CURRENT_SELECTED_ELEMENT.find(".codeline").first().length > 0) {
            CURRENT_SELECTED_ELEMENT.find(".codeline").first().before(elementWHERE);
        } else {
            CURRENT_SELECTED_ELEMENT.closest(".codeline").after(elementWHERE);
        }

        setSelection(NEXT_ELEMENT_NR, false);
    });

    // Button: JOIN ___ ON ___ ___ ___ 
    $('.btnJoin').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementJOIN = "<span class='codeline'>";
        elementJOIN += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='JOIN'>JOIN";
        NR++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_1' data-next-element='" + (NR + 2) + "'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + NR + "' data-goto-element='" + (NR - 4) + "'>ON</span>";
        NR++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_2' data-next-element='" + (NR + 2) + "'>___</span>";
        NR++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_3' data-next-element='" + (NR - 4) + "'>___</span>";
        NR++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_4' data-next-element='" + (NR - 4) + "'>___</span>";
        NR++;
        elementJOIN += "</span></span>";

        if (CURRENT_SELECTED_ELEMENT.find(".codeline").first().length > 0) {
            CURRENT_SELECTED_ELEMENT.find(".codeline").first().before(elementJOIN);
        } else {
            CURRENT_SELECTED_ELEMENT.closest(".codeline").after(elementJOIN);
        }
        setSelection(NEXT_ELEMENT_NR, false);
    });

    //Button: AND
    $('.btnAND').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var parentSqlIdentifier = CURRENT_SELECTED_ELEMENT.data("sql-element");
        var elementWhereAND = "";
        elementWhereAND += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='AND'>";
        NR++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "AND";
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_AND_1' data-next-element='" + (NR + 2) + "'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_AND_2' data-next-element='" + (NR + 2) + "'>___</span>";
        NR++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_AND_3' data-next-element='" + (NR - 4) + "'>___</span>";
        NR++;
        elementWhereAND += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementWhereAND);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    //Button: OR
    $('.btnOR').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var parentSqlIdentifier = CURRENT_SELECTED_ELEMENT.data("sql-element");
        var elementWhereOR = "";
        elementWhereOR += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='OR'>";
        NR++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "OR";
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_OR_1' data-next-element='" + (NR + 2) + "'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_OR_2' data-next-element='" + (NR + 2) + "'>___</span>";
        NR++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_OR_3' data-next-element='" + (NR - 4) + "'>___</span>";
        NR++;
        elementWhereOR += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementWhereOR);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    //Button: LeftBracket
    $('.btnLeftBracket').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        if (CURRENT_SELECTED_ELEMENT.hasClass("inputField")) {
            CURRENT_SELECTED_ELEMENT.before("<span class='codeElement_" + NR + "  " + classesFromCodeComponent + " sqlIdentifier extended' data-sql-element='LEFTBRACKET'> ( </span>");
            NR++;
        }
    });
    //Button: RightBracket
    $('.btnRightBracket').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        if (CURRENT_SELECTED_ELEMENT.hasClass("inputField")) {
            CURRENT_SELECTED_ELEMENT.after("<span class='codeElement_" + NR + "  " + classesFromCodeComponent + " sqlIdentifier extended' data-sql-element='RIGHTBRACKET'> ) </span>");
            NR++;
        }
    });

    //Button: Add Element "inputField"
    $('.btnAdd').click(function () {
        var dataSqlElement = CURRENT_SELECTED_ELEMENT.data("sql-element");
        if (CURRENT_SELECTED_ELEMENT.hasClass("inputField")) {
            if (hasCurrentSelectedElementSqlDataString(CURRENT_SELECTED_ELEMENT, "_AGGREGAT")) { //...
                CURRENT_SELECTED_ELEMENT.after(addInputField(dataSqlElement, "extendedSpace"));
            } else if (hasCurrentSelectedElementSqlDataString(CURRENT_SELECTED_ELEMENT, "WHERE_3, OR_3, AND_3")) { //...
                CURRENT_SELECTED_ELEMENT.after(addInputField(dataSqlElement, "extendedSpace"));
            } else {
                CURRENT_SELECTED_ELEMENT.after(addInputField(dataSqlElement, "extendedComma"));
            }
            setSelection(NEXT_ELEMENT_NR, false);
        }
    });

    // Button: ORDER BY ___ 
    $('.btnOrder').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementORDER = "";
        elementORDER += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='ORDER'>";
        NR++;
        elementORDER += addLeerzeichen();
        elementORDER += "ORDER BY";
        elementORDER += addLeerzeichen();
        elementORDER += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='ORDER_1' data-next-element='" + (NR + 2) + "'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementORDER += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementORDER);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    //Button: ASC
    $('.btnAsc').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementOrderAsc = "";
        elementOrderAsc += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='ASC'>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementOrderAsc += addLeerzeichen();
        elementOrderAsc += "ASC";
        elementOrderAsc += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementOrderAsc);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    //Button: DESC
    $('.btnDesc').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementOrderDesc = "";
        elementOrderDesc += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='DESC'>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementOrderDesc += addLeerzeichen();
        elementOrderDesc += "DESC";
        elementOrderDesc += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementOrderDesc);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    // Button: LIMIT ___ = [offset,] row_count
    $('.btnLimit').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementLIMIT = "";
        elementLIMIT += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='LIMIT'>";
        NR++;
        elementLIMIT += addLeerzeichen();
        elementLIMIT += "LIMIT";
        elementLIMIT += addLeerzeichen();
        elementLIMIT += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='LIMIT_1' >___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementLIMIT += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementLIMIT);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    // Button: GROUP BY ___ 
    $('.btnGroup').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementGROUP = "";
        elementGROUP += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='GROUP'>";
        NR++;
        elementGROUP += addLeerzeichen();
        elementGROUP += "GROUP BY";
        elementGROUP += addLeerzeichen();
        elementGROUP += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='GROUP_1'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementGROUP += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementGROUP);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    // Button: HAVING ___ ___ ___ = like WHERE but can handle Aggregate functions
    $('.btnHaving').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementHAVING = "";
        elementHAVING += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='HAVING'>";
        NR++;
        elementHAVING += addLeerzeichen();
        elementHAVING += "HAVING";
        elementHAVING += addLeerzeichen();
        elementHAVING += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='HAVING_1' data-next-element='" + (NR + 2) + "'>___</span>";
        NEXT_ELEMENT_NR = NR;
        NR++;
        elementHAVING += addLeerzeichen();
        elementHAVING += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='HAVING_2' data-next-element='" + (NR + 2) + "'>___</span>";
        NR++;
        elementHAVING += addLeerzeichen();
        elementHAVING += "<span class='codeElement_" + NR + " inputField unfilled root sqlIdentifier' data-sql-element='HAVING_3' data-next-element='" + (NR - 4) + "'>___</span>";
        NR++;
        elementHAVING += "</span>";

        CURRENT_SELECTED_ELEMENT.closest(".parent").first().after(elementHAVING);
        setSelection(NEXT_ELEMENT_NR, false);
    });

    // Select: add dbField, dbTable, Aggregatsfunktion
    $('.buttonArea').on('change', '.codeSelect', function () {
        if (CURRENT_SELECTED_ELEMENT != undefined) {
            var tempSelectField = this;
            var returnObject = {};
            // wich select is triggering?
            // -> selField, selTable
            if ($(tempSelectField).hasClass("selField") || $(tempSelectField).hasClass("selTable") || $(tempSelectField).hasClass("selOperators")) {

                if (CURRENT_SELECTED_ELEMENT.hasClass("extended") && CURRENT_SELECTED_ELEMENT.hasClass("comma")) { //Feld erweitert ,___
                    returnObject = addSelectValue(tempSelectField);
                    CURRENT_SELECTED_ELEMENT.replaceWith(returnObject.tempSelectValue);
                    CURRENT_SELECTED_ELEMENT = $(returnObject.thisCodeElement);

                    setSelection("next", false);
                } else if (CURRENT_SELECTED_ELEMENT.hasClass("extended")) { //Feld erweitert ___
                    returnObject = addSelectValue(tempSelectField);
                    CURRENT_SELECTED_ELEMENT.replaceWith(returnObject.tempSelectValue);
                    CURRENT_SELECTED_ELEMENT = $(returnObject.thisCodeElement);

                    setSelection("next", false);

                } else if (CURRENT_SELECTED_ELEMENT.hasClass("root")) { //Feld normal ___
                    returnObject = addSelectValue(tempSelectField);
                    CURRENT_SELECTED_ELEMENT.replaceWith(returnObject.tempSelectValue);
                    CURRENT_SELECTED_ELEMENT = $(returnObject.thisCodeElement);

                    setSelection("next", false);
                }
            }
            // -> selAggregate
            else if ($(tempSelectField).hasClass("selAggregate")) {
                CURRENT_SELECTED_ELEMENT.replaceWith(addAggregat(tempSelectField));
                setSelection(NEXT_ELEMENT_NR, false);
            }
        }

        // aktualisiert alle .selField <select>
        updateSelectCodeComponents();
        //reset select option
        $(this)[0].selectedIndex = 0;
    });

    // Button: Delete Element
    $('.btnDelete').click(function () {
        deleteElement(CURRENT_SELECTED_ELEMENT);
        // aktualisiert alle .selField <select>
        updateSelectCodeComponents();
    });

    // on Click Element
    $('body').on('click', 'span', function (event) {
        event.stopPropagation();
        //
        if ($(this).data("goto-element") == "next") {
            var elementNr = "0";
        } else if ($(this).data("goto-element") != undefined) {
            var elementNr = $(this).data("goto-element");
        } else {
            var elementNr = getElementNr($(this).attr("class"));
        }
        setSelection(elementNr, false);
    });

    // on Click CodeArea - deselct
    $('body').on('click', '.codeArea', function (event) {
        event.stopPropagation();
        removeSelection(false);
        checkCodeAreaSQLElements();
    });

    // Input: add text to Selected Element span
    $(".codeInput").on('keyup', function (e) {
        if (CURRENT_SELECTED_ELEMENT != undefined) {
            var tempValue = $(this).val();
            if (tempValue != "") {
                if (isNaN(tempValue)) {
                    CURRENT_SELECTED_ELEMENT.html("'" + tempValue + "'");
                } else {
                    CURRENT_SELECTED_ELEMENT.html(tempValue);
                }
            } else {
                CURRENT_SELECTED_ELEMENT.html("___");
            }
            CURRENT_SELECTED_ELEMENT.addClass("input");
            if (e.key === 'Enter' || e.keyCode === 13) {
                var classesFromCodeComponent = getClassesFromElementAsString(this);
                if (tempValue != "") {
                    CURRENT_SELECTED_ELEMENT.removeClass("unfilled");
                    CURRENT_SELECTED_ELEMENT.addClass(classesFromCodeComponent);
                } else {
                    CURRENT_SELECTED_ELEMENT.addClass("unfilled");
                    CURRENT_SELECTED_ELEMENT.removeClass(classesFromCodeComponent);
                }
                setSelection("next", false);
            }
        }
    });

    ///////////////
    // FUNCTIONS //

    //function: delete element from code area
    function deleteElement(elementToDelete) {
        // Element parent
        if (elementToDelete.hasClass("parent")) {
            setSelection("parent", true);
        }
        // Klammern, ... 
        else if (elementToDelete.hasClass("synBrackets") && elementToDelete.hasClass("extended")) {
            setSelection("next", true);
        }
        // extended inputField
        else if (elementToDelete.hasClass("inputField") && elementToDelete.hasClass("extended")) {
            elementToDelete.prev().remove();
            setSelection("next", true);
        }
        // root inputField remove old Element and create new one
        else if (elementToDelete.hasClass("inputField") && elementToDelete.hasClass("root")) {
            var dataSqlElement = elementToDelete.data("sql-element");
            elementToDelete.replaceWith(addInputField(dataSqlElement, "root"));
            setSelection(NEXT_ELEMENT_NR, false);
        }
        // don´t delete, select parent Element
        else {
            var elementNr = getElementNr(elementToDelete.parent().attr('class'));
            setSelection(elementNr, false);
        }

        // deletes all empty <span class="codeline">
        $(".codeline").each(function () {
            if ($(this).children().length == 0) $(this).remove();
        });
    }

    //function: befüllt .selTable mit allen Tabellen der Datenbank
    function fillSelectionTables() {
        clearSelectionOptions(".selTable");
        var databaseTables = getSqlTables();
        for (var i = 0; i < databaseTables.length; i++) {
            $(".selTable").append(new Option(databaseTables[i], databaseTables[i]));
        }
    }

    //function: entfernt alle select Optionen außer die erste
    function clearSelectionOptions(selectElement) {
        $(selectElement + ' option[value!="0"]').remove();
    }

    //function: lädt eine DB im JSON Format und befüllt die .selTable selection
    function loadJsonDatabase(databaseNameJson) {
        // lädt JSON TableData
        var requestURL = 'data/' + databaseNameJson;
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();

        request.onload = function () {
            var tempJson = request.response;
            CURRENT_JSON_DATABASE = tempJson['tables'];
            fillSelectionTables();
        }
    }

    //function: get all used db tables in code area
    function updateUsedTables() {
        USED_TABLES = [];
        $(".codeArea .selTable").each(function () {
            if (!USED_TABLES.includes($(this).html())) {
                USED_TABLES.push($(this).html());
            }
        });
    }

    //function: erstellt neue select elemente basierend auf den gewählten Tabellen in der code area
    function updateSelectCodeComponents() {
        //check all used tables in code area
        updateUsedTables();
        //entfernt alle "alten" select Elemente 
        $(".buttonArea .selField").remove();
        //entfernt alle .inputField die ein Feld einer gelöscht Tabelle haben
        $(".codeArea .selField").each(function () {
            var isTableActive = false;
            USED_TABLES.forEach(element => {
                if ($(this).hasClass(element)) {
                    isTableActive = true;
                    var updatedFieldNameBasedOnTableCount = $(this).html().replace(element + ".", "");
                    if (USED_TABLES.length > 1) {
                        $(this).html(element + "." + updatedFieldNameBasedOnTableCount);
                    } else {
                        $(this).html(updatedFieldNameBasedOnTableCount);
                    }
                }
            });
            if (!isTableActive) {
                deleteElement($(this));
            }
        });

        //erstellt neue <select> Elemente für die Felder der einzelnen aktiven Tabellen
        USED_TABLES.forEach(element => {
            var selectCodeComponent = "<select class='selField synColumns " + element + " codeSelect'>";
            selectCodeComponent += "<option value='0' disabled selected hidden>Spalten " + element + "</option>";
            selectCodeComponent += "<option value='*'>*</option>";
            selectCodeComponent += "</select>";
            var selectedCodeComponentObject = $.parseHTML(selectCodeComponent);
            $(".buttonArea").append(selectedCodeComponentObject);
            fillSelectionFields(element, selectedCodeComponentObject);
        });
    }

    //function: befüllt die .selField Element mit Feldern der genutzten Datenbanken
    function fillSelectionFields(tableName, selectFields) {
        var tempTableFields = getSqlTableFields(tableName);
        tempTableFields.forEach(element => {
            $(selectFields).append(new Option(element[1], element[1]));
        });
    }

    //function: checks if data-sql-element contains string i.e. "WHERE_3, OR_3, AND_3"
    function hasCurrentSelectedElementSqlDataString(currentSelectedElement, sqlDataIdentifier) {
        var sqlStringFound = false;
        var tempSqlDataArray = sqlDataIdentifier.replaceAll(" ", "").split(",");
        tempSqlDataArray.forEach(element => {
            if (currentSelectedElement.data("sql-element").includes(element)) {
                sqlStringFound = true;
            }
        });
        return sqlStringFound;
    }

    //function: returns a normal or extended inputField ( ___ or ,___ )
    function addInputField(tempSqlElement, type) {
        if (type == "root") {
            var tempInputField = "<span class='codeElement_" + NR + " inputField unfilled sqlIdentifier root' data-sql-element='" + tempSqlElement + "'>___</span>";
        } else if (type == "extendedComma") {
            var tempInputField = addLeerzeichenMitKomma();
            tempInputField += "<span class='codeElement_" + NR + " inputField unfilled sqlIdentifier extended comma' data-sql-element='" + tempSqlElement + "'>___</span>";
        } else if (type == "extendedSpace") {
            var tempInputField = addLeerzeichen();
            tempInputField += "<span class='codeElement_" + NR + " inputField unfilled sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>___</span>";
        }
        NEXT_ELEMENT_NR = NR;
        NR++;
        return tempInputField;

    }
    //function: adds an Aggregat <span> with inputField
    function addAggregat(tempSelectField) {
        var classesFromCodeComponent = getClassesFromElementAsString(tempSelectField);
        var tempSqlElement = CURRENT_SELECTED_ELEMENT.data("sql-element");
        var tempAggregat = "";
        if (CURRENT_SELECTED_ELEMENT.hasClass("extended")) {
            tempAggregat += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " inputField sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "(";
        } else {
            tempAggregat += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " inputField sqlIdentifier root' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "(";
        }
        NR++;
        tempAggregat += addInputField(tempSqlElement + "_AGGREGAT", "root");
        tempAggregat += ")</span>";
        return tempAggregat;
    }

    //function: adds a selected Value from and <select> Component
    function addSelectValue(tempSelectField) {
        var classesFromCodeComponent = getClassesFromElementAsString(tempSelectField);
        var tempSqlElement = CURRENT_SELECTED_ELEMENT.data("sql-element");
        var tempSelectValue = "";
        if (CURRENT_SELECTED_ELEMENT.hasClass("extended")) {
            tempSelectValue += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " inputField sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "</span>";
        } else {
            tempSelectValue += "<span class='codeElement_" + NR + " " + classesFromCodeComponent + " inputField sqlIdentifier root' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "</span>";
        }
        var returnObject = {};
        returnObject.tempSelectValue = tempSelectValue;
        returnObject.thisCodeElement = ".codeElement_" + NR;

        NR++;
        return returnObject;
    }

    //function: liefert alle Klassen eines Elements als Array zurück, außer der letzten Kontrollklasse (codeButton, codeSelect, codeInput)
    function getClassesFromElementAsArray(element) {
        var codeComponentClassesAsArray = $(element).attr("class").split(" ");
        codeComponentClassesAsArray.pop(); //entfernt letzte Kontrollklasse
        return codeComponentClassesAsArray;
    }

    //function: liefert alle Klassen eines Elements als String zurück, außer der letzten Kontrollklasse (codeButton, codeSelect, codeInput)
    function getClassesFromElementAsString(element) {
        var codeComponentClassesAsString = $(element).attr("class").replace(/[\W]*\S+[\W]*$/, '');
        return codeComponentClassesAsString;
    }
    //function: remove Selection from all Elements
    function removeSelection(removeLastSelectedElement) {
        $("[class^='codeElement_']").removeClass("active");
        $(".codeInput").val("");
        if (removeLastSelectedElement) CURRENT_SELECTED_ELEMENT.remove();
        CURRENT_SELECTED_ELEMENT = undefined;
    }

    //function: set Selection to an Element
    function setSelection(elementNr, removeLastSelectedElement) {
        var element;

        //no number is given -> get next unfilled inputField
        if (elementNr == "next") {
            CURRENT_SELECTED_ELEMENT.removeClass("unfilled");
            //find .parent then find .unfilled
            element = CURRENT_SELECTED_ELEMENT.closest(".parent").find(".unfilled").first();
            if (element.length == 0) {
                //find .codeline then find next .unfilled
                element = CURRENT_SELECTED_ELEMENT.closest(".codeline").find(".unfilled").first();
                if (element.length == 0) {
                    //select first parent, if no .unfilled is found
                    element = CURRENT_SELECTED_ELEMENT.parents().closest(".parent").last();
                }
            }
        }
        //.parent ist selektiert
        else if (elementNr == "parent") {
            //select next .parent
            element = CURRENT_SELECTED_ELEMENT.next(".parent");
            if (element.length == 0) {
                //select prev .parent
                element = CURRENT_SELECTED_ELEMENT.prev(".parent");
                if (element.length == 0) {
                    //select last .parent of .codeline before current .codeline
                    element = CURRENT_SELECTED_ELEMENT.parent().prev(".codeline").find(".parent").last();
                    if (element.length == 0) {
                        //select last .parent of .codeline after current .codeline
                        element = CURRENT_SELECTED_ELEMENT.parent().next(".codeline").find(".parent").last();
                    }
                }
            }
        }
        //next element is chosen by number
        else {
            element = $(".codeElement_" + elementNr);
        }

        removeSelection(removeLastSelectedElement);

        if (element.length != 0) {
            element.addClass("active");
            CURRENT_SELECTED_ELEMENT = element;
            CURRENT_SELECTED_SQL_ELEMENT = element.closest(".sqlIdentifier").data("sql-element");
        } else {
            CURRENT_SELECTED_SQL_ELEMENT = "START";
        }
        updateActiveCodeView();
        //DEBUG:
        if (CURRENT_SELECTED_ELEMENT != undefined) {
            $("#debug").html("<span style='font-weight: 700;'>currentSelectedElement:</span><br>" + CURRENT_SELECTED_ELEMENT.attr("class"));
            $("#debug").append("<br><span style='font-weight: 700;'>currentSelectedSQLElement:</span><br>" + CURRENT_SELECTED_SQL_ELEMENT);
        }
    }

    //function: get NextElementNr by data field
    function getNextElementNr() {
        if (CURRENT_SELECTED_ELEMENT != undefined) {
            if (CURRENT_SELECTED_ELEMENT.data("next-element") != undefined) {
                return CURRENT_SELECTED_ELEMENT.data("next-element");
            }
        }
    }

    //function: get Element NR from Element ID
    function getElementNr(elementClasses) {
        return elementClasses.split(" ")[0].split("_")[1];
    }

    //function: add new line <span>
    function addNewLine() {
        var tempLeerzeichen = "<span class='codeElement_" + NR + " newline'><br></span>";
        NR++;
        return tempLeerzeichen;
    }

    //function: add Leerzeichen <span>
    function addLeerzeichen() {
        var tempLeerzeichen = "<span class='codeElement_" + NR + " leerzeichen'>&nbsp;</span>";
        NR++;
        return tempLeerzeichen;
    }

    function addLeerzeichenMitKomma() {
        var tempLeerzeichen = "<span class='codeElement_" + NR + " leerzeichen'>, </span>";
        NR++;
        return tempLeerzeichen;
    }

    //function: loops through JSON Data and shows Elements based on selected SQL Element
    function updateActiveCodeView() {
        if (!isCheckboxChecked("#checkDisplayAllCodeComponents")) {
            $(".codeButton").hide();
            $(".codeSelect").hide();
            $(".codeInput").hide();


            ACTIVE_CODE_VIEW_DATA.forEach(element => {
                if (element.selectedSQLElement == CURRENT_SELECTED_SQL_ELEMENT) {
                    element.visibleCodeComponents.forEach(element => {

                        $(element.codeComponentClass).show();
                        if (element.codeComponentType == "input") {
                            $(element.codeComponentClass).focus();
                        }
                        if (CURRENT_SELECTED_ELEMENT != undefined) {
                            if (CURRENT_SELECTED_ELEMENT.hasClass("input")) {
                                if (CURRENT_SELECTED_ELEMENT.text() == "___") {
                                    $(element.codeComponentClass).val("");
                                } else {
                                    $(element.codeComponentClass).val(CURRENT_SELECTED_ELEMENT.text()).select();
                                }
                            }
                        }
                    });
                }
            });
        } else {
            $(".codeButton").show();
            $(".codeSelect").show();
            $(".codeInput").show();
        }
    }

    //function: checks all Code Elements in the CodeArea, and updates Code View
    function checkCodeAreaSQLElements() {
        if (!isSQLElementInCodeArea("SELECT")) {
            CURRENT_SELECTED_SQL_ELEMENT = "START";
            updateActiveCodeView();
        } else {
            CURRENT_SELECTED_SQL_ELEMENT = "";
            updateActiveCodeView();
        }
    }

    //function: get all SQL Elements in CodeArea
    function getCodeAreaSQLElements() {
        var codeAreaElements = [];
        $('.codeArea').children(".parent").each(function () {
            var tempSqlElement = $(this).data("sql-element");
            codeAreaElements.push(tempSqlElement);
        });
        return codeAreaElements;
    }

    //function: checks if a SQL Element is in CodeArea
    function isSQLElementInCodeArea(sqlElement) {
        if (getCodeAreaSQLElements().includes(sqlElement)) {
            return true;
        } else {
            return false;
        }
    }

    //function: Erstelle eine Tabelle mit den Resultaten der SQL Abfrage
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

    //SQLite functions:
    function getSqlTables() {
        return CURRENT_SQL_DATABASE.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")[0].values;
    }

    function getSqlTableFields(tempTableName) {
        return CURRENT_SQL_DATABASE.exec("PRAGMA table_info(" + tempTableName + ")")[0].values;
    }
    function execSqlCommand() {
        //bereitet den sql Befehl vor
        var re = new RegExp(String.fromCharCode(160), "g"); // entfernt &nbsp;
        var sqlCommand = $(".codeArea pre code").clone();
        sqlCommand.find(".codeline").prepend("<span>&nbsp;</span>");
        sqlCommand = sqlCommand.text().replaceAll(re, " ").trim();

        //versucht den sql Befehl auszuführen und gibt im Debugbereich das Ergebnis oder die Fehlermeldung aus
        try {
            var result = CURRENT_SQL_DATABASE.exec(sqlCommand);

            //erstellt eine Tabelle mit den Ergebnissen
            $("#debug").html("");
            for (var i = 0; i < result.length; i++) {
                $("#debug").append(tableCreate(result[i].columns, result[i].values));
            }
        }
        catch (err) {
            $("#debug").html(err.message);
        }
    }


    /////////
    //DEBUG//

    //display current version
    $(codeVersion).append("0.3");

    //function log
    function log(info, tempValue) {
        if (info != "") console.log(info + ":");
        console.log(tempValue);
    }
    //Debug jquery-code textarea
    $(".btnCode-parent").click(function () {
        CURRENT_SELECTED_ELEMENT.parent().addClass("debug");
    });
    $(".btnCode-closest1").click(function () {
        CURRENT_SELECTED_ELEMENT.closest(".parent").addClass("debug");
    });
    $(".btnCode-closest2").click(function () {
        CURRENT_SELECTED_ELEMENT.closest(".inputFields").addClass("debug");
    });
    $(".btnCode-find1").click(function () {
        CURRENT_SELECTED_ELEMENT.find(".parent").addClass("debug");
    });
    $(".btnCode-copycodeto").click(function () {
        var copyCode = $("#jquery-code").val();
        $(".codeArea pre code").html(copyCode);
    });
    $(".btnCode-copycodefrom").click(function () {
        var tempCode = $(".codeArea pre code").html().trim();
        $("#jquery-code").html(tempCode);
    });
    $(".btnCode-getSqlString").click(function () {
        var tempCode = $(".codeArea pre code").clone();
        tempCode.find(".codeline").prepend("<span>&nbsp;</span>");
        $("#jquery-code").html(tempCode.text().trim());
    });
    $(".btnCode-execSql").click(function () {
        execSqlCommand();
    });
    $(".btnCode-remove").click(function () {
        $("div").removeClass("debug");
        $("[class^='codeElement_']").removeClass("debug");
    });
    $("#checkDisplayAllCodeComponents").click(function () {
        updateActiveCodeView();
    });

    function isCheckboxChecked(tempCheckbox) {
        if ($(tempCheckbox).prop("checked")) return true;
        else return false;
    }





});