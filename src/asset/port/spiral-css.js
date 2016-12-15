$(function(){
  function gen(){
    var radius = parseFloat($("#radius").val(),10),
        amount = parseFloat($("#amount").val(),10),
        rots = parseFloat($("#rots").val(),10),
        expand = parseFloat($("#expand").val(),10),
        size = parseInt($("#size").val(),10),
        color = $("#color").val(),
        fade = parseFloat($("#fade").val(),10),
        blur = parseFloat($("#blur").val(),10),
        inset = ($("#inset").val()=="true")?true:false,
        out = "";
    for( var i = 0 ; i < amount ; i++ ){
        var rad = Math.floor(  (((2*Math.PI*rots)/amount)*i)*1000  )/1000,
            x = Math.cos( rad )*(radius+(i*expand)),
            y = Math.sin( rad )*(radius+(i*expand));
      out += 
        x.toFixed(3)+"px "+
        y.toFixed(3)+"px "+
        blur+((blur!==0)?"px ":" ")+
        size+((size!==0)?"px ":" ")+
        "rgba("+color+","+((fade===0)?"1":((1-(i*(1/amount)))/fade).toFixed(3))+")"+
        ((inset)?" inset":"")+
        ",\n    ";
    }
    out = out.replace(/,\n    $/,"");
    $("#out").val("box-shadow:\n    "+out+";");
    $(".btn").css({"boxShadow":out,"width":$("#btnSize").val()+"px","height":$("#btnSize").val()+"px"});
  }
  gen();
  $("input").on("change input",gen);
});