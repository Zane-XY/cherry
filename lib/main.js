var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var selection = require("sdk/selection");
var data = require("sdk/self").data;
var request = require("sdk/request").Request;
var notifications = require("sdk/notifications");

var serviceURL = require('sdk/simple-prefs').prefs['serviceURL'];


console.log("serviceURL: " + serviceURL);

require("sdk/passwords").search({
    url: serviceURL,
    onComplete: function onComplete(credentials) {
        credentials.forEach(function(credential) {
            serviceURL = credential.username + ':' + credential.password + '@' + serviceURL;
            notifications.notify({
                title: "serviceURL",
                text: serviceURL
            });
        });
    }
});

var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": "./cherry-16.png",
    "32": "./cherry-32.png",
    "64": "./cherry-64.png"
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
    console.log(data);
    if(data.context){
        capturedTextRequest(data);
    } else {
        notifications.notify({
            'title': "context should not be empty"
        });  
    }
    entryPanel.hide();
});


function capturedTextRequest(data) { 
    return request({
        url: serviceURL,
           contentType: "application/json",
           content: JSON.stringify(data),
           onComplete: function (response) {
               console.log('response' + response);
           }
    }).post();
};

