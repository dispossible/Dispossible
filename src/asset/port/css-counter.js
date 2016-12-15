setInterval(function(){
    var r = Math.floor(Math.random()*3),
        c = "a";
    if(r===0) c="a";
    if(r===1) c="b";
    if(r===2) c="c";
    $('.counter').append("<span class='"+c+"'></span><a></a>");
},100);