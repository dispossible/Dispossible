var source = $(".fireSource");
var i = 0;
var burning = true;
var rev = false;
var drift = 0;
var wind = 0;
var heap = 0;

$(document).ready(function(){
    setTimeout(function(){
        if(burning){
            burn();
        }
    },100);
    $('body').append("<div class='heap'></div>");
});

function burn(){
    
    spawnFlame();
    
    var x = Math.floor((Math.random()*10)+50);
    
    if(burning){
        setTimeout(function(){
            burn();
        },x);
    }
    
    if(heap < $("html").height()/4 ){heap += 0.05;}
    $(".heap").height(heap+"px");
}

function spawnFlame(){
    
    var maxHeight = source.height();
    var maxWidth = source.width();
    
    var randHeight = Math.floor(Math.random()*(maxHeight+1));
    var randWidth = Math.floor(Math.random()*(maxWidth-20));
    
    var randSize = Math.floor((Math.random()*4)+2);
    var randSpeed = Math.floor((Math.random()*500)+9000);
    
    var randOpac = Math.random();
    if(randOpac<0.3){randOpac=0.3;}
    else if(randOpac>0.7){randOpac=0.7;}
    
    var randDrift = Math.floor(  ((Math.random()*80)-40) + ((drift-400)/4)  ) + wind;
    
    source.append("<div class='Fflame' id='flame"+i+"' style='bottom:"+randHeight+"px;left:"+randWidth+"px;padding:"+randSize+"px;opacity:"+randOpac+";'></div>");
    
    $("#flame"+i).animate({"top":(randHeight+600)+"px","left":randWidth+randDrift+"px","opacity":"0"},{ duration: randSpeed, queue: false, easing: "linear" });
    
    removeFlame(i, randSpeed);
    
    if(drift>=800){
        rev = true;
    }
    if(drift<=0){
        rev = false;
    }
    if(rev){
        drift=drift-1;
    }else{
        drift=drift+1;
    }

    i=i+1;
    if( i == 10000){
        i=0;
    }
}

function removeFlame(id,time){

    setTimeout(function(){
        $("#flame"+id).remove();
    },time);
    
}