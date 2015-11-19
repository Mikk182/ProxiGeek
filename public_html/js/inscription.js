$( document ).ready(function() {
    
    var form = $('#form1');
    
    $(form).submit(function(event) {
        // Stop the browser from submitting the form.
        event.preventDefault();

        var formData = $(form).serialize();

        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData,
            success: function () {
                window.location.href = "./index.html";
            },
            error: function (err) {
                console.log(err)
                alert(err);
            },
        })
    });
});