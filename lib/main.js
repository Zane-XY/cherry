var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var selection = require("sdk/selection");
var data = require("sdk/self").data;

var cm = require("sdk/context-menu");

/**
 * content script will fetch and process DOM and will return data back to the onMessage()
 */
cm.Item({
    label: "cherrypick",
    context: cm.SelectionContext(),
    contentScriptFile: data.url("ctx-menu.js"),
    onMessage: function (msg) {
        console.log("msg");
        text_entry.show();
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
    onClick: handleClick
});


var text_entry = require("sdk/panel").Panel({
  width: 600,
  height: 300,
  contentURL: data.url("text-entry.html"),
  contentScriptFile: data.url("get-text.js")
});

function handleClick(state) {
    text_entry.show();
}

var serviceURL = require('sdk/simple-prefs').prefs['serviceURL'];

console.log("serviceURL: " + serviceURL);

require("sdk/passwords").search({
  url: serviceURL,
  onComplete: function onComplete(credentials) {
    credentials.forEach(function(credential) {
        serviceURL = credential.username + ':' + credential.password + '@' + serviceURL;
        console.log(serviceURL);
    });
  }
});

var Request = require("sdk/request").Request;

function capturedTextRequest(data) { 
    return Request({
        url: serviceURL,
        contentType: "application/json",
        content: JSON.stringify(data),
        onComplete: function (response) {
            console.log('response' + response);
        }
   }).post();
};

// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.

text_entry.on("show", function() {
  text_entry.port.emit("show", selection.text);
});

text_entry.port.on("text-entered", function (data) {
  console.log(data);
  capturedTextRequest(data);
  text_entry.hide();
});

