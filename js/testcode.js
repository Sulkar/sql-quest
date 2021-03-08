$(document).ready(function () {
    var id = 0;
    var currentSelectedElement = 0;
    var leerzeichen = "<span class='codeElement leerzeichen'> </span>";

    // Button: SELECT * FROM *
    $('.btnSelectFrom').click(function () {
        var elementSELECT_FROM = "<span id='codeElement_" + id + "' class='codeWrapper parent'>";
        elementSELECT_FROM += "<span id='codeElement_" + (id + 1) + "' class='codeElement child'>SELECT" + leerzeichen;
        elementSELECT_FROM += "<span id='codeElement_" + (id + 2) + "' class='codeElement child inputField root dbField'>___</span></span>";
        elementSELECT_FROM += leerzeichen + "<span id='codeElement_" + (id + 3) + "' class='codeElement child'>FROM" + leerzeichen;
        elementSELECT_FROM += "<span id='codeElement_" + (id + 4) + "' class='codeElement child inputField root dbTable'>___</span></span>";
        elementSELECT_FROM += "</span></span>";
        if (currentSelectedElement == 0) {
            $('#targetArea').append(elementSELECT_FROM);
        }
        id = id + 5;
    });

    //Button: Add Element
    $('.btnAdd').click(function () {
        var tempSelection = "#" + currentSelectedElement;
        if ($(tempSelection).hasClass("inputField")) {
            $(tempSelection).parent().append("<span id='codeElement_" + id + "' class='codeElement child inputField extended'>,___</span>");
            removeSelection();
            $("#codeElement_" + id).addClass("active");
            currentSelectedElement = "codeElement_" + id;
            id++;
        }
    });

    // Button: Delete Element
    $('.btnDelete').click(function () {
        var tempSelection = "#" + currentSelectedElement;
        if (!$(tempSelection).hasClass("child") || $(tempSelection).hasClass("extended")) {
            $(tempSelection).remove();
            currentSelectedElement = 0;
        } else if ($(tempSelection).hasClass("inputField") && $(tempSelection).hasClass("root")) {
            $(tempSelection).html("___");
        } else {
            $(tempSelection).parent().addClass("active");
            currentSelectedElement = $(tempSelection).parent().attr('id');
        }
    });

    // on Click Element
    $('body').on('click', 'span', function (event) {
        event.stopPropagation();
        removeSelection();
        $(this).addClass("active");
        currentSelectedElement = $(this).attr('id');
        $("#debug").html("Selected: " + currentSelectedElement);
    });

    // on Click TargetArea - deselct
    $('body').on('click', '#targetArea', function (event) {
        event.stopPropagation();
        removeSelection();
    });

    // Select: add dbField, dbTable
    $('.selectElement').on('change', function () {
        var tempSelection = "#" + currentSelectedElement;
        if ($(tempSelection).hasClass("extended")) {
            $(tempSelection).html("," + this.value);
        } else {
            $(tempSelection).html(this.value);
        }
        removeSelection();
    });

    //function: remove Selectioon from all Elements
    function removeSelection() {
        $(".codeElement").removeClass("active");
        currentSelectedElement = 0;
    }
});
