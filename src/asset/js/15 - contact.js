$(function(){

    var frm = $("#contact");


    //Capture
    $(".cap2").hide();
    $("input[name='val4']",frm).val( parseInt($("input[name='val1']",frm).val()) + parseInt($("input[name='val2']",frm).val()) );


    //Validation triggers
    $("input, textarea",frm).on("change input",function(){
        validate();
    });
    $("input, textarea",frm).on("blur",function(){
        $(this).parent().addClass("active");
        validate();
    });


    //Submition
    frm.submit(function (e) {
        e.preventDefault();

        $("input[name='name']",frm).parent().addClass("active");
        $("input[name='email']",frm).parent().addClass("active");
        $("textarea[name='msg']",frm).parent().addClass("active");

        var valid = validate();

        if( valid !== "" ){

            $(".validationMsg",frm).html(valid).addClass("error");

        }else{

            $(".validationMsg",frm).html("&nbsp;").removeClass("error");
            $(".sender",frm).addClass("loading");

            $.ajax({
                url: frm.attr('action')+"?json=true",
                type: "POST",
                cache: false,
                data: frm.serialize(),
                dataType: "json",
                success: function (d) {
                    if( d.status == "error" ){

                        $(".validationMsg",frm).html( arrayToMsg(d.error) ).addClass("error");

                    } else {

                        $(".sender").html("Sent");

                    }

                    $(".sender",frm).removeClass("loading");

                },
                error: function(a,b,c){
                    $(".validationMsg",frm).html("There was an issue contacting the server").addClass("error");
                    $(".sender",frm).removeClass("loading");
                    console.error(b,c);
                }
            });
        }
    });


    function validate(){
        var error = [];
        if( !$("input[name='name']",frm).val().match(/\w+/) ){
            error.push("full name");
            if( $("input[name='name']",frm).parent().hasClass("active") ) $("input[name='name']",frm).parent().addClass("error");
        } else {
            $("input[name='name']",frm).parent().removeClass("error");
        }
        if( !$("input[name='email']",frm).val().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-\.]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/) ){
            error.push("email address");
            if( $("input[name='email']",frm).parent().hasClass("active") ) $("input[name='email']",frm).parent().addClass("error");
        } else {
            $("input[name='email']",frm).parent().removeClass("error");
        }
        if( $("textarea[name='msg']",frm).val() === "" ){
            error.push("message");
            if( $("textarea[name='msg']",frm).parent().hasClass("active") ) $("textarea[name='msg']",frm).parent().addClass("error");
        } else {
            $("textarea[name='msg']",frm).parent().removeClass("error");
        }
        if( $("input[name='message']",frm).val() !== "" ){
            error.push("blank input");
        }
        if( error.length > 0 ){
            return arrayToMsg(error);
        } else {
            return "";
        }
    }


    function arrayToMsg(a){
        var msg = "Please check your ";
        for( var i = 0 ; i < a.length ; i++ ){
            msg += a[i];
            if( a[i+1] ){
                if( i == a.length-2 ){
                    msg += " and ";
                }else{
                    msg += ", ";
                }
            }
        }
        return msg;
    }

});