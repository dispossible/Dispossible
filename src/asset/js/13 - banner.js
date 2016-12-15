$(function(){

    if( !Modernizr.canvas ) return;

    function Banner(hold){

        if( $(hold).length < 1 ) return;

        //Create canvas
        this.c = $("<canvas></canvas>");
        this.ctx = this.c[0].getContext("2d");
        $(hold).prepend(this.c);

        this.objs = [];
        this.bg = $(hold).css("backgroundColor");
        this.resized = false;
        this.lastUpdate = -1;

        this.fpsArr = [];
        this.frame = 0;

        //Resizing canvas
        var timeout = null;
        $(window).on("resize",function(){
            if( timeout ) clearTimeout( timeout );
            timeout = setTimeout( function(){
                this.resized = true;
            }.bind(this), 100 );
        }.bind(this));

        //Start animation
        this.resize();
        this.populate(false);
        
        this.ctx.fillStyle = this.bg;
        this.loop();

    }
    Banner.prototype = {
        constructor: Banner,
        //Resize the canvas
        resize: function() {
            var b = $(".banner"),
                w = b.cssWidth(),
                h = b.cssHeight();
            this.c[0].width = w;
            this.c[0].height = h;
            this.width = w;
            this.height = h;
            this.totalObjs = Math.round((w/10) + (h/40));
            this.resized = false;
            this.ctx.fillStyle = this.bg; //Resize apparently resets the fill color
        },
        //Populate the objects
        populate: function(hide){
            for( var diff = this.objs.length ; diff < this.totalObjs ; diff++ ){
                this.addNew(hide);
            }
            this.sortObjs();
        },
        //Clear canvas
        clearCtx: function(){
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.fillRect(0,0,this.width,this.height);
        },
        //Add new spheres
        addNew: function(hide){
            this.objs.push( new Sphere(hide,this.width,this.height) );
        },
        //Sort objects
        sortObjs: function(){
            this.objs.sort(function(a,b){
                if( a.blur > b.blur ) return -1;
                if( a.blur < b.blur ) return 1;
                return 0;
            });
        },
        //Main animation loop
        loop: function(){

            var time = Date.now() - this.lastUpdate;
            if( this.lastUpdate < 0 ) time = 1;
            this.lastUpdate = Date.now();

            if( true  /*Show FPS*/){
                this.fpsArr.push(time);
                if( this.fpsArr.length > 100 ) this.fpsArr.unshift();
                this.frame++;

                if( this.frame % 20 === 0 ){
                    var sum = this.fpsArr.reduce(function(a, b) { return a + b; });
                    var avg = sum / this.fpsArr.length;
                    this.ctx.fillStyle = "#fff";
                    this.ctx.fillText("fps: "+avg, 20, 20);
                    this.ctx.fillStyle = this.bg;
                    //console.log(avg); //Framerate
                }
            }

            //Prevent low fps problems and defocus correction
            if( time > 300 ) time = 300;

            if( this.resized ) this.resize();
            this.clearCtx();

            if( this.objs.length < this.totalObjs ){
                this.populate(true);
            }

            this.ctx.globalCompositeOperation = "lighter";

            for( var i = 0 ; i < this.objs.length ; i++ ){
                if( !this.objs[i].isVisible(this.width,this.height) ){
                    this.objs.splice(i,1);
                    i--;
                } else {
                    this.objs[i].update(time, this.width, this.height);
                    this.objs[i].drawCache(this.ctx);
                }
            }

            requestAnimationFrame(this.loop.bind(this));
        }
    };



    function Vector(x,y){
        this.x = x || 0;
        this.y = y || 0;
    }
    Vector.prototype.add = function(x,y){
        this.x += x;
        this.y += y;
    };



    function Rgba(r,g,b,a){
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 1;

        this.r = Math.round(this.r+( (Math.random()*80)-40 ));
        this.g = Math.round(this.g+( (Math.random()*80)-40 ));
        this.b = Math.round(this.b+( (Math.random()*80)-40 ));
        this.a = (Math.round((this.a+( (Math.random()/2)-0.25 ))*100))/100;

        if( Math.random() > 0.4 && this.a > 0 ){ //More faded than not
            this.a = this.a / 2;
        }

        if( this.r < 0 ) this.r = 0;
        if( this.g < 0 ) this.g = 0;
        if( this.b < 0 ) this.b = 0;
        if( this.a < 0 ) this.a = 0;
    }
    Rgba.prototype = {
        constructor: Rgba,
        toString: function(){
            return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
        },
        toRgb: function(){
            return "rgba("+this.r+","+this.g+","+this.b+",1)";
        },
        transparent: function(){
            return "rgba("+this.r+","+this.g+","+this.b+",0)";
        }
    };




    function Sphere(hide,banWidth,banHeight){

        this.data = null;
        this.size = 70;
        this.blur = 1;
        this.position = null;
        this.direction = null;
        this.color = null;

        this.randomise(hide,banWidth,banHeight);

    }
    Sphere.prototype = {
        constructor: Sphere,
        update: function(time,w,h){

            this.position.add( (time*this.direction.x)/20 , (time*this.direction.y)/20 );

        },
        randomise: function(hide,banWidth,banHeight){

            this.data = null;

            this.size = Math.floor((Math.random()*80)+40);
            if( Math.random() > 0.3 && this.size > 100 ){  //Try to keep most spheres smaller
                this.size = this.size / 2;
            }

            this.blur = Math.random()*40;
            if( Math.random() > 0.5 && this.blur < 20 ){ //More blury
                this.blur = this.blur * 2;
            }
            if( this.blur < 1 ){ //Never perfect focus
                this.blur = 1;
            }

            if( hide ) { //Spawn outside view
                var x = (Math.random()*banWidth),
                    y = (Math.random()*banHeight);
                if( Math.random() > 0.8 ){
                    x = ( x < banWidth/2 )? -this.size : banWidth + this.size;
                } else {
                    y = banHeight + this.size;
                }
                this.position = new Vector( x, y );
            } else { //Spawn in view
                this.position = new Vector(
                    Math.round(Math.random()*(banWidth+200))-100 , 
                    Math.round(Math.random()*(banHeight+200))-100 
                );
            }

            this.direction = new Vector( 
                Math.round((((Math.random()*100)-50)/(this.size*4))*100)/100 , 
                Math.round((((Math.random()*100)-100)/(this.size*4))*100)/100
            );

            this.color = new Rgba(133,255,0,0.3);

        },
        draw: function(ctx,pos){
            var x = pos || this.position.x,
                y = pos || this.position.y;

            var grad = ctx.createRadialGradient( x , y , this.size-this.blur , x , y , this.size );
            grad.addColorStop(0 , this.color.toString() );
            grad.addColorStop(1 , this.color.transparent() );

            ctx.beginPath();
            ctx.arc( x , y , this.size , Math.PI*2 , false );
            ctx.fillStyle = grad;
            ctx.fill();

        },
        isVisible: function(w,h){

            if( this.position.x + this.size < -50 && this.direction.x < 0 ) return false;
            if( this.position.x - this.size > w + 50 && this.direction.x > 0 ) return false;

            if( this.position.y + this.size < -50 && this.direction.y < 0 ) return false;
            if( this.position.y - this.size > h + 50 && this.direction.y > 0 ) return false;

            return true;
        },
        cache: function(){
            var c = $("<canvas></canvas>"),
                ctx = c[0].getContext("2d");
            c[0].width = this.size*2;
            c[0].height = this.size*2;
            this.draw(ctx,this.size);
            this.data = c[0];
        },
        drawCache: function(ctx){
            if( !this.data ) this.cache();
            ctx.drawImage( this.data , this.position.x - this.size , this.position.y - this.size  );
        }
    };


    //Start canvas banner
    window.banner = new Banner(".banner");

});