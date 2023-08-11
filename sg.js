"use strict";
var Sg;
(function(Sg) {
    var win = window;

    function createIframe(target, uri, token, callbacks) {
        let game = uri + "/" + token;

        fetch(game, {
            mode: 'no-cors'
        }).then(function(response) {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error("Failed to fetch iframe: " + response.status);
                }
            })
            .then(function(content) {
                var iframeUrl = new URL(game);

                var iframe = document.createElement("iframe");
                iframe.src = iframeUrl.toString();
                iframe.setAttribute("allowfullscreen", "true");

                target.appendChild(iframe);
                callbacks.success();
            })
            .catch(function(error) {
                callbacks.error(error);
            });
    }

    function startGame(options, sc, ec) {
        var callbacks = {
            success: function() {
                if (sc) {
                    sc();
                }
            },
            error: function(e) {
                if (ec) {
                    ec(e);
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
                win.location = lo.game_url;
                break;
            case "iframe":
                createIframe(target, lo.game_url, lo.token, callbacks);
                break;
            default:
                throw new Error("Unexpected launch strategy");
        }
    }

    Sg.startGame = startGame;
    Sg.createIframe = createIframe;

    win.sg = {
        launch: startGame
    };
})(Sg || (Sg = {}));
