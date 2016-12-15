$(function(){

    $(window).on("load resize",function(){

        positionFooter();

    });


    function positionFooter(){

        var footer = $(".pageFooter"),
            windowHeight = window.innerHeight;

        footer.css({ position:"relative" });
        var pageHeight = $("body").height();

        if( pageHeight < windowHeight ){

            footer.css({ position:"fixed" });

        }

    }

});