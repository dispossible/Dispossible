var mPos = -1,
    lives = 3,
    score = 0,
    isPlay = false,
    size = 5,
    level = 1,
    best = 0,
    bonus = 1,
    powerHud = ["",-1,-1];

$(".game").mousemove(function(e) {
    mPos = e.pageX - $(this).offset().left;
});

function gameInt(){
    if( level == 1 ){
        score = 0;
        lives = 3;
        size = 5;
    }
    if( level == 4 ) size = 7;
    if( level == 8 ) size = 9;
    if( level == 12 ) size = 11;
    if( level == 20 ) size = 13;
    if( localStorage["best"] > best ) best = localStorage["best"];
    var blocks = "",
        i = 0,
        x = 0,
        width = 100/size;
    while( x < size ){
        blocks += "<div class='block block"+i+" row"+x+"' style='width:"+width+"%;left:"+((width*(size-(i%size)))-width)+"%;top:"+(20*x)+"px'></div>";
        i++;
        if( i % size === 0 ){
            x++;
        }
    }
    $(".game")
        .html("<div class='ball'></div>")
        .append("<div class='paddle'></div>")
        .append("<div class='hud'></div>")
        .append("<div class='blocks'>"+blocks+"</div>");
    updateHud();
    setTimeout( function(){ gameStart(); } , 3000 );
}
gameInt();

function gameStart(){
    $(".ball").attr( "x" , "0" ).attr( "y" , "-10" );
    isPlay = true;
    animate();
}

function animate(){
    if(!isPlay)return;
    paddle();
    victory();
    collision();
    var ball = $(".ball"),
        nX = parseInt( ball.attr("x") )*(1+((level-1)/50)),
        nY = parseInt( ball.attr("y") )*(1+((level-1)/50)),
        cX = parseInt( ball.css("left") ),
        cY = parseInt( ball.css("top") );
    ball.css({"left":(nX+cX)+"px","top":(nY+cY)+"px"});
    updateHud();
    setTimeout( function(){ animate(); } , 20 );
}

function paddle(){
    var p = $(".paddle"),
        pos = mPos,
        pW = p.width()/2,
        bW = $(".game").width();
    if( pos < pW ){
        pos = pW;
    } else
    if( pos > bW - pW ){
        pos = bW - pW;
    }
    p.css( "left" , pos+"px" );
}

function collision(){
    var ball = $(".ball"),
        cX = parseInt( ball.css("left") ),
        cY = parseInt( ball.css("top") ),
        cS = parseInt( ball.css("padding") ),
        nX = parseInt( ball.attr("x") ),
        nY = parseInt( ball.attr("y") ),
        bW = $(".game").width(),
        bH = $(".game").height(),
        hitX = false,
        hitY = false;
    //Side
    if( ( cX < 0 + cS && nX < 0 ) || ( cX > bW - cS && nX > 0 ) ){
        hitX = true;
    }
    //Top
    if( cY < 0 + cS && nY < 0 ){
        hitY = true;
    }
    //Bottom
    if( cY > bH - cS && nY > 0 ){
        hitY = true;
        hit();
    }
    //Block
    $(".block").each(function(){
        var aX = $(this).offset().left - $(".game").offset().left,
            aY = $(this).offset().top - $(".game").offset().top,
            aW = $(this).width(),
            aH = $(this).height();
        if( ( cX - cS < aX + aW && cX + cS > aX ) && ( cY - cS < aY + aH && cY + cS > aY ) ){
            addScore(level);
            if( Math.random()*10 > 9.5 && powerHud[1] <= 0 ) powerUp(aX,aY,aW);
            $(this).remove();
            if( cX - cS > (aX + aW) - 9.9 && nX < 0 ){
                hitX = true;
            } else
            if( cX + cS < aX + 9.9 && nX > 0 ){
                hitX = true;
            } else {
                hitY = true;
            }
        }
    });
    if( hitY ){
        ball.attr( "y" , -nY );
    } else
    if( hitX ){
        ball.attr( "x" , -nX );
    }
    //Paddle
    if( cY + cS > bH - 20 && cY < bH - cS ){
        var pW = $(".paddle").width() / 2,
            pX = parseInt( $(".paddle").css("left") );
        if( ( cX - cS < pX + pW ) && ( cX + cS > pX - pW ) ){
            var nnX = Math.round( ((cX - pX) / (pW*2)) * 10 ),
                nnY = 0,
                tnX = nnX;
            if(nnX < 0)tnX = -nnX;
            nnY = -(10 - tnX);
            if(nnY > 0) nnY = -nnY;
            
            ball
                .attr( "y" , nnY )
                .attr( "x" , nnX );
        }
    }
}

function hit(){
    lives = lives-1;
    $(".game").css({"background-color":"#f66","transition":"0ms"});
    setTimeout( function(){ $(".game").css({"background-color":"#eee","transition":"400ms"}); } , 10 );
    if( lives <= 0 ){
        gameOver();
    }
}

function addScore(add){
    if( isNaN(add) ) add = 1;
    score += add*bonus;
}

function gameOver(){
    isPlay = false;
    var newBest = "";
    if( score > best ){
        localStorage["best"] = score;
        best = score;
        newBest = "<br/><br/>New Best Score!";
    }
    $(".game").html( "<br/><br/><br/>Game Over<br/><br/>Score: "+score+newBest );
    setTimeout( function(){
        level = 1;
        gameInt();
    } , 4000 );
}

function victory(){
    if( $(".block").size() <= 0 ){
        isPlay = false;
        setTimeout( function(){
            $(".game").html("<br/><br/><br/>Level "+level+" Complete<br/><br/>Score: "+score);
            level++;
            setTimeout( function(){ 
                gameInt();
            } , 2000 );
        } , 1000 );
    }
}

function powerUp(X,Y,W){
    var power = $("<div class='power' style='top:"+Y+"px;left:"+X+"px;width:"+W+"px;'></div>"),
        rand = Math.floor(Math.random()*6);
    $(".game").append(power);
    power.animate({"top":Y+30,"opacity":"0"},1000);
    setTimeout(function(){ power.remove(); },1000);
    if( rand === 0 ){
        power.html("+1 Life");
        lives++;
        updateHud();
    } else
    if( rand == 1 ){
        power.html("Wide Paddle");
        powerHud = ["Wide Paddle",10,new Date().getTime()];
        $(".paddle").css({"width":"100px","margin-left":"-50px"});
        setTimeout( function(){ $(".paddle").attr("style",""); } , 10000 );
    } else
    if( rand == 2 ){
        power.html("2X Score");
        powerHud = ["2X Score",10,new Date().getTime()];
        bonus = 2;
        setTimeout( function(){ bonus = 1; } , 10000 );        
    } else
    if( rand == 3 ){
        power.html("GOD Mode");
        powerHud = ["GOD Mode",10,new Date().getTime()];
        $(".paddle").css({"width":"100%","margin-left":"-50%"});
        setTimeout( function(){ $(".paddle").attr("style",""); } , 10000 );
    } else
    if( rand == 4 ){
        power.html("Invisibility");
        powerHud = ["Invisibility",10,new Date().getTime()];
        $(".paddle").hide();
        setTimeout( function(){ $(".paddle").attr("style",""); } , 10000 );
    } else
    if( rand == 5 ){
        power.html("4X Score");
        powerHud = ["4X Score",7,new Date().getTime()];
        bonus = 4;
        setTimeout( function(){ bonus = 1; } , 7000 );
    }
}

function updateHud(){
    if( score > best ) best = score;
    var powerHudOut = "";
    if( powerHud[1] > 0 ){
        var cT = new Date().getTime();
        if( cT-1000 > powerHud[2] ){
            powerHud[1]--;
            powerHud[2] = cT;
        }
        powerHudOut = powerHud[0] + " for " + powerHud[1] + " seconds";
    }
    $(".hud").html("<span class='level'>Level: "+level+"</span><span class='lives'>Lives: "+lives+"</span><span class='score'>Score: "+score+"</span><span class='best'>Best: "+best+"</span><div class='powerHud'>"+powerHudOut+"</div>");
}

