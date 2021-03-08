$(document).ready(function () {
    var nr = 0;
    var currentSelectedElementID = "";
    var nextElementNr = 0;

    // Button: SELECT * FROM *
    $('.btnSelectFrom').click(function () {
        removeSelection();
        currentSelectedElementID = "";
        var elementSELECT_FROM = "<span id='codeElement_" + nr + "' class='codeWrapper parent'>"; nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child'>SELECT"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child inputField root dbField' data-next-element='" + (nr + 4) + "'>___</span></span>"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child'>FROM"; nr++;
        elementSELECT_FROM += addLeerzeichen(); nr++;
        elementSELECT_FROM += "<span id='codeElement_" + nr + "' class='codeElement child inputField root dbTable' data-next-element='" + (nr - 4) + "'>___</span></span>";
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
        var elementWHERE = "<span id='codeElement_" + nr + "' class='codeWrapper parent'>"; nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child'>WHERE"; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root' data-next-element='" + (nr + 2) + "'>___</span></span>";
        nextElementNr = nr; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root' data-next-element='" + (nr + 2) + "'>___</span>"; nr++;
        elementWHERE += addLeerzeichen(); nr++;
        elementWHERE += "<span id='codeElement_" + nr + "' class='codeElement child inputField root' data-next-element='" + (nr - 4) + "'>___</span>"; nr++;
        elementWHERE += "</span></span>";
        elementWHERE += addLeerzeichen(); nr++;
        $('#targetArea').append(elementWHERE);
        setSelection(nextElementNr);
    });

    //Button: Add Element
    $('.btnAdd').click(function () {
        var tempSelection = "#" + currentSelectedElementID;
        if ($(tempSelection).hasClass("inputField")) {
            $(tempSelection).parent().append("<span id='codeElement_" + nr + "' class='codeElement child inputField extended'>,___</span>");
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
        var elementNr = getElementNr($(this).attr('id'));
        setSelection(elementNr);
        $("#debug").html("Selected: " + currentSelectedElementID);
    });

    // on Click TargetArea - deselct
    $('body').on('click', '#targetArea', function (event) {
        event.stopPropagation();
        removeSelection();
    });


    // Select: add dbField, dbTable
    $('.sqlSelect').on('change', function () {
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

    //function: remove Selection from all Elements
    function removeSelection() {
        $(".codeElement").removeClass("active");
        currentSelectedElementID = "";
    }

    //function: set Selection to an Element
    function setSelection(elementNr) {
        $("#codeElement_" + elementNr).addClass("active");
        currentSelectedElementID = "codeElement_" + elementNr;
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
});
