var i = 0;
var y = 0;
var z = 0;
setInterval(function(){
    $(".teaCup").append("<div class='puff puff"+i+"'></div>");
    $(".puff"+i).css({"transform":"rotateY("+y+"deg) rotateZ("+z+"deg)"});
    $(".puff"+i).animate({"top":"-300px","left":"100%"},{duration:5000, queue:false},function(){
        $(this).remove();   
    });
    $(".puff"+i).animate({"opacity":"1"},{duration:2500, queue:true});    
    $(".puff"+i).animate({"opacity":"0"},{duration:2500, queue:true});
    y = y + (Math.random()*10)/2;
    z = z + (Math.random()*10)/2;
    i++;
},1);