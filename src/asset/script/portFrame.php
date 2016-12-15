<?php 
    require_once("web.php");
    $uri = htmlentities(trim($_GET["uri"]));
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $uri . " - " . $web->siteName; ?></title>
        <meta name="robots" content="noindex, nofollow">
        <style><?php
            $styleUri = "../port/".$uri.".css";
            if( file_exists( $styleUri ) ) require_once( $styleUri );
        ?></style>
    </head>
    <body>
        <?php 
            $bodyUri = "../port/".$uri.".html";
            if( file_exists( $bodyUri ) ) require_once( $bodyUri );
        ?>
        <script src="/asset/js/js.js"></script>
        <script><?php 
            $scriptUri = "../port/".$uri.".js";
            if( file_exists( $scriptUri ) ) require_once( $scriptUri );
        ?></script>
    </body>
</html>