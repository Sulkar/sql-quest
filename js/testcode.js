$(document).ready(function () {

    //global variables
    var nr = 0;
    var currentSelectedElementID = "";
    var nextElementNr = 0;
    var currentSelectedSQLElement = "START";
    var activeCodeView; // JSON Data holder

    loadJsonData();

    // Button: SELECT * FROM *
    $('.btnSelect').click(function () {
        removeSelection();
        currentSelectedElementID = "";
        var elementSELECT_FROM = "<span id='codeElement_" + nr + "' class='codeElement parent sqlIdentifier' data-sql-element='SELECT'>SELECT"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child inputField root dbField sqlIdentifier' data-sql-element='SELECT_SELECT' data-next-element='" + (nr + 4) + "'>___</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child sqlIdentifier' data-sql-element='SELECT'>FROM</span>"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child inputField root dbTable sqlIdentifier' data-sql-element='SELECT_FROM' data-next-element='" + (nr - 4) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementSELECT_FROM += "</span>";
        elementSELECT_FROM += addLeerzeichen(); nr++;
        $('#codeArea').append(elementSELECT_FROM);
        setSelection(nextElementNr);
    });

    // Button: WHERE age > 21 -- WHERE ___ ___ ___ 
    $('.btnWhere.sqlWhere').click(function () {
        removeSelection();
        currentSelectedElementID = "";
        var elementWHERE = "<span id='codeElement_" + nr + "' class='codeElement parent sqlIdentifier sqlWhere' data-sql-element='WHERE'>WHERE"; nr++;
        elementWHERE += "<span class='inputFields'>";
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWHERE += "</span>";
        elementWHERE += "</span>";
        elementWHERE += addLeerzeichen(); nr++;
        $('#codeArea').append(elementWHERE);
        setSelection(nextElementNr);
    });

    //Button: WHERE -> AND
    $('.btnAND.sqlWhere').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        removeSelection();
        var elementWhereAND = addLeerzeichen(); nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement parent sqlIdentifier sqlWhereAND inputFields' data-sql-element='AND'>AND"; nr++;
        elementWhereAND += addLeerzeichen(); nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereAND += addLeerzeichen(); nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereAND += addLeerzeichen(); nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereAND += "</span>";
        elementWhereAND += addLeerzeichen(); nr++;
        $(elementWhereAND).insertAfter($(tempSelection).children().closest(".inputFields").first());
        setSelection(nextElementNr);
    });

    //Button: WHERE -> OR
    $('.btnOR.sqlWhere').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        removeSelection();
        var elementWhereOR = addLeerzeichen(); nr++;
        elementWhereOR += "<span id='codeElement_" + nr + "' class='codeElement parent sqlIdentifier sqlWhereOR inputFields' data-sql-element='OR'>OR"; nr++;
        elementWhereOR += addLeerzeichen(); nr++;
        elementWhereOR += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereOR += addLeerzeichen(); nr++;
        elementWhereOR += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereOR += addLeerzeichen(); nr++;
        elementWhereOR += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereOR += "</span>";
        elementWhereOR += addLeerzeichen(); nr++;
        $(elementWhereOR).insertAfter($(tempSelection).children().closest(".inputFields").first());
        setSelection(nextElementNr);
    });

    //Button: WHERE -> LeftBracket
    $('.btnLeftBracket.sqlWhere').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        if ($(tempSelection).hasClass("inputField")) {
            $("<span id='codeElement_" + nr + "' class='codeElement child inputField sqlIdentifier extended' data-sql-element='LEFTBRACKET'> ( </span>").insertBefore(tempSelection);
            nr++;
        }
    });
    //Button: WHERE -> RightBracket
    $('.btnRightBracket.sqlWhere').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        if ($(tempSelection).hasClass("inputField")) {
            $("<span id='codeElement_" + nr + "' class='codeElement child inputField sqlIdentifier extended' data-sql-element='RIGHTBRACKET'> ) </span>").insertAfter(tempSelection);
            nr++;
        }
    });

    //Button: SELECT Add Element
    $('.btnAdd.sqlSelect').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        if ($(tempSelection).hasClass("inputField")) {
            var tempSqlElement = $(tempSelection).data("sql-element");
            $("<span id='codeElement_" + nr + "' class='codeElement child inputField sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>,___</span>").insertAfter(tempSelection);
            removeSelection();
            setSelection(nr);
            nr++;
        }
    });

    // Button: Delete Element
    $('.btnDelete').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
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
            var elementNr = getElementNr($(tempSelection).parent().attr('id'));
            setSelection(elementNr);
        }
    });

    // on Click Element
    $('body').on('click', 'span', function (event) {
        event.stopPropagation();
        removeSelection();
        var elementNr = getElementNr($(this).attr("id"));
        setSelection(elementNr);
    });

    // on Click CodeArea - deselct
    $('body').on('click', '#codeArea', function (event) {
        event.stopPropagation();
        removeSelection();
        checkCodeAreaSQLElements();
    });

    // Select: add dbField, dbTable
    $('.codeSelect').on('change', function () {
        if (currentSelectedElementID != "") {
            var tempSelection = "#" + currentSelectedElementID;
            if ($(tempSelection).hasClass("inputField") && $(tempSelection).hasClass("extended")) {
                $(tempSelection).html("," + this.value);
            } else if ($(tempSelection).hasClass("inputField") && $(tempSelection).hasClass("root")) {
                $(tempSelection).html(this.value);
                nextElementNr = getNextElementNr();
                removeSelection();
                setSelection(nextElementNr);
            }

        }
        //reset select option
        $(this)[0].selectedIndex = 0;
    });

    // Input: add text to Selected Element span
    $(".codeInput").on('input', function () {
        if (currentSelectedElementID != "") {
            var tempSelection = "#" + currentSelectedElementID;
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
        $(".codeElement").removeClass("active");
        $(".codeInput").val("");
        currentSelectedElementID = "";
    }

    //function: set Selection to an Element
    function setSelection(elementNr) {
        $("#codeElement_" + elementNr).addClass("active");
        currentSelectedElementID = "codeElement_" + elementNr;

        $("#debug").html("currentSelectedElementID: " + currentSelectedElementID + "<br>");
        setSelectedSQLElement(elementNr);
        updateActiveCodeView();
    }

    //function: set Selected SQL Element based on selected Element
    function setSelectedSQLElement(elementNr) {
        currentSelectedSQLElement = $("#codeElement_" + elementNr).closest(".sqlIdentifier").data("sql-element");

        $("#debug").append("currentSelectedSQLElement: " + currentSelectedSQLElement + "<br>");
    }

    //function: get NextElementNr by data field
    function getNextElementNr() {
        if (currentSelectedElementID != "") {
            var tempSelection = "#" + currentSelectedElementID;
            if ($(tempSelection).data("next-element") != undefined) {
                return $(tempSelection).data("next-element");
            }
        }
    }

    //function: get Element Nr from Element ID
    function getElementNr(elementID) {
        return elementID.split("_")[1];
    }

    //function: add Leerzeichen <span>
    function addLeerzeichen() {
        return "<span id='codeElement_" + nr + "' class='codeElement leerzeichen'> </span>";
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

                    if (currentSelectedElementID != "") {
                        var tempSelection = "#" + currentSelectedElementID;
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
