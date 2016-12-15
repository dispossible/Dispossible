<div class="pageTitle pageTitleSiteMap">
    <h1>Sitemap</h1>
    <h2>Where is everything</h2>
</div>

<div class="pageWrap">
    <ul class="siteMapList">
        <li class="lvl0"><a href="/" class="mapHome"><?php echo $web->svg("home"); ?>Home</a></li>
        <li class="lvl1"><a href="/contact" class="mapContact"><?php echo $web->svg("speech"); ?>Contact</a></li>
        <li class="lvl1"><a href="/portfolio" class="mapPort"><?php echo $web->svg("script"); ?>Portfolio</a></li>
        <?php 
            $port = $web->portfolioList();
            for( $i = 0 ; $i < sizeof($port) ; $i++ ){
                echo "<li class='lvl2'>";
                    echo "<a href='/portfolio/".$port[$i]["url"]."' class='mapPortPage'>".$port[$i]["title"]."</a>";
                echo "</li>";
            }
        ?>
        <li class="lvl1"><a href="/blog" class="mapBlog"><?php echo $web->svg("blog"); ?>Blog</a></li>
        <?php 
            $posts = $web->getBlogPosts(true);
            for( $i = 0 ; $i < sizeof($posts) ; $i++ ){
                echo "<li class='lvl2'>";
                    echo "<a href='/blog/".$posts[$i]["url"]."' class='mapBlogPage'>".$posts[$i]["postTitle"]."</a>";
                echo "</li>";
            }
        ?>
    </ul>
</div>