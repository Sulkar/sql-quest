$(document).ready(function () {
    var id = 0;
    var currentSelectedElement = 0;

    // Buttons
    $('#btnSelect').click(function () {
        var elementSELECT = "<span id='select_" + id + "' class='codeElement' data-type=''>SELECT <span id='select_child_" + id + "' class='codeElement child' data-type='myInput'>___ </span></span>";
        if (currentSelectedElement == 0) {
            $('#targetArea').append(elementSELECT);
        } else {
            if ($("#" + currentSelectedElement).data("type") == "myInput") {
                $("#" + currentSelectedElement).html(elementSELECT);
            }

        }
        id++;
    });
    $('#btnFrom').click(function () {
        $('#targetArea').append("<span id='from_" + id + "' class='codeElement' data-id='" + id + "'>FROM <span id='from_child_" + id + "' class='codeElement child' data-id='" + id + "'>___ </span></span>");
        id++;
    });

    $('#btnDelete').click(function () {
        if (!$("#" + currentSelectedElement).hasClass("child")) {
            $("#" + currentSelectedElement).remove();
            currentSelectedElement = 0;
        } else {
            $("#" + currentSelectedElement).parent().addClass("active");
            currentSelectedElement = $("#" + currentSelectedElement).parent().attr('id');
        }
    });

    $('body').on('click', 'span', function (event) {
        event.stopPropagation();
        $(".codeElement").removeClass("active");
        $(this).addClass("active");
        currentSelectedElement = $(this).attr('id');
        $("#debug").html("Selected: " + currentSelectedElement);
    });
    $('body').on('click', '#targetArea', function (event) {
        event.stopPropagation();
        removeSelection();
    });

    $('#tables').on('change', function () {
        $("#" + currentSelectedElement).html(this.value + " ");
        removeSelection();
    });

    function removeSelection() {
        $(".codeElement").removeClass("active");
        currentSelectedElement = 0;
    }
});
