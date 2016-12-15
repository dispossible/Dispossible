<div class="pageTitle pageTitlePortfolio">
    <h1>Portfolio</h1>
    <h2>&lt;script src=&apos;me&apos;&gt; &lt;/script&gt;</h2>
    <?php //echo $web->svg("script"); ?>
</div>

<div class="pageWrap">
    <ul class="portfolioList">
        <?php
            $ports = $web->portfolioList();
            for( $i = 0 ; $i < sizeof($ports) ; $i++ ){
                echo "<li>".
                    "<a ".
                        "href='/portfolio/".$ports[$i]["url"]."'".
                        " class='cat".ucfirst($ports[$i]["category"])."'".
                        " data-category='".$ports[$i]["category"]."'".
                        ">".
                            $ports[$i]["title"].
                    "</a>".
                "</li>";
            }
        ?>
    </ul>
</div>