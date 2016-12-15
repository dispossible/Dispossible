;(function(root,doc){
    function System(){
        
        
        //Settings
        this.set = {
            "canvasId": "c",
            "background": {
                "h": 0,
                "s": "0%",
                "l": "0%"
            },
            "blur": 5,
            "composite": "source-over",
            "gravity": -5,
            "wind": 0.5,
            "airResist": 3
        };
        
        //Emmiters
        this.emmiters = [
            new Emmiter({
                "pos": new Vector(300,400),
                "rate": 10,
                "color": {"h":20,"s":"80%","l":"30%","a":1},
                "randColor": 20,
                "dir": 4.5,
                "randDir": 2,
                "speed": 1,
                "randSpeed": 0.5,
                "size": 25,
                "randSize": 15,
                "life": 100,
                "randLife": 40,
                "fadeIn": 10,
                "fadeOut": 100,
                "type": "circle",
                "composite": "lighter"
            }),
            new Emmiter({
                "pos": new Vector(300,400),
                "rate": 4,
                "color": {"h":20,"s":"0%","l":"70%","a":0.02},
                "randColor": 20,
                "dir": 4.5,
                "randDir": 2,
                "speed": 1.5,
                "randSpeed": 0.5,
                "size": 25,
                "randSize": 10,
                "life": 350,
                "randLife": 140,
                "fadeIn": 150,
                "fadeOut": 200,
                "type": "circle",
                "composite": "source-over"
            }),
            new Emmiter({
                "pos": new Vector(300,400),
                "rate": 1,
                "color": {"h":20,"s":"80%","l":"30%","a":0.7},
                "randColor": 20,
                "dir": 4.5,
                "randDir": 2,
                "speed": 2,
                "randSpeed": 0.5,
                "size": 1,
                "randSize": 1,
                "life": 150,
                "randLife": 40,
                "fadeIn": 10,
                "fadeOut": 100,
                "type": "line",
                "composite": "lighter"
            })
        ];
        
        //Fields
        this.fields = [];
        
        //Solids
        this.solids = [
            new Solid({
                "pos": new Vector(0,0),
                "type": "square",
                "visible": false,
                "width": 1000,
                "height": 20,
                "friction": 2,
                "bounce": 8
            })
        ];
        
        //custom
        document.addEventListener("mousemove",function(e){
            that.emmiters[0].position.x = e.pageX;
            that.emmiters[0].position.y = e.pageY;
            that.emmiters[1].position.x = e.pageX;
            that.emmiters[1].position.y = e.pageY;
            that.emmiters[2].position.x = e.pageX;
            that.emmiters[2].position.y = e.pageY;
        });
        
        
        
        
        //Code
        
        var that = this;
        
        this.frame = 0;
        this.frameTime = new Date().getTime();
        this.delta = 0;
        
        this.size = {
            "w": 0,
            "h": 0
        };
        
        this.canvas = doc.getElementById(this.set.canvasId);
        this.ctx = this.canvas.getContext("2d");
        
        root.addEventListener("resize",function(e){
            that.resize();
        });
        this.resize();
        
        this.particles = [];
        
        this.loop();
    }
    System.prototype = {
        constructor: System,
        
        loop: function(){
            
            var that = this,
                    i = 0;
            
            var t = new Date().getTime();
            this.delta = t - this.frameTime;
            this.frameTime = t;
            //console.log(this.delta);
            
            //clear
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            if( this.ctx.globalCompositeOperation != "source-over" ){
                this.ctx.globalCompositeOperation = "source-over";
            }
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = "hsla("+
                this.set.background.h+","+
                this.set.background.s+","+
                this.set.background.l+","+
                (1/this.set.blur)+")";
            this.ctx.fillRect(0,0,this.size.w,this.size.h);
            
            for( i in this.particles ){
                this.particles[i].velocity.add(this.particles[i].accel,this.delta);
                this.particles[i].position.add(this.particles[i].velocity,this.delta);
            }
            
            //emmit new particles
            for( i in this.emmiters ){
                var newParts = this.emmiters[i].update(this.frame);
                this.particles = this.particles.concat( newParts );
            }
            
            for( i in this.particles ){
                //gravity
                this.particles[i].accel = new Vector(this.set.wind/30,this.set.gravity/30);
                //air resistance
                var resistX = (this.particles[i].velocity.x*-1)*(this.set.airResist/80),
                        resistY = (this.particles[i].velocity.y*-1)*(this.set.airResist/80);
                this.particles[i].accel.add(new Vector(resistX,resistY));
            }
            
            //check for particle/field intreraction
            for( i in this.fields ){
                this.fields[i].draw(this.ctx);
                for( var x in this.particles ){
                    this.fields[i].affect(this.particles[x],this.delta,this.ctx);
                }
            }
            
            //check for solids
            for( i in this.solids ){
                this.solids[i].draw(this.ctx);
                for( var y in this.particles ){
                    this.solids[i].affect(this.particles[y],this.delta);
                }
            }
            
            //render particles
            var nextParticles = [];
            for( i in this.particles ){
                if( this.particles[i].update(this.ctx) ){
                    nextParticles.push(this.particles[i]);
                }
            }
            this.particles = nextParticles;
            
            this.frame++;
            requestAnimationFrame(this.loop.bind(this));
        },
        
        resize: function(){
            this.size.w = root.innerWidth;
            this.size.h = root.innerHeight;
            this.canvas.width = this.size.w;
            this.canvas.height = this.size.h;
        },
        
    };
    
    
    
    
    
    
    
    function Particle(args){
        
        this.position = args.pos;
        this.direction = args.dir;
        this.color = args.color;
        this.size = args.size;
        this.speed = args.speed;
        this.life = args.life;
        this.fadeIn = args.fadeIn;
        this.fadeOut = args.fadeOut;
        this.type = args.type;
        this.composite = args.composite;
        this.lastPos = {x:args.pos.x,y:args.pos.y};
        
        this.accel = new Vector(0,0);
        this.velocity = new Vector(
            Math.cos(this.direction)*this.speed,
            Math.sin(this.direction)*this.speed
        );
        
        this.canvas = doc.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.padding = 5;
        this.age = 0;
        
        this.draw();
        
    }
    Particle.prototype = {
        constructor: Particle,
        
        draw: function(){
            this.canvas.width = this.size+(this.padding*2);
            this.canvas.height = this.size+(this.padding*2);
            this.ctx.fillStyle = "hsla("+
                this.color.h+","+
                this.color.s+","+
                this.color.l+","+
                this.color.a+")";
            
            if( this.type == "circle" ){
                this.ctx.beginPath();
                this.ctx.arc(
                    this.canvas.width/2,
                    this.canvas.height/2,
                    this.size/2,
                    0,
                    2*Math.PI);
                this.ctx.fill();
            } else
            if( this.type == "square" ){
                this.ctx.fillRect(this.padding,this.padding,this.size,this.size);
            }
            
        },
        
        update: function(ctx){
            
            this.direction = Math.atan2(this.velocity.y,this.velocity.x);
            
            if( this.age < this.fadeIn ){
                ctx.globalAlpha = 1-( ( this.fadeIn - this.age ) / this.fadeIn );
            } else
            if( this.age > this.life-this.fadeOut ){
                ctx.globalAlpha = 1-( (this.age - (this.life-this.fadeOut)) / this.fadeOut );
            } else 
            if( ctx.globalAlpha != 1 ){
                ctx.globalAlpha = 1;
            }
            
            if( ctx.globalCompositeOperation != this.composite ){
                ctx.globalCompositeOperation = this.composite;
            }
            
            if( this.type == "line" ){
                ctx.beginPath();
                ctx.moveTo(this.lastPos.x,this.lastPos.y);
                ctx.lineTo(this.position.x,this.position.y);
                ctx.strokeStyle = "hsla("+
                    this.color.h+","+
                    this.color.s+","+
                    this.color.l+","+
                    this.color.a+")";
                ctx.lineWidth = this.size;
                ctx.stroke();
                this.lastPos = {x:this.position.x,y:this.position.y};
            } else {
                ctx.translate(this.position.x,this.position.y);
                ctx.rotate(this.direction);
                ctx.drawImage(
                    this.canvas,
                    -((this.size/2)+this.padding),
                    -((this.size/2)+this.padding),
                    this.size+(this.padding*2),
                    this.size+(this.padding*2));
                ctx.rotate(-this.direction);
                ctx.translate(-this.position.x,-this.position.y);
            }
            this.age++;
            if( this.age > this.life ) return false;
            return true;
        },
        
    };
    
    
    
    
    
    
    function Emmiter(args){
        
        this.position = args.pos || new Vector(100,100);
        this.rate = args.rate || 0;
        this.rate = this.rate/10;
        
        this.color = args.color || {"h":0,"s":"0%","l":"50%","a":"1"};
        this.randColor = args.randColor || 0;
        
        this.direction = args.dir || 0;
        this.randDir = args.randDir || 0;
        
        this.speed = args.speed || 0;
        this.randSpeed = args.randSpeed || 0;
        
        this.size = args.size || 1;
        this.randSize = args.randSize || 0;
        
        this.life = args.life || 500;
        this.randLife = args.randLife || 0;
        
        this.fadeIn = args.fadeIn;
        this.fadeOut = args.fadeOut;
        
        this.type = args.type || "circle";
        
        this.composite = args.composite || "source-over";
        
    }
    Emmiter.prototype = {
        constructor: Emmiter,
        
        update: function(frame){
            
            var parts = [];
            
            var rate = this.rate;
            if( rate < 1 && rate > 0 ){
                if( frame % (1/rate) === 0 && rate !== 0 ){
                    rate = 1;
                } else {
                    rate = 0;
                }
            }
            
            for(var i = 0 ; i < rate ; i++){
                
                var newColH = this.color.h;
                if(this.randColor > 0){
                    newColH += ((Math.random()*this.randColor)-(this.randColor/2));
                    if( newColH > 360 ) newColH -= 360;
                    if( newColH < 0 ) newColH += 360;
                }
                
                parts.push( new Particle({
                    "pos": new Vector(this.position.x,this.position.y),
                    "dir": this.direction + ((Math.random()*this.randDir)-(this.randDir/2)),
                    "color": {"h":newColH,"s":this.color.s,"l":this.color.l,"a":this.color.a},
                    "size": this.size + ((Math.random()*this.randSize)-(this.randSize/2)),
                    "speed": this.speed + ((Math.random()*this.randSpeed)-(this.randSpeed/2)),
                    "life": this.life + ((Math.random()*this.randLife)-(this.randLife/2)),
                    "fadeIn": this.fadeIn,
                    "fadeOut": this.fadeOut,
                    "type": this.type,
                    "composite": this.composite
                }));
            }
            
            return parts;
        },
        
    };
    
    
    
    
    
    
    
    function Field(args){
        
        this.position = args.pos || new Vector(100,100);
        this.range = args.range || 0;
        this.power = args.power || 0;
        this.visible = args.visible || false;
        
    }
    Field.prototype = {
        constructor: Field,
        
        affect: function(particle,delta,ctx){
            var x = Math.pow(particle.position.x - this.position.x,2),
                    y = Math.pow(particle.position.y - this.position.y,2),
                    dist = Math.sqrt(x+y);
         
            if( dist < this.range ){
                
                var power = this.power*( (this.range-dist)/this.range ),
                        perfectDir = Math.atan2(
                            this.position.y - particle.position.y,
                            this.position.x - particle.position.x);
                
                var accelX = (((this.position.x-particle.position.x)*power)/3000),
                        accelY = (((this.position.y-particle.position.y)*power)/3000);
                particle.accel.add( new Vector(accelX,accelY) );
                
                if( this.visible ){
                    ctx.strokeStyle = "rgba(255,0,0,0.1)";
                    ctx.beginPath();
                    ctx.moveTo(this.position.x,this.position.y);
                    ctx.lineTo(particle.position.x,particle.position.y);
                    ctx.stroke();
                }
            }
        },
        
        draw: function(ctx){
            if( !this.visible ) return;
            ctx.strokeStyle = "rgba(255,0,0,0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.position.x,this.position.y,this.range,0,2*Math.PI);
            ctx.stroke();
        }
    };
    
    
    
    
    
    function Solid(args){
        this.position = args.pos || new Vector(100,100);
        this.type = args.type || "square";
        this.visible = args.visible || false;
        this.width = args.width || 100;
        this.height = args.height || 100;
        this.friction = args.friction || 0;
        this.bounce = args.bounce || 0;
        
    }
    Solid.prototype = {
        constructor: Solid,
        
        affect: function(particle,delta){
            if(this.type == "square"){
                
                //has hit
                if( particle.position.x > this.position.x && 
                        particle.position.x < this.width+this.position.x &&
                        particle.position.y > this.position.y &&
                        particle.position.y < this.height + this.position.y
                    ){
                    var fric = 0;
                    
                    //left quad
                    if( particle.velocity.x > 0 &&
                            particle.position.x - this.position.x < particle.position.y - this.position.y &&
                            particle.position.x - this.position.x < (this.position.y + this.height) - particle.position.y
                        ){
                            particle.velocity.flipX(this.bounce);
                            particle.accel.flipX(this.bounce);
                            if( particle.velocity.y < 0 ){
                                fric = particle.velocity.y + this.friction;
                                if( fric > 0 ) fric = 0;
                                particle.velocity.y = fric;
                            }
                            else if( particle.velocity.y > 0 ){
                                fric = particle.velocity.y - this.friction;
                                if( fric < 0 ) fric = 0;
                                particle.velocity.y = fric;
                            }
                            particle.position.x = this.position.x;
                    }
                    
                    //right quad
                    else if( particle.velocity.x < 0 &&
                            (this.position.x + this.width) - particle.position.x < particle.position.y - this.position.y &&
                            (this.position.x + this.width) - particle.position.x < (this.position.y + this.height) - particle.position.y
                        ){
                            particle.velocity.flipX(this.bounce);
                            particle.accel.flipX(this.bounce);
                            if( particle.velocity.y < 0 ){
                                fric = particle.velocity.y + this.friction;
                                if( fric > 0 ) fric = 0;
                                particle.velocity.y = fric;
                            }
                            else if( particle.velocity.y > 0 ){
                                fric = particle.velocity.y - this.friction;
                                if( fric < 0 ) fric = 0;
                                particle.velocity.y = fric;
                            }
                            particle.position.x = this.position.x + this.width;
                    }
                    
                    //top quad
                    else if( particle.velocity.y > 0 &&
                            particle.position.y - this.position.y < particle.position.x - this.position.x &&
                            particle.position.y - this.position.y < (this.position.x + this.width) - particle.position.x
                        ){
                            particle.velocity.flipY(this.bounce);
                            particle.accel.flipY(this.bounce);
                            if( particle.velocity.x < 0 ){
                                fric = particle.velocity.x + this.friction;
                                if( fric > 0 ) fric = 0;
                                particle.velocity.x = fric;
                            }
                            else if( particle.velocity.x > 0 ){
                                fric = particle.velocity.x - this.friction;
                                if( fric < 0 ) fric = 0;
                                particle.velocity.x = fric;
                            }
                            particle.position.y = this.position.y;
                    }
                    
                    //bottom quad
                    else if( particle.velocity.y < 0 &&
                            (this.position.y + this.height) - particle.position.y < particle.position.x - this.position.x &&
                            (this.position.y + this.height) - particle.position.y < (this.position.x + this.width) - particle.position.x
                        ){
                            particle.velocity.flipY(this.bounce);
                            particle.accel.flipY(this.bounce);
                            if( particle.velocity.x < 0 ){
                                fric = particle.velocity.x + this.friction;
                                if( fric > 0 ) fric = 0;
                                particle.velocity.x = fric;
                            }
                            else if( particle.velocity.x > 0 ){
                                fric = particle.velocity.x - this.friction;
                                if( fric < 0 ) fric = 0;
                                particle.velocity.x = fric;
                            }
                            particle.position.y = this.position.y + this.height;
                    }
                    
                    
                }
                
            } else 
            if( this.type == "circle" ){
                var x = Math.pow(particle.position.x - this.position.x,2),
                        y = Math.pow(particle.position.y - this.position.y,2),
                        dist = Math.sqrt(x+y);
         
                if( dist < this.width ){
                    //Has hit
                    var perfectDir = Math.atan2(
                            this.position.y - particle.position.y,
                            this.position.x - particle.position.x);
                    
                    if( particle.direction - perfectDir < Math.PI/2 ||
                            (particle.direction - (Math.PI*2)) - perfectDir < Math.PI/2 ||
                            (particle.direction + (Math.PI*2)) - perfectDir < Math.PI/2
                            ){
                        
                        var speed = Math.sqrt(Math.pow(particle.velocity.x,2) + Math.pow(particle.velocity.y,2));
                        
                        particle.velocity = new Vector( 
                            (-(this.position.x - particle.position.x)*(this.bounce/100))*(speed/3),
                            (-(this.position.y - particle.position.y)*(this.bounce/100))*(speed/3)
                        );
                        
                        particle.position.x = this.position.x + (-Math.cos(perfectDir)*this.width);
                        particle.position.y = this.position.y + (-Math.sin(perfectDir)*this.width);
                        
                    }
                    
                    
                }
            }
        },
        
        draw: function(ctx){
            if( this.visible ){
                ctx.strokeStyle = "rgba(0,255,0,0.1)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                if( this.type == "square" ){
                    ctx.rect(this.position.x,this.position.y,this.width,this.height);
                } else
                if( this.type == "circle" ){
                    ctx.arc(this.position.x,this.position.y,this.width,0,Math.PI*2);
                }
                ctx.stroke();
            }
        }
    };
    
    
    
    
    function Vector(x,y){
        this.x = x;
        this.y = y;
    }
    Vector.prototype = {
        constructor: Vector,
        add: function(vec,delta){
            if( typeof delta != "number" ) delta = 1;
            else delta = delta/40;
            this.x += vec.x*delta;
            this.y += vec.y*delta;
        },
        flipX: function(decay){
            if( typeof decay != "number" ) decay = 10;
            this.x = (this.x*-1)*(decay/10);
        },
        flipY: function(decay){
            if( typeof decay != "number" ) decay = 10;
            this.y = (this.y*-1)*(decay/10);
        }
    };
    
    
    
    
    
    new System();
    
})(window,document);