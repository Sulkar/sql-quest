$(document).ready(function () {

    $(codeVersion).append("0.21");

    //global variables
    var nr = 0;
    var lastSelectedElement = undefined;
    var currentSelectedElement = undefined;
    var nextElementNr = 0;
    var currentSelectedSQLElement = "START";
    var activeCodeView; // JSON Data holder

    loadJsonData();

    // Button: SELECT * FROM *
    $('.btnSelect').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        currentSelectedElement = undefined;
        var elementSELECT_FROM = "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " start parent sqlIdentifier inputFields' data-sql-element='SELECT'>SELECT"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='SELECT_SELECT' data-next-element='" + (nr + 4) + "'>___</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + "' data-goto-element='" + (nr - 4) + "'>FROM</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier active' data-sql-element='SELECT_FROM' data-next-element='" + (nr - 4) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementSELECT_FROM += "</span>";
        $('.codeArea').append(elementSELECT_FROM);
        setSelection(nextElementNr, false);
    });

    // Button: WHERE age > 21 -- WHERE ___ ___ ___ 
    $('.btnWhere.sqlWhere').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementWHERE = addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='WHERE'>WHERE"; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWHERE += "</span>";
        currentSelectedElement.closest(".inputFields").first().append(elementWHERE);
        setSelection(nextElementNr, false);
    });

    //Button: WHERE -> AND
    $('.btnAND.sqlWhere').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementWhereAND = addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='AND'>AND"; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereAND += "</span>";
        //check selected element is AND or OR -> if yes then replace if not create new one         
        if (currentSelectedElement.data("sql-element") == "AND" || currentSelectedElement.data("sql-element") == "OR") {
            currentSelectedElement.replaceWith(elementWhereAND);
        } else {
            currentSelectedElement.closest(".inputFields").first().append(elementWhereAND);
        }
        setSelection(nextElementNr, false);
    });

    //Button: WHERE -> OR
    $('.btnOR.sqlWhere').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        var elementWhereOR = addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " " + classesFromCodeComponent + " parent sqlIdentifier inputFields' data-sql-element='OR'>OR"; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " inputField unfilled root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereOR += "</span>";
        //check selected element is AND or OR -> if yes then replace if not create new one
        if (currentSelectedElement.data("sql-element") == "AND" || currentSelectedElement.data("sql-element") == "OR") {
            currentSelectedElement.replaceWith(elementWhereOR);
        } else {
            currentSelectedElement.closest(".inputFields").first().append(elementWhereOR);
        }
        setSelection(nextElementNr, false);
    });

    //Button: WHERE -> LeftBracket
    $('.btnLeftBracket.sqlWhere').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        if (currentSelectedElement.hasClass("inputField")) {
            $("<span class='codeElement_" + nr + "  " + classesFromCodeComponent + " sqlIdentifier extended' data-sql-element='LEFTBRACKET'> ( </span>").insertBefore(currentSelectedElement);
            nr++;
        }
    });
    //Button: WHERE -> RightBracket
    $('.btnRightBracket.sqlWhere').click(function () {
        var classesFromCodeComponent = getClassesFromElementAsString(this);
        if (currentSelectedElement.hasClass("inputField")) {
            $("<span class='codeElement_" + nr + "  " + classesFromCodeComponent + " sqlIdentifier extended' data-sql-element='RIGHTBRACKET'> ) </span>").insertAfter(currentSelectedElement);
            nr++;
        }
    });

    //Button: SELECT Add Element
    $('.btnAdd.sqlSelect').click(function () {
        var dataSqlElement = currentSelectedElement.data("sql-element");

        if (currentSelectedElement.hasClass("inputField")) {
            if (dataSqlElement == "SELECT_SELECT_AGGREGAT") { //...
                $(addInputField(dataSqlElement, "extendedSpace")).insertAfter(currentSelectedElement);
            } else {
                $(addInputField(dataSqlElement, "extendedComma")).insertAfter(currentSelectedElement);
            }
            setSelection(nextElementNr, false);
        }
    });

    // Select: SELECT add dbField, dbTable, Aggregatsfunktion
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
        $("#debug").html("<span style='font-weight: 700;'>currentSelectedElement:</span><br>" + currentSelectedElement.attr("class"));
        $("#debug").append("<br><span style='font-weight: 700;'>currentSelectedSQLElement:</span><br>" + currentSelectedSQLElement);
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

    //function: add Leerzeichen <span>
    function addLeerzeichen() {
        var tempLeerzeichen = "<span class='codeElement_" + nr + " leerzeichen'> </span>";
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

});
