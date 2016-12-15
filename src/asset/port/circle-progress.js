function setPer(val, min, max) {
    var per = (val / (max - min)) * 100;
    var deg = 3.6 * per;
    if (deg <= 180) {
        deg += 180;
        $(".bar1 > span").css({
            "transform": "rotate(180deg)"
        });
        $(".bar2 > span").css({
            "transform": "rotate(" + deg + "deg)"
        });
    } else if (deg <= 360) {
        $(".bar1 > span").css({
            "transform": "rotate(" + deg + "deg)"
        });
        $(".bar2 > span").css({
            "transform": "rotate(0deg)"
        });
    }
    $(".progress > span").html(Math.round(per * 100) / 100 + "%");
}

$(".progress + input").on("input change", function () {
    setPer($(this).val(), $(this).attr("min"), $(this).attr("max"));
});

$(".progress").html("<div class='bar1'><span></span></div><div class='bar2'><span></span></div><span>0%</span>");
setPer($(".progress + input").val(), $(".progress + input").attr("min"), $(".progress + input").attr("max"));