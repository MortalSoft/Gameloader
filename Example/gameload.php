<?php
$api = "https://api-prod.mortalsoft.online";
$OperatorToken = "YOUR_TOKEN_HERE";
// This can be anything, with what you will get data from our backend for specified user, it must stay same even on your change in your site, or it will create new user with 0 balance
$Identifier = "Player28744";
$balance = 100000; // You can set in url balance, but we keep old balance, this parameter is optional
$curl_handle = curl_init();
curl_setopt($curl_handle, CURLOPT_URL, $api."/api/".$OperatorToken."/createSession?identifier=".$Identifier."&balance=".$balance);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, true);
$curl_data = curl_exec($curl_handle);
curl_close($curl_handle);

$response = json_decode($curl_data, true);
$token = $response['original']['token'];
?>
<script type="application/javascript" src="https://cdn.jsdelivr.net/gh/MortalSoft/Gameloader@main/sg.min.js"></script>

<div id="game"></div>


<script>
    document.addEventListener("DOMContentLoaded", function(event) {
    var options = {
        target_element: "game",
        launch_options: {
            strategy: "iframe",
            game_url: "https://api-prod.mortalsoft.online/play/CaribbeanHolidaysGT",
            token: "<?php echo $token; ?>"
        }
    };

    function successCallback() {
        console.log("Iframe created successfully!");
    }

    function errorCallback(error) {
        console.error("An error occurred:", error);
    }

        window.sg.launch(options, successCallback, errorCallback);
    });
</script>
