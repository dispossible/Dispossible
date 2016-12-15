<div class="pageTitle pageTitleContact">
    <h1>Contact</h1>
    <h2>Getting in touch</h2>
</div>

<?php 
    $status = htmlentities($_GET["s"]);

    $msg = "&nbsp;";
    if( $status == "e" ){
        $msg = "Please recheck your information";
    } else if ( $status == "c" ){
        $msg = "Message sent";
    }
    
    $val1 = rand(1,50);
    $val2 = rand(1,50);
    $val3 = base64_encode( $val1 + $val2 );
?>

<div class="pageWrap">
    <h2 class="pageHeading">Send me an email</h2>

    <form action="/asset/script/contact.php" method="post" id="contact" class="form">
        <div class="formTop">
            <label for="name" >Full Name</label>
            <div class="inputHold"><input type="text" name="name" placeholder="John Smith" /></div>
        </div><!--
        --><div class="formTop">
            <label for="name" >Email Address</label>
            <div class="inputHold"><input type="email" name="email" placeholder="john@smith.co.uk" /></div>
        </div>
        <div>
            <label for="msg">Message</label>
            <div class="inputHold"><textarea name="msg"></textarea></div>
        </div>
        <input type="hidden" name="val1" value="<?php echo $val1; ?>" />
        <input type="hidden" name="val2" value="<?php echo $val2; ?>" />
        <input type="hidden" name="val3" value="<?php echo $val3; ?>" />
        <input class="cap1 hidden" type="text" name="message" placeholder="Please leave this empty" />
        <label class="cap2" for="val4" >Please complete this problem to prove you are not a computer; <span class="sum"><?php echo $val1 . " + " . $val2 ?></span></label>
        <input class="cap2" type="number" name="val4" value="0" />
        <div class="validationMsg"><?php echo $msg; ?></div>
        <div class="formSub">
            <button class="btn sender">Send</button>
        </div>
    </form>


    <h2 class="pageHeading">Find me online</h2>

    <div class="onlineBlock">
        <a href="//twitter.com/ani07789" target="_blank">
            <?php echo $web->svg("contact-twitter"); ?>
            <h3>Twitter</h3>
        </a>
    </div><!--
    --><div class="onlineBlock">
        <a href="//ani07789.deviantart.com/" target="_blank">
            <?php echo $web->svg("contact-deviantart"); ?>
            <h3>DeviantArt</h3>
        </a>
    </div><!--
    --><div class="onlineBlock">
        <a href="//www.youtube.com/user/ani07789/videos" target="_blank">
            <?php echo $web->svg("contact-youtube"); ?>
            <h3>YouTube</h3>
        </a>
    </div>
</div>
