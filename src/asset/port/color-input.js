$(function(){
    inputColor.int();
    $("input[name='color1']").on("change",function(){
        $("#color1Out").html( ".value = "+$(this).val() );
    });
    $("input[name='color2']").on("change",function(){
        $("#color2Out").html( ".value = "+$(this).val() );
    });
    $("input[name='color3']").on("change",function(){
        $("#color3Out").html( ".value = "+$(this).val() );
    });
});



//inputColor.js
window.inputColor = {
    "int": function(){
        if(jQuery!==null&&jQuery!=$){
            console.error("Please load jQuery to use inputColor.js");
            return;
        }
        $("input[type='color']").each(function(i){
            $(this).attr("type","hidden");
            $(this).wrap("<div class='inputColor' data-id='"+i+"'></div>");
            if( $(this).val() === "" ) $(this).val("#000");
            var root =  $(this).parent();
            root.append("<div class='inputColorThumb'></div>");
            root.find(".inputColorThumb").on("click",function(e){
                e.preventDefault();
                inputColor.show($(this).parent().data("id"));
            }).css({"backgroundColor":$(this).val()});
        });
        $("body")
            .append("<div class='inputColorPop'>"+
                        "<div class='inputColorPopThumb'></div>"+
                        "<div class='inputColorSliders'>"+
                            "<div class='inputColorSlider inputColorSliderH'></div>"+
                            "<div class='inputColorSlider inputColorSliderS'></div>"+
                            "<div class='inputColorSlider inputColorSliderL'></div>"+
                        "</div>"+
                        "<div class='inputColorVals'>"+
                            "<input type='text' class='inputColorVal inputColorValHex' value='#000' />"+
                            "<input type='text' class='inputColorVal inputColorValRgb' value='rgb(0,0,0)' />"+
                            "<input type='text' class='inputColorVal inputColorValHsl' value='hsl(0,0,0)' />"+
                        "</div>"+
                        "<div class='inputColorClose'></div>"+
                    "</div>")
            .on("click",function(e){
                if( $(e.target).closest('.inputColor').length === 0 && $(e.target).closest('.inputColorPop').length === 0 ) inputColor.hide();
            })
            .on("mouseup",function(){
                inputColor.dragging = false;
            })
            .on("mousemove",function(e){
                if( inputColor.dragging ){
                    if(e.stopPropagation) e.stopPropagation();
                    if(e.preventDefault) e.preventDefault();
                    var x = e.pageX - $(inputColor.drag).offset().left,
                        left = (x/$(inputColor.drag).width())*100;
                    if( left < 0 ) left = 0;
                    if( left > 100 ) left = 100;
                    if( $(inputColor.drag).parent().hasClass("inputColorSliderH") ) left = left*3.6;
                    $(inputColor.drag).next("input").val( Math.round(left) );
                    inputColor.sliders2update();
                    return false;
                }
            });
        $(".inputColorSlider").append("<div class='inputColorSliderBar gradientFix'><div class='inputColorSliderKnob'></div></div><input type='text' value='0' class='inputColorSliderTxt' />");
        $(".inputColorClose").on("click",function(){
            inputColor.hide();
        });
        $(".inputColorSliderBar")
            .on("mousedown",function(e){
                if(e.stopPropagation) e.stopPropagation();
                if(e.preventDefault) e.preventDefault();
                var x = e.pageX - $(this).offset().left,
                    left = (x/$(this).width())*100;
                inputColor.dragging = true;
                inputColor.drag = this;
                if( $(this).parent().hasClass("inputColorSliderH") ) left = left*3.6;
                $(this).next("input").val( Math.round(left) );
                inputColor.sliders2update();
                return false;
            });
        $(".inputColorSlider input").on("input change",function(e){
            if($(this).parent().hasClass("inputColorSliderH") && $(this).val()>=0 && $(this).val()<=360) inputColor.sliders2update({"notValH":true});
            if($(this).parent().hasClass("inputColorSliderS") && $(this).val()>=0 && $(this).val()<=100) inputColor.sliders2update({"notValS":true});
            if($(this).parent().hasClass("inputColorSliderL") && $(this).val()>=0 && $(this).val()<=100) inputColor.sliders2update({"notValL":true});
        });
        $(".inputColorValHex").on("input change",function(e){
            var hex = $(this).val();
            if( hex.match(/^#(([a-fA-F0-9]{3})|([a-fA-F0-9]{6}))$/) ) inputColor.update(inputColor.hex2hsl(hex),{"notValHex":true});
        });
        $(".inputColorValRgb").on("input change",function(e){
            if( $(this).val().match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/) ){
                var r = parseInt($(this).val().replace(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/,"$1")),
                    g = parseInt($(this).val().replace(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/,"$2")),
                    b = parseInt($(this).val().replace(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/,"$3"));
                if(r<=255 && g<=255 && b<=255 && r>=0 && g>=0 && b>=0) inputColor.update(inputColor.rgb2hsl({"r":r,"g":g,"b":b}),{"notValRgb":true});
            }
        });
        $(".inputColorValHsl").on("input change",function(e){
            if( $(this).val().match(/^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/) ){
                var h = parseInt($(this).val().replace(/^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/,"$1"))/360,
                    s = parseInt($(this).val().replace(/^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/,"$2"))/100,
                    l = parseInt($(this).val().replace(/^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/,"$3"))/100;
                if(h>=0 && s>=0 && l>=0 && h<=1 && s<=1 && l<=1) inputColor.update({"h":h,"s":s,"l":l},{"notValHsl":true});
            }
        });
    },
    "show": function(id){
        this.id = id;
        var thumb = $("[data-id='"+id+"']"),
            pop = $(".inputColorPop"),
            x = thumb.offset().left,
            y = thumb.offset().top + thumb.height() + 5,
            popW = pop.width() + parseInt(pop.css("paddingLeft")) + parseInt(pop.css("paddingRight")),
            bodyW = $("body").width() + parseInt($("body").css("paddingLeft")) + parseInt($("body").css("paddingRight"));
        x = ( x + popW > bodyW )?(bodyW-popW)-10:x;
        pop.css({"left":x+"px","top":y+"px","width":pop.width()+"px","display":"block"});
        this.update( this.all2hsl( thumb.find("input").val() ) );
    },
    "hide": function(){
        $(".inputColorPop").css("display","none");
    },
    "id": 0,
    "dragging": false,
    "drag": null,
    "all2hsl": function(color){
        var out = {};
        if( typeof(color) == "object" ){
            if( color.r !== null ){
                out = this.rgb2hsl(color);
            } else if( color.h !== null ){
                out = color;
            }
        } else if( typeof(color) == "string" ){
            if( color.match(/#[a-fA-F0-9]{3,6}/) ){
                out = this.hex2hsl(color);
            } else if( color.match(/rgb\(/) ){
                var rgb = { 
                    "r": Math.round(parseInt(color.replace(/^rgb\(([\d\.]+),.*$/,"$1"),10)),
                    "g": Math.round(parseInt(color.replace(/^rgb\([\d\.]+,([\d\.]+),.*$/,"$1"),10)),
                    "b": Math.round(parseInt(color.replace(/^rgb\([\d\.]+,[\d\.]+,([\d\.]+).*$/,"$1"),10))
                };
                out = this.rgb2hsl(rgb);
            } else if( color.match(/hsl\(/) ){
                out = {
                    "h": ((parseInt(color.replace(/^hsl\(([\d\.]+),.*$/,"$1"),10))/3.6)/100,
                    "s": (parseInt(color.replace(/^hsl\([\d\.]+,([\d\.]+).*$/,"$1"),10))/100,
                    "l": (parseInt(color.replace(/^hsl\([\d\.]+,[\d\.]+%,([\d\.]+).*$/,"$1"),10))/100
                };
            }
        }
        return out;
    },
    "sliders2update": function(set){
        var hsl = {
            "h": (parseInt($(".inputColorSliderH input").val())/360),
            "s": (parseInt($(".inputColorSliderS input").val())/100),
            "l": (parseInt($(".inputColorSliderL input").val())/100)
        };
        this.update(hsl,set);
    },
    "update": function(hsl,set){
        if( set == null) set = {};
        var hOnly = {"h":hsl.h,"s":1,"l":0.5},
            hs = {"h":hsl.h,"s":hsl.s,"l":0.5},
            hl = {"h":hsl.h,"s":1,"l":hsl.l};
        if(!set.notValH) $(".inputColorSliderH input").val( Math.round((hsl.h*100)*3.6) );
        if(!set.notValS) $(".inputColorSliderS input").val( Math.round(hsl.s*100) );
        if(!set.notValL) $(".inputColorSliderL input").val( Math.round(hsl.l*100) );
        $(".inputColorSliderH .inputColorSliderKnob").css({"left":(hsl.h*100)+"%","backgroundColor":this.hsl2hex(hOnly)});
        $(".inputColorSliderS .inputColorSliderKnob").css({"left":(hsl.s*100)+"%","backgroundColor":this.hsl2hex(hs)});
        $(".inputColorSliderL .inputColorSliderKnob").css({"left":(hsl.l*100)+"%","backgroundColor":this.hsl2hex(hl)});
        $(".inputColorPopThumb").css("backgroundColor",this.hsl2hex(hsl));
        $(".inputColorSliderBar").css("backgroundColor",this.hsl2hex(hOnly));
        var rgb = this.hsl2rgb(hsl);
        if(!set.notValHex) $(".inputColorValHex").val(this.hsl2hex(hsl));
        if(!set.notValRgb) $(".inputColorValRgb").val("rgb("+Math.round(rgb.r)+","+Math.round(rgb.g)+","+Math.round(rgb.b)+")");
        if(!set.notValHsl) $(".inputColorValHsl").val("hsl("+Math.round(hsl.h*360)+","+Math.round(hsl.s*100)+"%,"+Math.round(hsl.l*100)+"%)");
        this.output(hsl);
    },
    "output": function(hsl){
        var out = "",
            color = $("[data-id='"+this.id+"'] input");
        if( color.val().match(/#[a-fA-F0-9]{3,6}/) ) out = this.hsl2hex(hsl);
        if( color.val().match(/rgb\(/) ){
            var rgb = this.hsl2rgb(hsl);
            out = "rgb(" + Math.round(rgb.r) + "," + Math.round(rgb.g) + "," + Math.round(rgb.b) + ")";
        }
        if( color.val().match(/hsl\(/) ) out = "hsl("+Math.round(hsl.h*360)+","+Math.round(hsl.s*100)+"%,"+Math.round(hsl.l*100)+"%)";
        color.val(out).trigger("change");
        $("[data-id='"+this.id+"'] .inputColorThumb").css({"backgroundColor":this.hsl2hex(hsl)});
    },
    "isDark": function(hex){
        var rgb = inputColor.hex2Rgb(hex);
        if( rgb.r > 100 &&  rgb.g > 100 &&  rgb.b > 100 && (  rgb.r > 230 ||  rgb.g > 230 ||  rgb.b > 230 ) ) return false;
        return true;
    },
    "getCompliment": function(hex){
        var hsl = this.hex2hsl(hex);
        hsl.h = this.flipHue(hsl.h);
        return this.hsl2hex(hsl);
    },
    "hex2rgb": function(hex){
        h = hex.replace("#","");
        var r,g,b;
        if( h.length == 3 ){
            r = parseInt(h.substring(0,1)+h.substring(0,1),16);
            g = parseInt(h.substring(1,2)+h.substring(1,2),16);
            b = parseInt(h.substring(2,3)+h.substring(2,3),16);
        } else if( h.length == 6 ){
            r = parseInt(h.substring(0,2),16);
            g = parseInt(h.substring(2,4),16);
            b = parseInt(h.substring(4,6),16);
        }
        return {"r":r,"g":g,"b":b};
    },
    "rgb2hex": function(rgb){
        r = Math.round(rgb.r).toString(16);
        g = Math.round(rgb.g).toString(16);
        b = Math.round(rgb.b).toString(16);
        if( r.length < 2 ) r = "0"+r;
        if( g.length < 2 ) g = "0"+g;
        if( b.length < 2 ) b = "0"+b;
        if( r.split("")[0] == r.split("")[1] && g.split("")[0] == g.split("")[1] && b.split("")[0] == b.split("")[1] ) {
            r = r.split("")[0];
            g = g.split("")[0];
            b = b.split("")[0];
        }
        return "#"+r+g+b;
    },
    "rgb2hsl": function(rgb){
        var r = rgb.r/255,
            g = rgb.g/255,
            b = rgb.b/255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h,s,l = (max + min) / 2;
        if(max == min){
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h = h/6;
        }
        return {"h":h,"s":s,"l":l};
    },
    "hsl2rgb": function(hsl){
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        var r,g,b,
            h = hsl.h, s = hsl.s, l = hsl.l;
        if(s === 0){
            r = g = b = l;
        }else{
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return {"r":r*255,"g":g*255,"b":b*255};
    },
    "flipHue": function(h){
        h += 0.5;
        if( h > 1 ) h = h - 1;
        return h;
    },
    "hex2hsl": function(hex){
        return this.rgb2hsl(this.hex2rgb(hex));
    },
    "hsl2hex": function(hsl){
        return this.rgb2hex(this.hsl2rgb(hsl));
    }
};
