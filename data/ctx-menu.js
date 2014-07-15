self.on("click", function (node, data) {
  var text = window.getSelection().toString();
  self.postMessage(text);
});
