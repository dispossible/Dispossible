<?php
	$name = htmlentities(trim($_POST["name"]));
	$email = htmlentities(trim($_POST["email"]));
	$msg = htmlentities(trim($_POST["msg"]));
	$message = htmlentities(trim($_POST["message"]));
	$val3 = htmlentities(trim($_POST["val3"]));
	$val4 = htmlentities(trim($_POST["val4"]));
	$status = "error";
	$errorString = "[]";
	$error = array();
	
	if( !preg_match("/\w+/",$name) ){
		array_push($error,"full name");
	}
	if( !preg_match("/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-\.]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/",$email) ){
		array_push($error,"email address");
	}
	if( $msg == "" ){
		array_push($error,"message");
	}
	if( $message != "" ){
		array_push($error,"blank input");
	}
	if( $val3 == null || base64_decode( $val3 ) != $val4 ){
		array_push($error,"maths");
	}
	
	if( count($error) < 1 ){
		
		$to = "mail@dispossible.com";
		
		$headers  = "MIME-Version: 1.0\r\n";
		$headers .= "Content-type: text/html; charset=utf-8\r\n";
		$headers .= 'To: '. $to . "\r\n";
		$headers .= 'From: dispossible.com Contact Form <' . $email . ">\r\n";
		
		$msg = str_replace("\n","<br/>",$msg);
		
		$eMessage = "
			<html>
				<head>
					<title>Dispossible Contact Form</title>
				</head>
				<body>
					<p>From: ".$name." --- ".$email."</p>
					<p>Message: </p>
					<p>". $msg ."</p>
				</body>
			</html>
		";
		
		mail( $to, "Website Contact Form", $eMessage, $headers );
		
		$status = "success";
		
	} else {
		
		$errorString = "[";
		for( $i = 0 ; $i < count($error) ; $i++ ){
			
			$errorString .= '"'.$error[$i].'"';
			if( $error[$i+1] ){
				$errorString .= ",";
			}
			
		}
		$errorString .= "]";
	}
	
	if( $_GET["json"] != "true" ){
		$s = "c";
		if( $status=="error" ) $s = "e";
		header('Location: /contact?s='.$s);
		return;
	}
	
?>{"status":"<?php echo $status; ?>","error":<?php echo $errorString; ?>}