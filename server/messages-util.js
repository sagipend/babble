var main = require('./main.js');

function addMessage(message) {
    main.setId(message, main.index);
    main.msgObjects.push(message);
    return main.index++;
}
function getMessages(counter) {
    var count = counter;
    if (main.msgObjects.length > count) {
        return JSON.parse(main.getMsgTextWithMessageTitle(main.msgObjects.slice(count)));
    }
}
function deleteMessage(id) {
    for (var k = main.msgObjects.length - 1; k >= 0; k--) {
        if (main.msgObjects[k].id == id) {
            main.msgObjects.splice(k, 1);
            return true;
        }
    }
    return false;
}
module.exports = { addMessage, getMessages, deleteMessage };