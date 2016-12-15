$(function(){

    $(".smallHeader").on("click",function(){
        toggleNav();
    });

    function toggleNav(){

        var nav = $(".pageNav"),
            h = 0;

        if( nav.hasClass("closed") ){

            nav.removeClass("closed").height("auto");

            $(window).trigger("resize");

            h = nav.height();
            nav.height("0px");

        } else {
            nav.addClass("closed");
        }

        TweenMax.to(nav,1,{ css:{ height:h+"px" }, ease:Power2.easeOut, onUpdate: function(){
            $(window).trigger("resize");
        } });
        toggleIcon( h>0 );

    }

    function toggleIcon(open){

        var icn = $(".menuBtn"),
            barH = (icn.find(".menuLine1").height()/2)*-1;


        if(open){

            TweenMax.to(icn.find(".menuLine1"),2,{ css: { top:"50%", marginTop:barH+"px", rotation:-135 }, ease:Bounce.easeOut });
            TweenMax.to(icn.find(".menuLine3"),2,{ css: { bottom:"50%", marginBottom:barH+"px", rotation:135 }, ease:Bounce.easeOut });
            TweenMax.to(icn.find(".menuLine2"),0.5,{ css: { left:40 }, ease:Power1.easeOut });

        } else {

            TweenMax.to(icn.find(".menuLine1"),3,{ css: { top:0,  marginTop:0, rotation:0 }, ease:Elastic.easeOut });
            TweenMax.to(icn.find(".menuLine3"),3,{ css: { bottom:0,  marginBottom:0, rotation:0 }, ease:Elastic.easeOut });
            TweenMax.to(icn.find(".menuLine2"),3,{ css: { left:0 }, ease:Elastic.easeOut });

        }

    }

});