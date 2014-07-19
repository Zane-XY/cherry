var form = document.getElementById('entryForm');
var headwordField = document.getElementById("headword");
var contextField = document.getElementById("context");

self.port.on("show", function onShow(d) {
    if(d){
      contextField.value = d;
    }
});

if (form.attachEvent) {
    form.attachEvent("submit", processForm);
} else {
    form.addEventListener("submit", processForm);
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    self.port.emit("entrySave", {
        'headword': headwordField.value,
        'context': contextField.value,
        'rating': 1
    });
    headwordField.value = '';
    contextField.value = '';
    // return false to prevent the default form behavior
    return false;
}

