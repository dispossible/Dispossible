<div class="pageTitle pageTitleBlogPost">
    <h1><?php echo ucfirst($web->postName); ?></h1>
    <h2><?php echo $web->pageDesc; ?></h2>
</div>

<div class="pageWrap">
    
    <?php
        $date = new WebTime( $web->postDate );
        echo "<time datetime='".$date->getHtmlTime()."' class='blogTime'>".$date->getDate()."</time>";
    ?>

    <div class="blogPostBody">
        <?php include_once($web->getBlogContent()); ?>
    </div>

    <?php if( $web->showComments && false ){ //ToDo - Fix comments?>
        <div class="postComments">
            
            <h2>Discussion</h2>

            

        </div>
    <?php } ?>
</div>