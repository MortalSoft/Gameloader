# Gameloader
<br>
```HTML
<script crossorigin="anonymous" defer="defer" type="application/javascript" src="https://cdn.jsdelivr.net/gh/MortalSoft/Gameloader@main/sg.js"></script>
```
<br>
Example of usage:<br>
```js
var options = {
    target_element: "your-target-element-id",
    launch_options: {
        strategy: "iframe",
        game_url: "your-game-url",
        token: "your-authorization-token"
    }
};

function successCallback() {
    console.log("Iframe created successfully!");
}

function errorCallback(error) {
    console.error("An error occurred:", error);
}

Sg.launch(options, successCallback, errorCallback);


```

Demo games should launch with empty token: <br>
<br>
```js
var options = {
    target_element: "your-target-element-id",
    launch_options: {
        strategy: "iframe",
        game_url: "your-game-url",
        token: ""
    }
};
```


