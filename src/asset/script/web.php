<?php
    class Web {

        public $siteName = "Dispossible";
        private $DBusername = "animated_blogger";
        private $DBpassword = "rose7673";
        private $DBname = "animated_blog";
        private $blogPostPerPage = 20;
        

        public $uri = "/";
        public $pageName = "";
        public $pageTitle = "";
        public $pageDesc = "";

        public $postName = "";
        public $postUri = "";
        private $isBlogPost = false;
        public $blogPg = 0;
        public $showComments = true;
        public $postDate = "";

        private $isPortPage = false;
        public $portName = "";
        public $portUri = "";
        public $portCat = "";
        public $portDate = "";
        
        
        public function __construct(){
            
            //Page parameters
            $page = htmlentities(trim($_GET['pg']));
            $post = htmlentities(trim($_GET['pst']));
            $port = htmlentities(trim($_GET['port']));
            $blogPg = htmlentities(trim($_GET['p']));
            
            //Set URI and page Name
            if( $page === "" || $page == "home" ){
                $this->pageName = "home";
            } else {
                $this->uri = "/" . $page;
                $this->pageName = $page;
                if( $post !== "" ){
                    $this->uri .= "/". $post;
                    $this->pageName = "blogpost";
                    $this->postName = $post;
                    $this->isBlogPost = true;
                }
                if( $port !== "" ){
                    $this->uri .= "/". $port;
                    $this->pageName = "portpage";
                    $this->portName = $port;
                    $this->isPortPage = true;
                }
            }

            //Set blog page variables
            if( intval($blogPg,10) > 0 ){
                $this->blogPg = intval($blogPg,10);
            }
            
            //Set up page
            $this->setMetas($page, $post, $port);
            
        }


        
        //Makes this a 404 page
        private function set404(){
            if( preg_match( "/\.php/" , $_SERVER['REQUEST_URI']) ) return;
            header("HTTP/1.1 404 Not Found");
            $this->pageName = "404";
        }
        


        //Returns a new connection to the database
        public function getConnection(){
            $con = new mysqli('localhost',$this->DBusername,$this->DBpassword,$this->DBname);
            if ($con->connect_error) {
                die("Connection failed: " . $con->connect_error);
            }
            return $con;
        }
        


        //Sets up all variables and metas for the current request
        private function setMetas($page,$post,$port){
            $is404 = false;
            $con = $this->getConnection();
            if( ( !$this->isBlogPost && !$this->isPortPage && !file_exists("asset/page/". $this->pageName .".php") ) || $page == "404" ){
                $is404 = true;
            } else if( $this->isBlogPost ){
                $postMetas = $con->query("SELECT * FROM posts WHERE url = '" . $post . "';");
                if( $postMetas->num_rows > 0 ){
                    while($meta = $postMetas->fetch_assoc()) {
                        $this->pageTitle = $meta['postTitle'] . " - " . $this->siteName;
                        $this->pageDesc = $meta['desc'];
                        $this->postName = $meta['postTitle'];
                        $this->postDate = $meta['date'];
                        $this->postUri = $post;
                        $this->showComments = ( intval($meta['comments']) > 0 )? true : false; 
                    }
                } else {
                    $is404 = true;
                }
            } else if( $this->isPortPage ){
                $portMetas = $con->query( "SELECT * FROM portfolio WHERE url ='".$port."';" );
                if( $portMetas->num_rows > 0 ){
                    while($meta = $portMetas->fetch_assoc()) {
                        $this->pageTitle = $meta['title'] . " - " . $this->siteName;
                        $this->pageDesc = $meta['desc'];
                        $this->portName = $meta['title'];
                        $this->portUri = $port;
                        $this->portCat = $meta['category'];
                        $this->portDate = $meta['date'];
                    }
                } else {
                    $is404 = true;
                }
            }
            if( (!$this->isBlogPost && !$this->isPortPage) || $is404 ){
                $uri = $this->uri;
                if( $is404 ){
                    $this->set404();
                    $uri = "/404";
                }
                $pageMetas = $con->query("SELECT * FROM meta WHERE uri = '" . $uri . "';");
                if( $pageMetas->num_rows > 0 ){
                    while($meta = $pageMetas->fetch_assoc()) {
                        $this->pageTitle = $meta['title'] . ( ( $this->uri == "/" )? "" : " - " . $this->siteName );
                        $this->pageDesc = $meta['description'];
                    }
                } else {
                    $this->pageTitle = ucfirst($this->pageName) . " - " . $this->siteName;
                }
            }
            $con->close();
        }
        


        //Returns the uri for the main page content
        public function getPageContent(){
            if( $this->isBlogPost ){
                return "asset/script/blogpost.php";
            }
            if( $this->isPortPage ){
                return "asset/script/portpage.php";
            }
            return "asset/page/".$this->pageName.".php";
        }


        //Return the uri for blog post
        public function getBlogContent(){
            return "asset/blog/".$this->postUri.".php";
        }


        //Return portfolio uri
        public function getPortContent(){
            return "asset/script/portFrame.php?uri=".$this->portUri;
        }
        


        //Test for active uri
        public function navIsActive($testUri){
            return ( $testUri == $this->uri )? "active" : "";
        }


        //Create svg image
        public function svg( $svgName , $class = "" ){
            $filePath = "asset/svg/".$svgName.".svg";
            $svgFile = fopen($filePath, "r") or die("Unable to open file!");
            $svg = fread($svgFile,filesize($filePath));
            fclose($svgFile);
            if( strlen($class) > 0 ) $class .= " ";
            $svg = str_replace("<svg","<svg class='icon ".$class.$svgName."'",$svg);
            return $svg;
        }



        //Get a page of blog posts
        public function getBlogPosts($all = false){

            $offset = $this->blogPg * $this->blogPostPerPage;
            $return = [];

            $con = $this->getConnection();

            $sql = "SELECT * FROM `posts` WHERE `show` = 1 ORDER BY `date` DESC";
            if( $all === false ) $sql .= " LIMIT ".$offset.",".$this->blogPostPerPage;
            $sql .= ";";

            $posts = $con->query($sql);

            if( $posts->num_rows > 0 ){
                while( $post = $posts->fetch_assoc() ){
                    array_push($return, $post);
                }
            } else {
                array_push($return, ["postTitle"=>"No Results","date"=>"1970-01-01 00:00:00"]);
            }

            $con->close();

            return $return;
        }



        //Array of portfolio snipits
        public function portfolioList(){

            $return = [];

            $con = $this->getConnection();

            $sql = "SELECT * FROM `portfolio` WHERE `show` = 1 ORDER BY `date` DESC;";

            $portfolio = $con->query($sql);

            if( $portfolio->num_rows > 0 ){

                while( $port = $portfolio->fetch_assoc() ){
                    array_push($return, $port);
                }

            } else {
                array_push($return, ["title"=>"Not Found"]);
            }
            
            $con->close();

            return $return;
        }





        //Get most recent Blog post
        public function getLatestBlog(){

            $return = [];

            $con = $this->getConnection();

            $sql = "SELECT * FROM `posts` WHERE `show` = 1 ORDER BY `date` DESC LIMIT 1;";
            
            $posts = $con->query($sql);

            if( $posts->num_rows > 0 ){

                while( $post = $posts->fetch_assoc() ){
                    $return = $post;
                }

            } else {
                $return = ["title"=>"Not Found"];
            }
            
            $con->close();

            return $return;

        }


        //Get most recent Portfolio post
        public function getLatestPort(){

            $return = [];

            $con = $this->getConnection();

            $sql = "SELECT * FROM `portfolio` WHERE `show` = 1 ORDER BY `date` DESC LIMIT 1;";
            
            $portfolio = $con->query($sql);

            if( $portfolio->num_rows > 0 ){

                while( $port = $portfolio->fetch_assoc() ){
                    $return = $port;
                }

            } else {
                $return = ["title"=>"Not Found"];
            }
            
            $con->close();

            return $return;

        }


    }


    //Time and Date formatting helper
    class WebTime{

        private $time = null;

        public function __construct($s){
            $this->time = date_create_from_format("Y-m-d H:i:s", $s);
        }

        public function getHtmlTime(){
            return date_format($this->time, "Y-m-d\TH:i:sP");
        }

        public function getDate(){
            return date_format($this->time, "jS \of F, Y");
        }

    }
    
    
    $web = new Web();
    
?>