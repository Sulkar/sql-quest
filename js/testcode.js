$(document).ready(function () {

    //global variables
    var nr = 0;
    var currentSelectedElementID = "";
    var nextElementNr = 0;
    var currentSelectedSQLElement = "START";
    var activeCodeView; // JSON Data holder

    loadJsonData("level1");

    // Button: SELECT * FROM *
    $('.btnSelect').click(function () {
        removeSelection();
        currentSelectedElementID = "";
        var elementSELECT_FROM = "<span id='codeElement_" + nr + "' class='codeElement codeWrapper parent sqlIdentifier' data-sql-element='SELECT'>"; nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child sqlIdentifier' data-sql-element='SELECT'>SELECT"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child inputField root dbField sqlIdentifier' data-sql-element='SELECT_SELECT' data-next-element='" + (nr + 4) + "'>___</span></span>"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child sqlIdentifier' data-sql-element='SELECT'>FROM"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child inputField root dbTable sqlIdentifier' data-sql-element='SELECT_FROM' data-next-element='" + (nr - 4) + "'>___</span></span>";
        nextElementNr = nr; nr++;
        elementSELECT_FROM += "</span></span>";
        elementSELECT_FROM += addLeerzeichen(); nr++;
        $('#targetArea').append(elementSELECT_FROM);
        setSelection(nextElementNr);
    });

    // Button: WHERE age > 21 -- WHERE ___ ___ ___ 
    $('.btnWhere').click(function () {
        removeSelection();
        currentSelectedElementID = "";
        var elementWHERE = "<span id='codeElement_" + nr + "' class='codeElement codeWrapper parent sqlIdentifier' data-sql-element='WHERE''>"; nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child sqlIdentifier' data-sql-element='WHERE'>WHERE"; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWHERE += "</span></span>";
        elementWHERE += addLeerzeichen(); nr++;
        $('#targetArea').append(elementWHERE);
        setSelection(nextElementNr);
    });

    //Button: WHERE -> AND
    $('.btnAND.sqlWhere').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        removeSelection();
        var elementWhereAND = addLeerzeichen(); nr++;
        //elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement codeWrapper parent sqlIdentifier' data-sql-element='WHERE_AND''>"; nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement parent sqlIdentifier' data-sql-element='WHERE'>AND"; nr++;
        elementWhereAND += addLeerzeichen(); nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_1' data-next-element='" + (nr + 2) + "'>___</span>";
        nextElementNr = nr; nr++;
        elementWhereAND += addLeerzeichen(); nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_2' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWhereAND += addLeerzeichen(); nr++;
        elementWhereAND += "<span id='codeElement_" + nr + "' class='codeElement child inputField root sqlIdentifier' data-sql-element='WHERE_3' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWhereAND += "</span>";
        elementWhereAND += addLeerzeichen(); nr++;
        $(tempSelection).parent().append(elementWhereAND);
        setSelection(nextElementNr);
    });

    //Button: Add Element
    $('.btnAdd.sqlSelect').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        if ($(tempSelection).hasClass("inputField")) {
            var tempSqlElement = $(tempSelection).data("sql-element");
            $(tempSelection).parent().append("<span id='codeElement_" + nr + "' class='codeElement child inputField sqlIdentifier extended' data-sql-element='" + tempSqlElement + "'>,___</span>");
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
            checkTargetAreaCodeElements();
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

    // on Click TargetArea - deselct
    $('body').on('click', '#targetArea', function (event) {
        event.stopPropagation();
        removeSelection();
        checkTargetAreaCodeElements();
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
    function loadJsonData(level) {
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

    //function: checks all Code Elements in the target area, and updates Code View
    function checkTargetAreaCodeElements() {
        var sqlElements = [];

        $('#targetArea').children(".parent").each(function () {
            var tempSqlElement = $(this).data("sql-element");
            sqlElements.push(tempSqlElement);
        });

        if (!sqlElements.includes("SELECT")) {
            currentSelectedSQLElement = "START";
            updateActiveCodeView();
        } else {
            currentSelectedSQLElement = "";
            updateActiveCodeView();
        }
    }

});
