$(function(){

    var blogPage = 0,
        loadBtn = $("#blogMoreBtn"),
        hold = $(".blogThumbs");

    loadBtn.on("click",loadPosts);

    function loadPosts(){

        loadBtn.addClass("loading");

        blogPage++;

        $.ajax({
            url: "/asset/script/getBlogPosts.php",
            data: "p="+blogPage,
            method: "GET",
            success: function(d){

                var changeBtn = false;
                if( d.match(/<h2>No Results<\/h2>/) ){
                    changeBtn = true;
                    d = "";
                }
                var height = hold.cssHeight();
                hold.append(d).height("auto");
                var newHeight = hold.cssHeight();
                hold.css("height",height+"px");

                if( changeBtn ){
                    loadBtn.html("All posts loaded").off("click").removeClass("loading");
                    hold.height("auto");
                } else {
                    TweenMax.to(hold,1,{css:{"height":newHeight+"px"},onComplete:function(){
                        loadBtn.removeClass("loading");
                        hold.height("auto");
                    }});
                }

            },
            error: function(a,b,c){
                console.error(b,c);
            },
            timeout: 10000
        });

    }

});