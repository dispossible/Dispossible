$(function(){
    var html = "";
    for( var i=1 ; i<=210 ; i++ ){
        html += "<div class='wait"+i%20+"'><span></span></div>";
        if( 0 === i%21 ) html += "<br/>";
    }
    $("body").append(html);
});