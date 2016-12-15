$(function(){
    
    function tick(){
        
        var t = new Date(),
            h = t.getHours(),
            m = t.getMinutes(),
            s = t.getSeconds();
        
        h = ((h/24)*100) * 2.56;
        m = ((m/60)*100) * 2.56;
        s = ((s/60)*100) * 2.56;
        
        h = h.toString(16).replace(/\..*$/,"");
        m = m.toString(16).replace(/\..*$/,"");
        s = s.toString(16).replace(/\..*$/,"");
        
        if(h.length < 2) h = "0"+h;
        if(m.length < 2) m = "0"+m;
        if(s.length < 2) s = "0"+s;
        
        $(".clock").html("#"+h+m+s);
        $("body").css({"backgroundColor":"#"+h+m+s});
        
        requestAnimationFrame(tick);
    }
    tick();
    
});