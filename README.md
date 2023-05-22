# Gameloader

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

Sg.launch(options, successCallback, errorCallback);


```
