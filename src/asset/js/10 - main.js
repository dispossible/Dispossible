if( self==top ) console.log("Dispossible - I hope there are no errors here, but if you are having problems then please contact me mail@dispossible.com and let me know.");

function setDefault(setting,def){
    if( typeof setting === typeof def ) return setting;
    return def;
}

function padInt(int,pad){
    pad = setDefault(pad,2);
    return new Array((pad-(int+"").length)+1).join("0")+int;
}


// requestAnimationFrame fallback
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


//get element size
$.fn.extend({
    cssWidth: function(){
        var pl = parseInt($(this).css("paddingLeft"),10),
            pr = parseInt($(this).css("paddingRight"),10),
            bl = parseInt($(this).css("borderLeft"),10),
            br = parseInt($(this).css("borderRight"),10),
            cssWidth = $(this).width();
        if( !isNaN(pl) ) cssWidth += pl;
        if( !isNaN(pr) ) cssWidth += pr;
        if( !isNaN(bl) ) cssWidth += bl;
        if( !isNaN(br) ) cssWidth += br;
        return cssWidth;
    },
    cssHeight: function(){
        var pb = parseInt($(this).css("paddingBottom"),10),
            pt = parseInt($(this).css("paddingTop"),10),
            bb = parseInt($(this).css("borderBottom"),10),
            bt = parseInt($(this).css("borderTop"),10),
            cssHeight = $(this).height();
        if( !isNaN(pb) ) cssHeight += pb;
        if( !isNaN(pt) ) cssHeight += pt;
        if( !isNaN(bb) ) cssHeight += bb;
        if( !isNaN(bt) ) cssHeight += bt;
        return cssHeight;
    }
});