"use strict";
var Sg;
(function(Sg) {
    var win = window;

    function createIframe(target, uri, token, callbacks) {
        var headers = new Headers();
        headers.append("Authorization", token);

        fetch(uri, {
                headers: headers
            })
            .then(function(response) {
                if (response.ok) {
                    var iframe = document.createElement("iframe");
                    iframe.src = uri;
                    iframe.setAttribute("allowfullscreen", "true");
                    target.appendChild(iframe);
                    return callbacks.success();
                } else {
                    throw new Error("Failed to fetch iframe: " + response.status);
                }
            })
            .catch(function(error) {
                return callbacks.error(error);
            });
    }

    function startGame(options, sc, ec) {
        var callbacks = {
            success: function() {
                if (sc) {
                    return sc();
                }
            },
            error: function(e) {
                if (ec) {
                    return ec(e);
                }
            }
        };
        var target = document.getElementById(options.target_element);
        if (!target) {
            callbacks.error("No element with id '".concat(options.target_element, "' found"));
            return;
        }
        var lo = options.launch_options;
        switch (lo.strategy) {
            case "redirect":
                return win.location = lo.game_url;
            case "iframe":
                return createIframe(target, lo.game_url, lo.token, callbacks);
            default:
                return Error("Unexpected launch strategy");
        }
    }

    Sg.startGame = startGame;
    Sg.createIframe = createIframe;

    win.sg = {
        launch: startGame
    };
})(Sg || (Sg = {}));
