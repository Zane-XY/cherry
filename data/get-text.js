var form = document.getElementById('text_capture');
var textArea = document.getElementById("edit-box");
var input = document.getElementById("headword");

self.port.on("show", function onShow(d) {
  textArea.value = d;
});

if (form.attachEvent) {
    form.attachEvent("submit", processForm);
} else {
    form.addEventListener("submit", processForm);
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    text = textArea.value;
    self.port.emit("text-entered", {
        'title': input.value,
        'content': text,
        'rating': 1
    });
    input.value = '';
    textArea.value = '';
    // return false to prevent the default form behavior
    return false;
}

