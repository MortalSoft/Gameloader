<?php
$api = "https://dev.mortalsoft.wtf";

$curl_handle = curl_init();
curl_setopt($curl_handle, CURLOPT_URL, $api."/api?action=createSession&token=4RtXGy8jwkHkBqNwnRe5WpeOv&identifier=171113");
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, true);
$curl_data = curl_exec($curl_handle);
curl_close($curl_handle);

$response = json_decode($curl_data, true);
$token = $response['original']['token'];
?>
<script type="application/javascript" src="https://cdn.jsdelivr.net/gh/MortalSoft/Gameloader@main/sg.js"></script>

<div id="game"></div>


<script>
    document.addEventListener("DOMContentLoaded", function(event) {
    var options = {
        target_element: "game",
        launch_options: {
            strategy: "iframe",
            game_url: "https://dev.mortalsoft.wtf/game/CaribbeanHolidaysGT?api_exit=/",
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
