$(document).ready(function () {

    //global variables
    var nr = 0;
    var currentSelectedElement = "";
    var nextElementNr = 0;
    var currentSelectedSQLElement = "START";
    var activeCodeView; // JSON Data holder

    loadJsonData();

    // Button: SELECT * FROM *
    $('.btnSelect').click(function () {
        removeSelection();
        currentSelectedElement = "";
        var elementSELECT_FROM = "<span class='codeElement_" + nr + " btnSelect sqlSelect parent sqlIdentifier' data-sql-element='SELECT'>SELECT"; nr++;
        elementSELECT_FROM += "<span class='inputFields'>";
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + " selField sqlSelect child inputField root dbField sqlIdentifier' data-sql-element='SELECT_SELECT' data-next-element='" + (nr + 4) + "'>___</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + " child' data-goto-element='" + (nr - 4) + "'>FROM</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen();
        elementSELECT_FROM += "<span class='codeElement_" + nr + " selTable sqlSelect child inputField root dbTable sqlIdentifier' data-sql-element='SELECT_FROM' data-next-element='" + (nr - 4) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementSELECT_FROM += "</span>";
        elementSELECT_FROM += "</span>";
        $('#codeArea').append(elementSELECT_FROM);
        setSelection(nextElementNr);
    });

    // Button: WHERE age > 21 -- WHERE ___ ___ ___ 
    $('.btnWhere.sqlWhere').click(function () {
        var tempSelection = "." + currentSelectedElement;
        removeSelection();
        var elementWHERE = addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " btnWhere sqlWhere  parent sqlIdentifier' data-sql-element='WHERE'>WHERE"; nr++;
        elementWHERE += "<span class='inputFields'>";
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " selField sqlWhere child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " selOperators sqlWhere child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWHERE += addLeerzeichen();
        elementWHERE += "<span class='codeElement_" + nr + " inputValue sqlWhere child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWHERE += "</span>";
        elementWHERE += "</span>";
        $(elementWHERE).insertAfter($(tempSelection).children().closest(".inputFields").first());
        setSelection(nextElementNr);
    });

    //Button: WHERE -> AND
    $('.btnAND.sqlWhere').click(function () {
        var tempSelection = "." + currentSelectedElement;
        removeSelection();
        var elementWhereAND = addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " btnAND sqlWhere parent sqlIdentifier sqlWhereAND inputFields' data-sql-element='AND'>AND"; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " selOperators sqlWhere child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereAND += addLeerzeichen();
        elementWhereAND += "<span class='codeElement_" + nr + " inputValue sqlWhere child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereAND += "</span>";
        $(elementWhereAND).insertAfter($(tempSelection).children().closest(".inputFields").first());
        setSelection(nextElementNr);
    });

    //Button: WHERE -> OR
    $('.btnOR.sqlWhere').click(function () {
        var tempSelection = "." + currentSelectedElement;
        removeSelection();
        var elementWhereOR = addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " btnOR sqlWhere parent sqlIdentifier sqlWhereOR inputFields' data-sql-element='OR'>OR"; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " selOperators sqlWhere child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereOR += addLeerzeichen();
        elementWhereOR += "<span class='codeElement_" + nr + " inputValue sqlWhere child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereOR += "</span>";
        $(elementWhereOR).insertAfter($(tempSelection).children().closest(".inputFields").first());
        setSelection(nextElementNr);
    });

    //Button: WHERE -> LeftBracket
    $('.btnLeftBracket.sqlWhere').click(function () {
        var tempSelection = "." + currentSelectedElement;
        if ($(tempSelection).hasClass("inputField")) {
            $("<span class='codeElement_" + nr + " btnLeftBracket sqlWhere child sqlIdentifier extended' data-sql-element='LEFTBRACKET'> ( </span>").insertBefore(tempSelection);
            nr++;
        }
    });
    //Button: WHERE -> RightBracket
    $('.btnRightBracket.sqlWhere').click(function () {
        var tempSelection = "." + currentSelectedElement;
        if ($(tempSelection).hasClass("inputField")) {
            $("<span class='codeElement_" + nr + " btnRightBracket sqlWhere child sqlIdentifier extended' data-sql-element='RIGHTBRACKET'> ) </span>").insertAfter(tempSelection);
            nr++;
        }
    });

    //Button: SELECT Add Element
    $('.btnAdd.sqlSelect').click(function () {
        var tempSelection = "." + currentSelectedElement;
        if ($(tempSelection).hasClass("inputField")) {
            $(getInputField(tempSelection, "extended")).insertAfter(tempSelection);
            removeSelection();
            setSelection(nextElementNr);
        }
    });

    //function: returns a normal or extended inputField ( ___ or ,___ )
    function getInputField(tempSelection, type) {
        var tempSqlElement = $(tempSelection).data("sql-element");
        if (type == "root") {
            var tempInputField = "<span class='codeElement_" + nr + " inputField sqlIdentifier child root' data-sql-element='" + tempSqlElement + "'>___</span>";
        } else if (type == "extended") {
            var tempInputField = "<span class='codeElement_" + nr + " inputField sqlIdentifier child extended' data-sql-element='" + tempSqlElement + "'>,___</span>";
        }
        nextElementNr = nr;
        nr++;
        return tempInputField;

    }
    //function: returns an Aggregat <span> with inputField
    function getAggregat(tempSelection, aggregat) {
        var tempSqlElement = $(tempSelection).data("sql-element");
        var tempAggregat = "";
        if($(tempSelection).hasClass("extended")){
            tempAggregat += addLeerzeichen();
        }
        tempAggregat += "<span class='codeElement_" + nr + " selAggregate sqlSelect child inputField sqlIdentifier root' data-sql-element='" + tempSqlElement + "'>" + aggregat + "(";
        nr++;
        tempAggregat += getInputField(tempSelection, "root");
        tempAggregat += ")</span>";
        return tempAggregat;
    }

    // Select: SELECT add dbField, dbTable, Aggregatsfunktion
    $('.codeSelect').on('change', function () {
        if (currentSelectedElement != "") {
            var tempSelection = "." + currentSelectedElement;
            // wich select is triggering?
            // -> selField, selTable
            if ($(this).hasClass("selField") || $(this).hasClass("selTable")) {
                if ($(tempSelection).hasClass("extended")) { //Feld erweitert ,___
                    $(tempSelection).html("," + this.value);

                } else if ($(tempSelection).hasClass("root")) { //Feld normal ___
                    $(tempSelection).html(this.value);
                    nextElementNr = getNextElementNr();
                    removeSelection();
                    setSelection(nextElementNr);
                }
            }
            // -> selAggregate
            else if ($(this).hasClass("selAggregate")) {
                $(tempSelection).replaceWith(getAggregat(tempSelection, this.value));
                removeSelection();
                setSelection(nextElementNr);
            }
        }
        //reset select option
        $(this)[0].selectedIndex = 0;
    });

    // Button: Delete Element
    $('.btnDelete').click(function () {
        var tempSelection = "." + currentSelectedElement;
        // Element parent? oder inputField + extended?
        if ($(tempSelection).hasClass("parent") || ($(tempSelection).hasClass("inputField") && $(tempSelection).hasClass("extended"))) {
            $(tempSelection).remove();
            removeSelection();
            checkCodeAreaSQLElements();
        }
        // Element ist das root inputField? don´t remove Element only change html
        else if ($(tempSelection).hasClass("inputField") && $(tempSelection).hasClass("root")) {
            $(tempSelection).html("___");
            nextElementNr = getNextElementNr();
            removeSelection();
            setSelection(nextElementNr);
        }
        // don´t delete, select parent Element
        else {
            var elementNr = getElementNr($(tempSelection).parent().attr('class'));
            setSelection(elementNr);
        }
    });

    // on Click Element
    $('body').on('click', 'span', function (event) {
        event.stopPropagation();
        removeSelection();


        if ($(this).data("goto-element") != undefined) {
            var elementNr = $(this).data("goto-element");
        } else {
            var elementNr = getElementNr($(this).attr("class"));
        }
        setSelection(elementNr);
    });

    // on Click CodeArea - deselct
    $('body').on('click', '#codeArea', function (event) {
        event.stopPropagation();
        removeSelection();
        checkCodeAreaSQLElements();
    });



    // Input: add text to Selected Element span
    $(".codeInput").on('input', function () {
        if (currentSelectedElement != "") {
            var tempSelection = "." + currentSelectedElement;
            var tempValue = $(this).val();
            if (tempValue != "") {
                $(tempSelection).html(tempValue);
            } else {
                $(tempSelection).html("___");
            }
            $(tempSelection).addClass("input");
        }
    });

    //function: remove Selection from all Elements
    function removeSelection() {
        $("[class^='codeElement_']").removeClass("active");
        $(".codeInput").val("");
        currentSelectedElement = "";
    }

    //function: set Selection to an Element
    function setSelection(elementNr) {
        $(".codeElement_" + elementNr).addClass("active");
        currentSelectedElement = "codeElement_" + elementNr;

        $("#debug").html("currentSelectedElement: " + currentSelectedElement + "<br>");
        setSelectedSQLElement(elementNr);
        updateActiveCodeView();
    }

    //function: set Selected SQL Element based on selected Element
    function setSelectedSQLElement(elementNr) {
        currentSelectedSQLElement = $(".codeElement_" + elementNr).closest(".sqlIdentifier").data("sql-element");

        $("#debug").append("currentSelectedSQLElement: " + currentSelectedSQLElement + "<br>");
    }

    //function: get NextElementNr by data field
    function getNextElementNr() {
        if (currentSelectedElement != "") {
            var tempSelection = "." + currentSelectedElement;
            if ($(tempSelection).data("next-element") != undefined) {
                return $(tempSelection).data("next-element");
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

    //load JSON data: activeCodeView    
    function loadJsonData() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                activeCodeView = JSON.parse(this.responseText);
                console.log(activeCodeView[0]);
                console.log(activeCodeView[1]);
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

                    if (currentSelectedElement != "") {
                        var tempSelection = "." + currentSelectedElement;
                        if ($(tempSelection).hasClass("input")) {
                            if ($(tempSelection).text() == "___") {
                                $(element.codeComponentClass).val("");
                            } else {
                                $(element.codeComponentClass).val($(tempSelection).text());
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
        $('#codeArea').children(".parent").each(function () {
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
