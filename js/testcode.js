$(document).ready(function () {

    //global variables
    var nr = 0;
    var lastSelectedElement = undefined;
    var currentSelectedElement = undefined;
    var nextElementNr = 0;
    var currentSelectedSQLElement = "START";
    var activeCodeView; // JSON Data holder

    loadJsonData();

    // Button: SELECT ___ FROM ___
    $('.btnSelect').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        currentSelectedElement = undefined;
        var elementSELECT_FROM = "<span class='codeline'>";
        elementSELECT_FROM += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " start parent sqlIdentifier inputFields' data-sql-element='SELECT'>SELECT"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='SELECT_SELECT' data-next-element='" + (nr + 4) + "'>___</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + "' data-goto-element='" + (nr - 4) + "'>FROM</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier active' data-sql-element='SELECT_FROM' data-next-element='" + (nr - 4) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementSELECT_FROM += "</span></span>";
        $('.codeArea pre code').append(elementSELECT_FROM);
        setSelection(nextElementNr, false);
    });

    // Button: WHERE ___ ___ ___ 
    $('.btnWhere').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementWHERE = "<span class='codeline'>";
        elementWHERE += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='WHERE'>WHERE"; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWHERE += "</span></span>";
        currentSelectedElement.closest(".inputFields").first().append(elementWHERE);
        setSelection(nextElementNr, false);
    });

    //Button: AND
    $('.btnAND').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var parentSqlIdentifier = currentSelectedElement.data("sql-element");
        var elementWhereAND = addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='AND'>AND"; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_AND_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_AND_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_AND_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereAND += "</span>";
        //check selected element is AND or OR -> if yes then replace if not create new one         
        if (currentSelectedElement.data("sql-element") == "AND" || currentSelectedElement.data("sql-element") == "OR") {
            currentSelectedElement.replaceWith(elementWhereAND);
        } else {
            currentSelectedElement.closest(".inputFields").first().append(elementWhereAND);
        }
        setSelection(nextElementNr, false);
    });

    //Button: OR
    $('.btnOR').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var parentSqlIdentifier = currentSelectedElement.data("sql-element");
        var elementWhereOR = addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='OR'>OR"; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_OR_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_OR_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='" + parentSqlIdentifier + "_OR_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereOR += "</span>";
        //check selected element is AND or OR -> if yes then replace if not create new one
        if (currentSelectedElement.data("sql-element") == "AND" || currentSelectedElement.data("sql-element") == "OR") {
            currentSelectedElement.replaceWith(elementWhereOR);
        } else {
            currentSelectedElement.closest(".inputFields").first().append(elementWhereOR);
        }
        setSelection(nextElementNr, false);
    });

    //Button: LeftBracket
    $('.btnLeftBracket').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        if (currentSelectedElement.hasClass("inputField")) {
            currentSelectedElement.before("<span class='codeElement_" + nr + "  " + classesFromCodeComponent + " sqlIdentifier extended' data-sql-element='LEFTBRACKET'> ( </span>");
            nr++;
        }
    });
    //Button: RightBracket
    $('.btnRightBracket').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        if (currentSelectedElement.hasClass("inputField")) {
            currentSelectedElement.after("<span class='codeElement_" + nr + "  " + classesFromCodeComponent + " sqlIdentifier extended' data-sql-element='RIGHTBRACKET'> ) </span>");
            nr++;
        }
    });

    //Button: Add Element "inputField"
    $('.btnAdd').click(function () {
        var dataSqlElement = currentSelectedElement.data("sql-element");
        if (currentSelectedElement.hasClass("inputField")) {
            if (hasCurrentSelectedElementSqlDataString(currentSelectedElement, "_AGGREGAT")) { //...
                currentSelectedElement.after(addInputField(dataSqlElement, "extendedSpace"));
            }
            else if (hasCurrentSelectedElementSqlDataString(currentSelectedElement, "WHERE_3, OR_3, AND_3")) { //...
                currentSelectedElement.after(addInputField(dataSqlElement, "extendedSpace"));
            }
            else {
                currentSelectedElement.after(addInputField(dataSqlElement, "extendedComma"));
            }
            setSelection(nextElementNr, false);
        }
    });

    // Button: ORDER BY ___ 
    $('.btnOrder').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementORDER = addLeerzeichen();
        elementORDER += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='ORDER'>ORDER BY"; nr++;
        elementORDER += addLeerzeichen();
        elementORDER += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='ORDER_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementORDER += "</span>";
        currentSelectedElement.closest(".inputFields").first().append(elementORDER);
        setSelection(nextElementNr, false);
    });

    //Button: ASC
    $('.btnAsc').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementOrderAsc = addLeerzeichen();
        elementOrderAsc += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='ASC'>ASC";
        nextElementNr = nr; nr++;
        elementOrderAsc += "</span>";
        //check selected element is AND or OR -> if yes then replace if not create new one
        if (currentSelectedElement.data("sql-element") == "ASC" || currentSelectedElement.data("sql-element") == "DESC") {
            currentSelectedElement.replaceWith(elementOrderAsc);
            setSelection(nextElementNr, false);
        } else {
            currentSelectedElement.closest(".inputFields").first().append(elementOrderAsc);
            setSelection("next", false);
        }
    });

    //Button: DESC
    $('.btnDesc').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementOrderDesc = addLeerzeichen();
        elementOrderDesc += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='DESC'>DESC";
        nextElementNr = nr; nr++;
        elementOrderDesc += "</span>";
        //check selected element is AND or OR -> if yes then replace if not create new one
        if (currentSelectedElement.data("sql-element") == "ASC" || currentSelectedElement.data("sql-element") == "DESC") {
            currentSelectedElement.replaceWith(elementOrderDesc);
            setSelection(nextElementNr, false);
        } else {
            currentSelectedElement.closest(".inputFields").first().append(elementOrderDesc);
            setSelection("next", false);
        }
    });

    // Button: LIMIT ___ = [offset,] row_count
    $('.btnLimit').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementLIMIT = addLeerzeichen();
        elementLIMIT += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='LIMIT'>LIMIT"; nr++;
        elementLIMIT += addLeerzeichen();
        elementLIMIT += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='LIMIT_1' >___</span>";
        nextElementNr = nr; nr++;
        elementLIMIT += "</span>";
        currentSelectedElement.closest(".inputFields").first().append(elementLIMIT);
        setSelection(nextElementNr, false);
    });

    // Button: GROUP BY ___ 
    $('.btnGroup').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementGROUP = addLeerzeichen();
        elementGROUP += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='GROUP'>GROUP BY"; nr++;
        elementGROUP += addLeerzeichen();
        elementGROUP += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='GROUP_1'>___</span>";
        nextElementNr = nr; nr++;
        elementGROUP += "</span>";
        currentSelectedElement.closest(".inputFields").first().append(elementGROUP);
        setSelection(nextElementNr, false);
    });

    // Button: HAVING ___ ___ ___ = like WHERE but can handle Aggregate functions
    $('.btnHaving').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementHAVING = addLeerzeichen();
        elementHAVING += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='HAVING'>HAVING"; nr++;
        elementHAVING += addLeerzeichen();
        elementHAVING += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='HAVING_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementHAVING += addLeerzeichen();
        elementHAVING += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='HAVING_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementHAVING += addLeerzeichen();
        elementHAVING += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='HAVING_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementHAVING += "</span>";
        currentSelectedElement.closest(".inputFields").first().append(elementHAVING);
        setSelection(nextElementNr, false);
    });

    // Button: JOIN ___ ON ___ ___ ___ 
    $('.btnJoin').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementJOIN = "<span class='codeline'>";
        elementJOIN += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='JOIN'>JOIN"; nr++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + nr + "' data-goto-element='" + (nr - 4) + "'>ON</span>"; nr++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementJOIN += addLeerzeichen();
        elementJOIN += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='JOIN_4' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementJOIN += "</span></span>";
        currentSelectedElement.closest(".inputFields").first().append(elementJOIN);
        setSelection(nextElementNr, false);
    });

    // Select: add dbField, dbTable, Aggregatsfunktion
    $('.codeSelect').on('change', function () {
        if (currentSelectedElement != undefined) {
            var tempSelectField = this;
            var returnObject = {};
            // wich select is triggering?
            // -> selField, selTable
            if ($(tempSelectField).hasClass("selField") || $(tempSelectField).hasClass("selTable") || $(tempSelectField).hasClass("selOperators")) {

                if (currentSelectedElement.hasClass("extended") && currentSelectedElement.hasClass("comma")) { //Feld erweitert ,___
                    returnObject = addSelectValue(tempSelectField);
                    currentSelectedElement.replaceWith(returnObject.tempSelectValue);
                    currentSelectedElement = $(returnObject.thisCodeElement);

                    setSelection("next", false);
                }
                else if (currentSelectedElement.hasClass("extended")) { //Feld erweitert ___
                    returnObject = addSelectValue(tempSelectField);
                    currentSelectedElement.replaceWith(returnObject.tempSelectValue);
                    currentSelectedElement = $(returnObject.thisCodeElement);

                    setSelection("next", false);

                }
                else if (currentSelectedElement.hasClass("root")) { //Feld normal ___
                    returnObject = addSelectValue(tempSelectField);
                    currentSelectedElement.replaceWith(returnObject.tempSelectValue);
                    currentSelectedElement = $(returnObject.thisCodeElement);

                    setSelection("next", false);
                }
            }
            // -> selAggregate
            else if ($(tempSelectField).hasClass("selAggregate")) {
                currentSelectedElement.replaceWith(addAggregat(tempSelectField));
                setSelection(nextElementNr, false);
            }
        }
        //reset select option
        $(this)[0].selectedIndex = 0;
    });



    // Button: Delete Element
    $('.btnDelete').click(function () {
        // Element parent? oder inputField + extended?
        if (currentSelectedElement.hasClass("parent")) {
            setSelection("parent", true);
        }
        else if (currentSelectedElement.hasClass("synBrackets") && currentSelectedElement.hasClass("extended")) {
            setSelection("next", true);
        }
        else if (currentSelectedElement.hasClass("inputField") && currentSelectedElement.hasClass("extended")) {
            currentSelectedElement.prev().remove();
            setSelection("next", true);
        }
        // Element ist das root inputField? remove old Element and create new one
        else if (currentSelectedElement.hasClass("inputField") && currentSelectedElement.hasClass("root")) {
            var dataSqlElement = currentSelectedElement.data("sql-element");
            currentSelectedElement.replaceWith(addInputField(dataSqlElement, "root"));
            setSelection(nextElementNr, false);
        }
        // don´t delete, select parent Element
        else {
            var elementNr = getElementNr(currentSelectedElement.parent().attr('class'));
            setSelection(elementNr, false);
        }

        // deletes all empty <span class="codeline">
        $(".codeline").each(function () {
            if ($(this).children().length == 0) $(this).remove();
        });
    });

    // on Click Element
    $('body').on('click', 'span', function (event) {
        event.stopPropagation();
        //
        if ($(this).data("goto-element") == "next") {
            var elementNr = "0";
        }
        else if ($(this).data("goto-element") != undefined) {
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
        if (currentSelectedElement != undefined) {
            var tempValue = $(this).val();
            if (tempValue != "") {
                currentSelectedElement.html(tempValue);
            } else {
                currentSelectedElement.html("___");
            }
            currentSelectedElement.addClass("input");
            if (e.key === 'Enter' || e.keyCode === 13) {
                var classesFromCodeComponent = getClassesFromElementAsString(this);
                if (tempValue != "") {
                    currentSelectedElement.removeClass("unfilled");
                    currentSelectedElement.addClass(classesFromCodeComponent);
                } else {
                    currentSelectedElement.addClass("unfilled");
                    currentSelectedElement.removeClass(classesFromCodeComponent);
                }
                setSelection("next", false);
            }
        }
    });

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
            var tempInputField = "<span class='codeElement_" + nr + " inputField unfilled sqlIdentifier root' data-sql-element='" + tempSqlElement + "'>___</span>";
        } else if (type == "extendedComma") {
            var tempInputField = addLeerzeichenMitKomma();
            tempInputField += "<span class='codeElement_" + nr + " inputField unfilled sqlIdentifier extended comma' data-sql-element='" + tempSqlElement + "'>___</span>";
        } else if (type == "extendedSpace") {
            var tempInputField = addLeerzeichen();
            tempInputField += "<span class='codeElement_" + nr + " inputField unfilled sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>___</span>";
        }
        nextElementNr = nr;
        nr++;
        return tempInputField;

    }
    //function: adds an Aggregat <span> with inputField
    function addAggregat(tempSelectField) {
        var classesFromCodeComponent = getClassesFromElementAsString(tempSelectField);
        var tempSqlElement = currentSelectedElement.data("sql-element");
        var tempAggregat = "";
        if (currentSelectedElement.hasClass("extended")) {
            tempAggregat += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " inputField sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "(";
        } else {
            tempAggregat += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " inputField sqlIdentifier root' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "(";
        }
        nr++;
        tempAggregat += addInputField(tempSqlElement + "_AGGREGAT", "root");
        tempAggregat += ")</span>";
        return tempAggregat;
    }

    //function: adds a selected Value from and <select> Component
    function addSelectValue(tempSelectField) {
        var classesFromCodeComponent = getClassesFromElementAsString(tempSelectField);
        var tempSqlElement = currentSelectedElement.data("sql-element");
        var tempSelectValue = "";
        if (currentSelectedElement.hasClass("extended")) {
            tempSelectValue += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " inputField sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "</span>";
        } else {
            tempSelectValue += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " inputField sqlIdentifier root' data-sql-element='" + tempSqlElement + "'>" + tempSelectField.value + "</span>";
        }
        var returnObject = {};
        returnObject.tempSelectValue = tempSelectValue;
        returnObject.thisCodeElement = ".codeElement_" + nr;

        nr++;
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
        if (removeLastSelectedElement) currentSelectedElement.remove();
        currentSelectedElement = undefined;
    }

    //function: set Selection to an Element
    function setSelection(elementNr, removeLastSelectedElement) {
        var element;
        //no number is given -> get next unfilled inputField
        if (elementNr == "next") {
            console.log("setSelection next");
            currentSelectedElement.removeClass("unfilled");
            element = currentSelectedElement.closest(".parent").find(".unfilled").first();
            if (element.length == 0) {
                element = currentSelectedElement.closest(".parent").first();
            }
        }
        //
        else if (elementNr == "parent") {
            console.log("setSelection parent");
            element = currentSelectedElement.parents().closest(".parent").last();
        }
        //next element is chosen by number
        else {
            console.log("setSelection NOT next");
            element = $(".codeElement_" + elementNr);
        }

        removeSelection(removeLastSelectedElement);

        if (element.length != 0) {
            element.addClass("active");
            currentSelectedElement = element;
            currentSelectedSQLElement = element.closest(".sqlIdentifier").data("sql-element");
        } else {
            currentSelectedSQLElement = "START";
        }
        updateActiveCodeView();
        //DEBUG:
        if (currentSelectedElement != undefined) {
            $("#debug").html("<span style='font-weight: 700;'>currentSelectedElement:</span><br>" + currentSelectedElement.attr("class"));
            $("#debug").append("<br><span style='font-weight: 700;'>currentSelectedSQLElement:</span><br>" + currentSelectedSQLElement);
        }
    }

    //function: get NextElementNr by data field
    function getNextElementNr() {
        if (currentSelectedElement != undefined) {
            if (currentSelectedElement.data("next-element") != undefined) {
                return currentSelectedElement.data("next-element");
            }
        }
    }

    //function: get Element Nr from Element ID
    function getElementNr(elementClasses) {
        return elementClasses.split(" ")[0].split("_")[1];
    }

    //function: add new line <span>
    function addNewLine() {
        var tempLeerzeichen = "<span class='codeElement_" + nr + " newline'><br></span>";
        nr++;
        return tempLeerzeichen;
    }

    //function: add Leerzeichen <span>
    function addLeerzeichen() {
        var tempLeerzeichen = "<span class='codeElement_" + nr + " leerzeichen'>&nbsp;</span>";
        nr++;
        return tempLeerzeichen;
    }
    function addLeerzeichenMitKomma() {
        var tempLeerzeichen = "<span class='codeElement_" + nr + " leerzeichen'>, </span>";
        nr++;
        return tempLeerzeichen;
    }

    //load JSON data: activeCodeView    
    function loadJsonData() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                activeCodeView = JSON.parse(this.responseText);
                updateActiveCodeView();
            }
        };
        xmlhttp.open("GET", "./data/activeCodeViewData.json", true);
        xmlhttp.send();
    }

    //function: loops through JSON Data and shows Elements based on selected SQL Element
    function updateActiveCodeView() {
        if (!isCheckboxChecked("#checkDisplayAllCodeComponents")) {
            $(".codeButton").hide();
            $(".codeSelect").hide();
            $(".codeInput").hide();


            activeCodeView.forEach(element => {
                if (element.selectedSQLElement == currentSelectedSQLElement) {
                    element.visibleCodeComponents.forEach(element => {

                        $(element.codeComponentClass).show();
                        if (element.codeComponentType == "input") {
                            $(element.codeComponentClass).focus();
                        }
                        if (currentSelectedElement != undefined) {
                            if (currentSelectedElement.hasClass("input")) {
                                if (currentSelectedElement.text() == "___") {
                                    $(element.codeComponentClass).val("");
                                } else {
                                    $(element.codeComponentClass).val(currentSelectedElement.text()).select();
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
            currentSelectedSQLElement = "START";
            updateActiveCodeView();
        } else {
            currentSelectedSQLElement = "";
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
    /////////
    //DEBUG//
    //display current version
    $(codeVersion).append("0.3");

    //function log
    function log(tempValue) {
        console.log(tempValue);
    }
    //Debug jquery-code textarea
    $(".btnCode-parent").click(function () {
        currentSelectedElement.parent().addClass("debug");
    });
    $(".btnCode-closest1").click(function () {
        currentSelectedElement.closest(".parent").addClass("debug");
    });
    $(".btnCode-closest2").click(function () {
        currentSelectedElement.closest(".inputFields").addClass("debug");
    });
    $(".btnCode-find1").click(function () {
        currentSelectedElement.find(".parent").addClass("debug");
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
