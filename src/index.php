<?php require_once("asset/script/web.php"); ?>
<!DOCTYPE html>
<html class="page<?php echo ucfirst($web->pageName); ?> no-js" itemscope itemtype="http://schema.org/WebSite">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta charset="utf-8">
        <title itemprop="name"><?php echo $web->pageTitle; ?></title>
        <meta itemprop="description" name="description" content="<?php echo $web->pageDesc; ?>"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
        <link rel="canonical" href="<?php echo $web->uri; ?>"/>
        <link rel="stylesheet" href="/asset/css/style.css"/>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png"/>
        <link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192"/>
        <link rel="icon" type="image/png" href="/favicon-160x160.png" sizes="160x160"/>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"/>
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16"/>
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32"/>
        <meta name="msapplication-TileColor" content="#71e100"/>
        <meta name="msapplication-TileImage" content="/mstile-144x144.png"/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@ani07789"/>
        <meta name="twitter:title" content="<?php echo $web->pageTitle; ?>"/>
        <meta name="twitter:description" content="<?php echo $web->pageDesc; ?>"/>
        <meta name="twitter:creator" content="@ani07789"/>
        <meta name="twitter:image" content="/favicon-192x192.png"/>
        <meta property="og:title" content="<?php echo $web->pageTitle; ?>"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="<?php echo $web->uri; ?>"/>
        <meta property="og:image" content="/favicon-192x192.png"/>
        <meta property="og:description" content="<?php echo $web->pageDesc; ?>"/>
        <meta property="og:site_name" content="Dispossible"/>
        <meta itemprop="image" content="/favicon-192x192.png"/>
        <meta rel="publisher" href="https://plus.google.com/100360193959056041843"/>
        <!--[if lt IE 9]> <script src="/asset/js/poly.js"></script> <![endif]-->
    </head>
    <body>
        <p class="browsehappy">You appear to be using an <strong>outdated</strong> browser. <a href="http://browsehappy.com/">Upgrade your browser</a> to improve your web experience.</p>
        <header class="pageHeader">
            <div class="smallHeader">
                <div class="menuBtn">
                    <div class="menuLine1"></div>
                    <div class="menuLine2"></div>
                    <div class="menuLine3"></div>
                </div>
            </div>
            <nav class="pageNav closed">
                <a href="/" class="linkHome <?php echo $web->navIsActive("/"); ?>"><div class="siteLogo"></div>Dispossible</a><!--
                --><a href="/blog" class="linkBlog <?php echo $web->navIsActive("/blog"); ?>">Blog</a><!--
                --><a href="/portfolio" class="linkPortfolio <?php echo $web->navIsActive("/portfolio"); ?>">Portfolio</a><!--
                --><a href="/contact" class="linkContact <?php echo $web->navIsActive("/contact"); ?>">Contact</a>
            </nav>
        </header>
        <section class="page">
            <?php require_once($web->getPageContent()); ?>
        </section>
        <footer class="pageFooter">
            <div class="footerLinks linksL">
                <a href="/contact">Contact</a>
                <a href="/blog">Blog</a>
                <a href="/sitemap">Sitemap</a>
            </div>
            <div class="footerLinks linksC">
                <a href="/"><div class="siteLogo"></div></a>
            </div>
            <div class="footerLinks linksR">
                <a href="//twitter.com/ani07789" target="_blank">Twitter</a>
                <a href="//www.youtube.com/user/ani07789/videos" target="_blank">YouTube</a>
                <a href="//ani07789.deviantart.com/" target="_blank">DeviantArt</a>
            </div>
            <div class="pageCopy">&copy; Dispossible <?php echo date("Y"); ?></div>
        </footer>
        <script src="/asset/js/js.js"></script>
    </body>
</html>