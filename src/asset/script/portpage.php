<div class="pageTitle pageTitlePortPage">
    <h1><?php echo ucfirst($web->portName); ?></h1>
    <h2><?php echo $web->pageDesc; ?></h2>
</div>

<div class="pageWrap">

    <?php $date = new WebTime( $web->portDate ); ?>
    <div class="postHeader">
        <div class="portCat"><span>Category</span><?php echo $web->portCat; ?></div>
        <time datetime="<?php echo $date->getHtmlTime(); ?>"><?php echo $date->getDate(); ?></time>
    </div>
    

    <div class="portBody portBody<?php echo $web->portCat; ?>">
        <?php if( $web->portCat == "JavaScript" || $web->portCat == "CSS" ){ ?>
            <iframe src="/<?php echo $web->getPortContent(); ?>"></iframe>
        <?php } else {
            include_once("asset/port/".$web->portUri.".php");
        } ?>
    </div>



</div>