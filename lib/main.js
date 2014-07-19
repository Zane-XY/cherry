var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var selection = require("sdk/selection");
var data = require("sdk/self").data;
var Request = require("sdk/request").Request;
var notifications = require("sdk/notifications");
var passman = require("sdk/passwords");
var pref = require('sdk/simple-prefs');
var base64 = require("sdk/base64");
var urls = require("sdk/url");

var serviceURL = require('sdk/simple-prefs').prefs['serviceURL'];

function capturedTextRequest(data, url, auth) { 
    return Request({
        url: url,
        contentType: "application/json",
        content: JSON.stringify(data),
        headers: {
            Authorization: 'Basic ' + auth
        },
        onComplete: function (res) {
            notifications.notify({title: "picked a cherry!"});
            console.log(res);
        }
    }).post();
};

function withAuth(action) {
    passman.search({
        url: urls.URL(serviceURL).origin,
        onComplete: function onComplete(credentials) {
            credentials.forEach(function(credential) {
                action(base64.encode(credential.username + ':' + credential.password));
            });
        }
    });
}

var button = buttons.ActionButton({
    id: "cherrypickbtn",
    label: "Pick Cherry",
    icon: {
        "16": "./cherry-16.png",
        "23": "./cherry-24.png",
        "32": "./cherry-32.png",
        "48": "./cherry-48.png",
        "64": "./cherry-64.png",
        "128": "./cherry-128.png"
    },
    onClick: cherryClick
});

var cm = require("sdk/context-menu");

cm.Item({
    label: "Pick Cherry",
    context: cm.SelectionContext(),
    contentScriptFile: data.url("ctx-menu.js"),
    onMessage: cherryClick
});

function cherryClick() {
    entryPanel.show();
}

var entryPanel = require("sdk/panel").Panel({
    width: 500,
    height: 250,
    contentURL: data.url("entry.html"),
    contentScriptFile: data.url("get-text.js")
});

entryPanel.on("show", function() {
    entryPanel.port.emit("show", selection.text);
});

entryPanel.port.on("entrySave", function (data) {
    if(data.context && serviceURL) {
        withAuth(function(auth) {
            capturedTextRequest(data, serviceURL, auth);
        });
    } else {
        console.log(data);
        console.log(serviceURL);
    }
    entryPanel.hide();
});
