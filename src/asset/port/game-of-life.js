window.gol = {
    
    "var": {
        "aliveCol": "#00a",
        "deadCol": "#ddd",
        "bgCol": "#000",
        "cellSize": 4,
        "border": 0,
        "stepTime": 150,
        "density": 0.5,
        "debug": true
    },
    
    "int": function(){
        var cid = document.getElementById("gol");
        gol.var.width = cid.width;
        gol.var.height = cid.height;
        gol.c = cid.getContext("2d");
        gol.bindBtns();
        while( !(gol.var.width % gol.var.cellSize === 0 && gol.var.height % gol.var.cellSize === 0) ) gol.var.cellSize = gol.var.cellSize-1;
        gol.drawBoard();
        gol.var.cellX = gol.var.height/gol.var.cellSize;
        gol.var.cellY = gol.var.width/gol.var.cellSize;
        gol.var.cells = gol.var.cellX*gol.var.cellY;
        gol.populate();
        gol.drawPopulation();
    },
    
    "drawBoard": function(){
        if( gol.var.border < 1 ){
            gol.c.fillStyle = gol.var.deadCol;
            gol.c.fillRect(0,0,gol.var.width,gol.var.height);
        } else {
            gol.c.fillStyle = gol.var.bgCol;
            gol.c.fillRect(0,0,gol.var.width,gol.var.height);
            gol.c.fillStyle = gol.var.deadCol;
            for( var y = 0 ; y < gol.var.height ; y += gol.var.cellSize ){
                for( var x = 0 ; x < gol.var.width ; x += gol.var.cellSize ){
                    gol.c.fillRect(x,y,gol.var.cellSize-gol.var.border,gol.var.cellSize-gol.var.border);
                }
            }
        }
    },
    
    "populate": function(seed){
        if(typeof seed != "number" || seed === 0) seed = Math.random();
        $("#seed").val(seed);
        gol.population = {};
        for(var y = 0 ; y < gol.var.cellY ; y++){
            for(var x = 0 ; x < gol.var.cellX ; x++){
                var randArr = gol.rand(seed+((y*gol.var.cellX)+x)).toString().replace("0.","").split(""),
                    rand = randArr[((y*gol.var.cellX)+x)%randArr.length];
                gol.population[x+"x"+y] = (rand<=randArr[1]*gol.var.density);
            }
        }
    },
    
    "rand": function(seed) {
        var x = Math.sin(seed++) * 100000;
        return x - Math.floor(x);
    },
    
    "drawPopulation": function(){
        gol.c.fillStyle = gol.var.aliveCol;
        for(var y = 0 ; y < gol.var.cellY ; y++){
            for(var x = 0 ; x < gol.var.cellX ; x++){
                if( gol.population[x+"x"+y] ){
                    gol.c.fillRect(x*gol.var.cellSize,y*gol.var.cellSize,gol.var.cellSize-gol.var.border,gol.var.cellSize-gol.var.border);
                }
            }
        }
    },
    
    "bindBtns": function(){
        $("#seed").on("change",function(){
            clearInterval(gol.interval);
            gol.reset(parseFloat($(this).val(),10));
        });
        $("#randBtn").on("click",function(){
            clearInterval(gol.interval);
            gol.reset();
        });
        $("#resetBtn").on("click",function(){
            clearInterval(gol.interval);
            gol.reset(parseFloat($("#seed").val(),10));
        });
        $("#goBtn").on("click",function(){
            gol.step();
            var t = (gol.var.drawTime > gol.var.stepTime)?gol.var.drawTime+50:gol.var.stepTime;
            gol.interval = setInterval(gol.step,t);
        });
        $("#stopBtn").on("click",function(){
            clearInterval(gol.interval);
        });
        $("#stepBtn").on("click",function(){
            clearInterval(gol.interval);
            gol.step();
        });
        $("#gol").on("click",function(e){
            clearInterval(gol.interval);
            var x = $(this).offset().left - e.pageX,
                y = $(this).offset().top - e.pageY;
            gol.addPop(-x,-y);
        });
        $("#clearBtn").on("click",function(){
            clearInterval(gol.interval);
            gol.clear();
        });
    },
    
    "reset": function(seed){
        gol.populate(seed);
        gol.redraw();
    },
    
    "step": function(){
        var newPop = {},
            timer = new Date().getTime();
        $.each(gol.population,function(i){
            var x = parseInt(i.replace(/x\d+$/,""),10),
                y = parseInt(i.replace(/^\d+x/,""),10),
                cons = 0;
            if( gol.population[(x-1)+"x"+(y-1)] ) cons++;
            if( gol.population[x+"x"+(y-1)] ) cons++;
            if( gol.population[(x+1)+"x"+(y-1)] ) cons++;
            if( gol.population[(x-1)+"x"+y] ) cons++;
            if( gol.population[(x+1)+"x"+y] ) cons++;
            if( gol.population[(x-1)+"x"+(y+1)] ) cons++;
            if( gol.population[x+"x"+(y+1)] ) cons++;
            if( gol.population[(x+1)+"x"+(y+1)] ) cons++;
            if( cons < 2 ){
                newPop[i] = false;
            } else if( cons > 3 ){
                newPop[i] = false;
            } else if( cons == 3 ){
                newPop[i] = true;
            } else {
                newPop[i] = gol.population[i];
            }
        });
        gol.population = newPop;
        gol.redraw();
        gol.var.drawTime = new Date().getTime() - timer;
        gol.drawDebug();
    },
    
    "addPop": function(x,y){
        x = Math.floor(x/gol.var.cellSize);
        y = Math.floor(y/gol.var.cellSize);
        gol.population[x+"x"+y] = !gol.population[x+"x"+y];
        gol.redraw();
    },
    
    "clear": function(){
        $.each(gol.population,function(i){
            gol.population[i] = false;
        });
        gol.redraw();
    },
    
    "redraw": function(){
        gol.drawBoard();
        gol.drawPopulation();
    },
    
    "drawDebug": function(){
        gol.c.fillStyle = "rgba(0,0,0,.5)";
        gol.c.fillRect(10,10,100,40);
        gol.c.fillStyle = "#eee";
        gol.c.fillText("Cells: "+gol.var.cells, 20, 25);
        gol.c.fillText("Frame: "+gol.var.drawTime+"ms", 20, 40);
    },
    
    "saved": [
        {}
    ]
    
};

$(function(){
    gol.int();
});