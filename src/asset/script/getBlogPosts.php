<?php 
    if( $web === null ) require_once("../../asset/script/web.php");

    $posts = $web->getBlogPosts(false);

    for( $i = 0; $i < sizeof($posts) ; $i++ ){

        $date = new WebTime( $posts[$i]["date"] );

        echo "<a class='blogShortThumb' href='/blog/".$posts[$i]["url"]."'>";
            echo "<div class='blogShortTitle'>";
                echo "<h2>".$posts[$i]["postTitle"]."</h2>";
                echo "<time datetime='".$date->getHtmlTime()."'>".$date->getDate()."</time>";
            echo "</div>";
            echo "<div class='blogShortDesc'>";
                echo "<p>".$posts[$i]["desc"]."</p>";
                echo "<p class='blogThumbLink'>Read full post...</p>";
            echo "</div>";
        echo "</a>";

    }
?>