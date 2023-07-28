# Gameloader
<br>

```html
<script type="application/javascript" src="https://cdn.jsdelivr.net/gh/MortalSoft/Gameloader@main/sg.js"></script>
```

Example of usage:

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

window.sg.launch(options, successCallback, errorCallback);


```

Demo games should launch with empty token: 

```js
var options = {
    target_element: "your-target-element-id",
    launch_options: {
        strategy: "iframe",
        game_url: "https://api-prod.mortalsoft.online/play/SweetBonanza",
        token: "user-token"
    }
};
```


