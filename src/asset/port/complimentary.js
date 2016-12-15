setInterval(function(){
    var h = (("#"+Math.floor(Math.random()*16777215).toString(16))+"0000").substring(0,7);
    var c = (isDark(h))?"#fff":"#000";
    var h2 = ("#"+getCompliment(h)+"0000").substring(0,7);
    var c2 = (isDark(h2))?"#fff":"#000";
    $(".a").css({"background":h,"transition":"800ms","color":c}).html(h);
    $(".b").css({"background":h2,"transition":"800ms","color":c2}).html(h2);
},1000);

function isDark(h){
    h = hex2Rgb(h);
    if( h[0] > 100 && h[1] > 100 && h[2] > 100 && ( h[0] > 230 || h[1] > 230 || h[2] > 230 ) ){
        return false;
    }
    return true;
}

function getCompliment(h){
    var rgb = hex2Rgb(h);
    var hsl = rgb2Hsl(rgb[0],rgb[1],rgb[2]);
    hsl[0] = hslCompliment(hsl[0]);
    var rgb2 = hsl2Rgb(hsl[0],hsl[1],hsl[2]);
    return rgb2Hex(rgb2[0],rgb2[1],rgb2[2]);
}

function hex2Rgb(h){
    h = h.replace("#","");
    var r,
        g,
        b;
    if( h.length == 3 ){
        r = parseInt(h.substring(0,1)+h.substring(0,1),16);
        g = parseInt(h.substring(1,2)+h.substring(1,2),16);
        b = parseInt(h.substring(2,3)+h.substring(2,3),16);
    } else
    if( h.length == 6 ){
        r = parseInt(h.substring(0,2),16);
        g = parseInt(h.substring(2,4),16);
        b = parseInt(h.substring(4,6),16);
    }
    return [r,g,b];
}

function rgb2Hex(r,g,b){
    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);
    return r+g+b;
}

function rgb2Hsl(r,g,b){
    r = r/255;
    g = g/255;
    b = b/255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;
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
    return [h,s,l];
}

function hsl2Rgb(h,s,l){
    var r, 
        g, 
        b;
    if(s === 0){
        r = g = b = l;
    }else{
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
            p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [r * 255, g * 255, b * 255];
}

function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

function hslCompliment(h){
    h = h + 0.5;
    if( h > 1 ){
        h = h - 1;
    }
    return h;
}
