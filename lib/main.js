var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var selection = require("sdk/selection");

if (!selection.isContiguous) {
    for (var subselection in selection) {
             console.log(subselection.html);
               
    }

}

var cm = require("sdk/context-menu");
cm.Item({
      label: "cherrypick",
      context: cm.SelectionContext(),
      contentScript: 'self.on("click", function (node, data) {' +
                           '  console.log(selection.text);' +
                           '});',
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

function handleClick(state) {
    console.log(selection.text);

}
