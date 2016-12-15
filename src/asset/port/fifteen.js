$(".gen").click(function(){
    if( $(".size").val()>1 && $(".size").val()<11 ){
        generate( Math.round($(".size").val()) , $(".image").val() );
        isShuf = false;
    }
});
$(".solve").click(function(){
    if( !isSolving ){
        isShuf = false;
        isSolving = true;
        solve(0);
    }
});

var whiteX = 0,
    whiteY = 0,
    gridSize = 0,
    delay = 150,
    isShuf = false,
    isSolving = false,
    img = [
        "/asset/port/fifteen-img00.png",
        "/asset/port/fifteen-img01.png",
        "/asset/port/fifteen-img02.png",
        "/asset/port/fifteen-img03.png",
        "/asset/port/fifteen-img04.png",
        "/asset/port/fifteen-img05.png",
        "/asset/port/fifteen-img06.png",
    ];

for( var i in img ){
    $("<img/>").attr("src",img[i]);
}

function generate(size,imgN){
    $(".out").html("<div class='board'></div>");
    $(".board").css({"width":size*100,"height":size*100});
    for( var i = 0 ; i < (size*size)-1 ; i++ ){
        var X = i % size,
            Y = Math.floor( i / size );
        $(".board").append("<div class='block block"+i+" x"+X+" y"+Y+"'></div>");
        $(".block"+i).css({"top":Y*100,"left":X*100,"background-position":(0-(X*100))+"px "+(0-(Y*100))+"px","background-size":(size*100)+"px","background-image":"url("+img[imgN]+")"});
    }
    whiteX = size-1;
    whiteY = size-1;
    gridSize = size;
    $(".block").click(function(){
        tryMove(
            parseInt($(this).attr("class").match(/x\d+/).toString().replace("x","")),
            parseInt($(this).attr("class").match(/y\d+/).toString().replace("y",""))
        );
    });
    setTimeout(function(){
        isShuf = true;
        shuffle(0);
    },(delay*2));
}

function shuffle(x){
    if( !isShuf || x > gridSize*5 ){
        return;
    }
    for( var i = 0 ; i < gridSize*5 ; i++ ){
        var rand = Math.floor(Math.random()*4);
        if( whiteY !== 0 && rand === 0 ){
            tryMove( whiteX , whiteY-1 , 0 );
        }else if( whiteX != gridSize-1 && rand == 1 ){ 
            tryMove( whiteX+1 , whiteY , 0 );
        }else if( whiteY != gridSize-1 && rand == 2 ){ 
            tryMove( whiteX , whiteY+1 , 0 );
        }else if( whiteX !== 0 && rand == 3 ){ 
            tryMove( whiteX-1 , whiteY , 0 );
        }
    }
    isSolved();
    setTimeout(function(){ shuffle(x+1); },0);
}

function tryMove(X,Y,speed){
    if( ((whiteX == X+1 || whiteX == X-1) && whiteY == Y) || ((whiteY == Y-1 || whiteY == Y+1) && whiteX == X) ){
        move(X,Y,speed);
    }
    setTimeout(function(){ isSolved(); },50);
}
function move(X,Y,speed){
    if( isNaN(speed) ) speed = (delay-(delay*0.1));
    $(".x"+X+".y"+Y)
        .animate({"top":(whiteY*100),"left":(whiteX*100)},speed)
        .removeClass("x"+X)
        .removeClass("y"+Y)
        .addClass("x"+whiteX)
        .addClass("y"+whiteY);
    whiteX = X;
    whiteY = Y;
}

function isSolved(){
    var blockTrue = 0;
    for( var i = 0 ; i < (gridSize*gridSize)-1 ; i++ ){
        var X = parseInt($(".block"+i).attr("class").match(/x\d+/).toString().replace("x","")),
            Y = parseInt($(".block"+i).attr("class").match(/y\d+/).toString().replace("y","")),
            tX = i % gridSize,
            tY = Math.floor( i / gridSize );
        //$(".x"+X+".y"+Y).css({"background-color":"#a55"});
        if( X == tX && Y == tY ){
            blockTrue++;
            //$(".x"+X+".y"+Y).css({"background-color":"#5a5"});
        }
    }
    if( blockTrue == (gridSize*gridSize)-1 ) return true;
    return false;
}

function solve(block,solveFor){
    //Check if done
    if( isSolved() ){
        isSolving = false;
        return;
    }
    isSolving = true;
    if( solveFor != "top" && solveFor != "bottom" && solveFor != "spin" ) solveFor = "top";
    //Get currect postion and target
    var X = parseInt($(".block"+block).attr("class").match(/x\d+/).toString().replace("x","")),
        Y = parseInt($(".block"+block).attr("class").match(/y\d+/).toString().replace("y","")),
        tX = block % gridSize,
        tY = Math.floor( block / gridSize ),
        delayOut = 1;
    if( X == tX && Y == tY && solveFor != "spin" ) delayOut = 0;
    //Solve top blocks
    if( solveFor == "top" && ( tX != X || tY != Y ) ){
        //Try to move block
        if( (tX < X && whiteX == X-1 && whiteY == Y) || (tX > X && whiteX == X+1 && whiteY == Y) || ( tX == X && whiteY == Y-1 && whiteX == X ) ){
            tryMove( X , Y );
        } else
        //Corner sequence
        if( tX == X && tX == gridSize-1 && tY == Y-1 ){
            if( whiteY == Y && whiteX == X-1 ){
                tryMove( whiteX-1 , whiteY );
                setTimeout(function(){ tryMove( whiteX , whiteY-1 ); },delay*1);
                setTimeout(function(){ tryMove( whiteX+1 , whiteY ); },delay*2);
                setTimeout(function(){ tryMove( whiteX+1 , whiteY ); },delay*3);
                setTimeout(function(){ tryMove( X , Y ); },delay*4);
                setTimeout(function(){ tryMove( whiteX-1 , whiteY ); },delay*5);
                setTimeout(function(){ tryMove( whiteX , whiteY-1 ); },delay*6);
                setTimeout(function(){ tryMove( whiteX-1 , whiteY ); },delay*7);
                setTimeout(function(){ tryMove( whiteX , whiteY+1 ); },delay*8);
                delayOut = delayOut + 9;
            } else
            if( whiteX == X && whiteY > Y ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteX < X-1 ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX == X-1 && whiteY > Y ){
                tryMove( whiteX , whiteY-1 );
            }
        }else
        //Move white
        if( X == gridSize-1 && tY != Y ){
            if( tX == gridSize-1 ){
                if( whiteX == X && whiteY > Y ){
                    tryMove( whiteX-1 , whiteY );
                } else
                if( whiteX < X && whiteY >= Y ){
                    tryMove( whiteX , whiteY-1 );
                } else
                if( whiteY < Y && whiteX < X  ){
                    tryMove( whiteX+1 , whiteY );
                } else
                if( whiteY < Y && whiteX == X ){
                    tryMove( whiteX , whiteY+1 );
                }
            } else {
                if( whiteX == X && whiteY < Y-1 ){
                    tryMove( whiteX , whiteY+1 );
                } else
                if( whiteX == X && whiteY != Y ){
                    tryMove( whiteX-1 ,whiteY );
                } else
                if( whiteX < X-1 ){
                    tryMove( whiteX+1 , whiteY );
                } else
                if( whiteX < X && whiteY < Y ){
                    tryMove( whiteX , whiteY+1 );
                } else
                if( whiteX < X && whiteY > Y ){
                    tryMove( whiteX , whiteY-1 );
                } else
                if( whiteX < X && whiteY == Y ){
                    tryMove( whiteX+1 , whiteY );
                }
            }
        } else
        if( X == gridSize-1 && tY == Y && tX != X ){            
            if( whiteX < X-1 ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX == X ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteX < X && whiteY < Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX < X && whiteY > Y ){
                tryMove( whiteX , whiteY-1 );
            }
        }else
        if( Y == gridSize-1 ){
            if( tX < X ){
                if( whiteX > X && whiteY == Y ){
                    tryMove( whiteX , whiteY-1 );
                } else
                if( whiteY < Y-1 ){
                    tryMove( whiteX , whiteY+1 );
                } else
                if( whiteX >= X && whiteY < Y ){
                    tryMove( whiteX-1 , whiteY );
                } else
                if( whiteX < X && whiteY < Y ){
                    tryMove( whiteX , whiteY+1 );
                } else
                if( whiteX < X && whiteY == Y ){
                    tryMove( whiteX+1 , whiteY );
                }
            } else
            if( tX > X ){
                if( whiteX < X && whiteY == Y ){
                    tryMove( whiteX , whiteY-1 );
                } else
                if( whiteY < Y-2 ){
                    tryMove( whiteX , whiteY+1 );
                } else
                if( whiteX <= X && whiteY < Y ){
                    tryMove( whiteX+1 , whiteY );
                } else
                if( whiteX > X && whiteY < Y ){
                    tryMove( whiteX , whiteY+1 );
                } else
                if( whiteX > X && whiteY == Y ){
                    tryMove( whiteX-1 , whiteY );
                }
            } else
            if( tX == X ){
                if( whiteY == Y ){
                    tryMove( whiteX , whiteY-1 );
                } else
                if( whiteY < Y-1 ){
                    tryMove( whiteX , whiteY+1 );
                } else
                if( whiteX < X && whiteY < Y ){
                    tryMove( whiteX+1 , whiteY );
                } else
                if( whiteX > X && whiteY < Y ){
                    tryMove( whiteX-1 , whiteY );
                }
            }
        } else
        if( tX < X ){
            if( whiteX <= X && whiteY <= Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX > X && whiteY <= Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX >= X && whiteY > Y ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteX < X-1 && whiteY > Y ){
                tryMove( whiteX+1 , whiteY );
            }else
            if( whiteX < X && whiteY > Y ){
                tryMove( whiteX , whiteY-1 );
            } else
            if( whiteX < X && whiteY == Y ){
                tryMove( whiteX+1 , whiteY );
            }
        } else
        if( tX > X ){
            if( whiteX <= X && whiteY < Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX > X && whiteY < Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX < X && whiteY == Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX <= X && whiteY > Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX > X && whiteY > Y ){
                tryMove( whiteX , whiteY-1 );
            } else
            if( whiteX > X && whiteY == Y ){
                tryMove( whiteX-1 , whiteY );
            }
        } else
        if( tY < Y ){
            if( whiteX < X && whiteY < Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX == X && whiteY < Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX > X && whiteY < Y ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteX > X && whiteY >= Y ){
                tryMove( whiteX , whiteY-1 );
            } else
            if( whiteX <= X && whiteY > Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX < X && whiteY == Y ){
                tryMove( whiteX , whiteY+1 );
            }
        }
    } else
    //Solve left-right
    if( solveFor == "bottom" && ( tX != X || tY != Y ) ){
        //Slot in
        if( X-2 == tX && tY == Y ){
            if( whiteY == Y && whiteX == X-1 ){
                tryMove( whiteX-1 , whiteY );
                setTimeout(function(){ tryMove( whiteX , whiteY-1 ); },delay*1);
                setTimeout(function(){ tryMove( whiteX+1 , whiteY ); },delay*2);
                setTimeout(function(){ tryMove( whiteX , whiteY+1 ); },delay*3);
                setTimeout(function(){ tryMove( whiteX+1 , whiteY ); },delay*4);
                setTimeout(function(){ tryMove( whiteX , whiteY-1 ); },delay*5);
                setTimeout(function(){ tryMove( whiteX-1 , whiteY ); },delay*6);
                setTimeout(function(){ tryMove( whiteX-1 , whiteY ); },delay*7);
                setTimeout(function(){ tryMove( whiteX , whiteY+1 ); },delay*8);
                setTimeout(function(){ tryMove( whiteX+1 , whiteY ); },delay*9);
                delayOut = delayOut + 10;
            } else
            if( whiteX < X && whiteY == Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX < X && whiteY < Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX >= X && whiteY < Y ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteX > X && whiteY == Y ){
                tryMove( whiteX , whiteY-1 );
            }
        } else
        if( (X-2 == tX && Y < tY) || (X > tX+2 && Y < tY) ){
            if( whiteY > Y && whiteX == X ){
                tryMove( X , Y );
            } else
            if( whiteY == Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX > X ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteX < X ){
                tryMove( whiteX+1 , whiteY );
            }
        } else
        if( X < tX+2 ){
            if( whiteX == X && whiteY < Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteX == X+1 && whiteY == Y ){
                tryMove( X , Y );
            } else
            if( whiteX > X && whiteY == Y ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteY > Y && whiteX < X ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteY < Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX < X && whiteY == Y ){
                tryMove( X , Y );
            } else
            if( whiteY > Y ){
                tryMove( whiteX , whiteY-1 );
            }
        } else
        if( X > tX+2 ){
            if( whiteX > X && whiteY == Y && Y == tY ){
                tryMove( whiteX , whiteY-1 );
            } else
            if( whiteX >= X && whiteY < Y ){
                tryMove( whiteX-1 , whiteY );
            } else
            if( whiteX < X && whiteY < Y ){
                tryMove( whiteX , whiteY+1 );
            } else
            if( whiteX < X && whiteY == Y ){
                tryMove( whiteX+1 , whiteY );
            } else
            if( whiteY > Y && whiteX == X ){
                tryMove( X , Y );
            } else
            if( whiteY > Y ){
                tryMove( whiteX+1 , whiteY );
            }
        }
    } else
    //Solve last 3 Blocks
    if( solveFor == "spin" ){
        if( whiteX == gridSize-1 && whiteY == gridSize-1 ){
            tryMove( whiteX , whiteY-1 );
        } else
        if( whiteX == gridSize-1 && whiteY == gridSize-2 ){
            tryMove( whiteX-1 , whiteY );
        } else
        if( whiteX == gridSize-2 && whiteY == gridSize-2 ){
            tryMove( whiteX , whiteY+1 );
        } else
        if( whiteX == gridSize-2 && whiteY == gridSize-1 ){
            tryMove( whiteX+1 , whiteY );
        }
    }
    //Next Block
    if( X == tX && Y == tY ){
        //Solving top rows
        if( (block + 1) <= (gridSize*gridSize) - (gridSize * 2) ){
            block++;
            solveFor = "top";
        } else 
        //Solve left-right
        if( Math.floor( (block + 1) / gridSize) < gridSize-1 ){
            block += gridSize;
            solveFor = "bottom";
        } else if( block % gridSize < gridSize - 3 ) {
            block = block - (gridSize - 1);
            solveFor = "top";
        }
        //Last 3
        else {
            block = (gridSize*gridSize)-2;
            solveFor = "spin";
        }
    }
    //Loop
    setTimeout(function(){ solve( block , solveFor ); },(delay*delayOut));
}
