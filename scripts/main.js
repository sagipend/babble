
window.Babble = {
  currentMessage: '',
  userInfo: {
    name: '',
    email: ''
  },
  counter: 0,
  register: function register(userInfo) {
    var name = userInfo.name;
    var email = userInfo.email;
    if (name == '') name = "";
    if (email == '') email = ""; // no matter

    if (typeof (Storage) !== "undefined" && userNameExist(name, email) == null) {
      localStorage.setItem('babble', JSON.stringify({ currentMessage: '', userInfo: { name: name, email: email } }));
    }

    Babble.currentMessage = '';
    Babble.userInfo = { name: name, email: email };

    sendAsync({
      method: 'POST',
      action: 'http://localhost:9000/clt/',
      data: {
        num: 1
      }
      // data:
    }).then(function (result) {
    });
  },
  getMessages: function getMessages(counter, callback) {

    if (typeof callback !== "function") {
      poll(counter);
    }
    else {
      callback(poll(counter));
    }
  },
  postMessage: function postMessage(message, callback) {
    if (typeof callback !== "function") {
      submitMessage(message);
    }
    else {
      callback({ id: String(JSON.parse(submitMessage(message)).id) });
    }
  },
  deleteMessage: function deleteMessage(id, callback) {
    if (typeof callback !== "function") {
      deleteMsg(id);
    }
    else {
      callback(deleteMsg(id));
    }

  },
  getStats: function getStats(callback) {
    if (typeof callback !== "function") {
      stats();
    }
    else {
      callback(JSON.parse(stats()));
    }
  }
};



function createUser(currentMessage, name, email) {
  this.currentMessage = currentMessage;
  this.userInfo = {
    name: name,
    email: email
  };
}


makeGrowable(document.querySelector('.js-growable'));


function makeGrowable(container) {
  var area = container.querySelector('textarea');
  var clone = document.getElementById("js-text-span");//.querySelector('span');
  var firstHeight = parseInt(document.getElementById('js-ol').clientHeight);
  var firstContinerHeight = parseInt(document.getElementById('js-continer').clientHeight);
  var firstTextareaHeight = parseInt(document.getElementById('js-textarea').clientHeight);
  var firstGrowableHeight = parseInt(document.getElementById('js-growable').clientHeight);
  var firstBtnHeight = parseInt(window.getComputedStyle(document.getElementById('js-send'), null).getPropertyValue('margin-top'));
  var temp = area.clientHeight;

  area.addEventListener('input', function (e) {

    var h1 = document.getElementById('js-ol').clientHeight;
    var h2 = document.getElementById('js-continer').clientHeight;
    clone.textContent = area.value;
    document.getElementById('js-ol').style.height = firstHeight + 55 - area.clientHeight + "px";
    document.getElementById('js-continer').style.height = firstContinerHeight - 55 + area.clientHeight + "px";
    if (firstTextareaHeight - area.clientHeight != 0)
      document.getElementById("js-send").style.marginTop = area.clientHeight / 2.25 + "px";
    var x = firstHeight + 55 - area.clientHeight + "px";
    if (temp == area.clientHeight) {
      document.getElementById("js-send").style.marginTop = firstBtnHeight + "px";
    }
  });
  document.getElementById('form-newMsg').addEventListener('submit', function (e) {
    document.getElementById('js-ol').style.height = firstHeight + "px";
    document.getElementById('js-continer').style.height = firstContinerHeight + "px";//- 55 + area.clientHeight + "px";
    document.getElementById("js-send").style.marginTop = firstBtnHeight + "px";
    clone.textContent = "";
  });
  document.getElementById('form-newMsg').addEventListener('keypress', function (e) {
    if (e.which == 13 && !e.shiftKey) {
      document.getElementById('js-ol').style.height = firstHeight + "px";
      document.getElementById('js-continer').style.height = firstContinerHeight + "px";//- 55 + area.clientHeight + "px";
      document.getElementById("js-send").style.marginTop = firstBtnHeight + "px";
    }
    clone.textContent = "";
  });
}

document.getElementById('form-newMsg').addEventListener('submit', function (e) {
  e.preventDefault();
  if (document.getElementById('js-textarea').value !== "") {
    Babble.postMessage({
      name: Babble.userInfo.name,
      email: Babble.userInfo.email,
      message: document.getElementById('js-textarea').value,
      timestamp: getDateTimeUNIX()
    });
  }
});
document.getElementById('form-newMsg').addEventListener('keypress', function (e) {
  if (e.which == 13 && !e.shiftKey) { //enter pressed and not shift
    e.preventDefault();
    if (document.getElementById('js-textarea').value !== "") {

      Babble.postMessage({
        name: Babble.userInfo.name,
        email: Babble.userInfo.email,
        message: document.getElementById('js-textarea').value,
        timestamp: getDateTimeUNIX()
      });
    }
  }
});

function submitMessage(message) {
  var response;
  try {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:9000/messages', false);
    var response;
    request.onload = function () {
      if (request.status !== 204 && request.status !== 400 && request.status !== 404 && request.status !== 405) {
        response = JSON.parse(request.responseText);
        document.getElementById('js-textarea').value = "";

      }
    }

    request.send(JSON.stringify(message));
  } catch (e) { }
  return JSON.stringify(response);
}


document.getElementById('btnLogin').addEventListener('click', function (e) {
  e.preventDefault();
  var name = document.getElementById("modal-name").value;
  var email = document.getElementById("modal-email").value;
  Babble.register({ name: name, email: email });
});

document.getElementById('btnAnony').addEventListener('click', function (e) {
  e.preventDefault();
  var name = ""
  var email = "" //need to change it !!!! 
  Babble.register({ name: name, email: email });
});


function SaveDataToLocalStorage(data) {
  localStorage.setItem('babble', JSON.stringify({ currentMessage: '', userInfo: { name: JSON.parse(data).name, email: JSON.parse(data).email } }));
}

function userNameExist(name, email) {

  var val = JSON.parse(localStorage.getItem('babble'));
  if (val == null) {
    return null
  }
  if (val.userInfo.name == name && val.userInfo.email == email) {
    return "exsist";
  }
  return null;
}

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  if (document.getElementById('register').style.display == 'none' &&
    document.getElementById('register').style.zIndex == 0 &&
    document.getElementById('js-modal').style.zIndex == 0) {
    sendAsync({
      method: 'POST',
      action: 'http://localhost:9000/clt/',
      data: {
        num: 2
      }
    }).then(function (result) {
    });
  }
});

function function1(name, gravatar, message, sentTime, id) {
  var ol = document.getElementById("js-ol");
  var li = document.createElement("li");
  li.setAttribute("tabindex", "-1");

  //img
  var img = document.createElement("img");
  img.className = "user_avatar";
  img.setAttribute("alt", "");
  if (name != "") {
    img.setAttribute("src", gravatar);
  } else {
    img.setAttribute("src", "../images/anonymous.png");
  }
  li.appendChild(img);


  //create div-message
  var div_message = document.createElement("div");
  div_message.className = "message";
  li.appendChild(div_message);

  //cite
  var username = document.createElement("cite");
  if (name != "") {
    username.appendChild(document.createTextNode(name));
  }
  else {
    username.appendChild(document.createTextNode("Anonymous"));

  }
  username.className = "username";
  div_message.appendChild(username);

  //time
  var time = document.createElement("time");
  time.setAttribute("datetime", sentTime);

  time.appendChild(document.createTextNode(timeConverter(sentTime)));
  div_message.appendChild(time);

  //button
  var button = document.createElement("button");
  button.setAttribute("aria-label", "Delete message");
  button.setAttribute("id", "js-delete");
  //the delete img
  var img = document.createElement("img");
  img.setAttribute("src", "/images/removeMsg.png");
  button.appendChild(img);
  button.className = "delete";
  button.style.display = "none";

  li.addEventListener('mouseover', function () {
    if (Babble.userInfo.name != "") {
      if (Babble.userInfo.name == name) {
        button.style.display = "block";
      }
    }
  });
  li.addEventListener('mouseout', function () {
    button.style.display = "none";
  });

  button.addEventListener('click', function () {
    var flag = JSON.stringify(deleteMsg(id));
    if (flag) {
      removeAllLiElements(id);
    }
  });

  div_message.appendChild(button);

  //div-content
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(message));
  div.className = "content";
  div_message.appendChild(div);

  li.setAttribute("id", "js-li" + id);

  ol.appendChild(li);
  ol.scrollTop = ol.scrollHeight;
}

function removeAllLiElements(id) {
  var parent = document.getElementById('js-ol');
  var elems = parent.getElementsByTagName('LI');
  document.getElementById("js-li" + id).style.display = "none";
}

function timeConverter(UNIX_timestamp) {
  var hour = new Date(UNIX_timestamp * 1000).getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = new Date(UNIX_timestamp * 1000).getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var time = hour + ':' + min;
  return time;

}

window.addEventListener('load', function () {
  if (localStorage.getItem('babble') == null) {
    var newUser = {
      currentMessage: "",
      userInfo: {
        name: "",
        email: ""
      }
    };
    localStorage.setItem('babble', JSON.stringify(newUser));
  }
  var loc = localStorage.getItem('babble');
  var getloc = JSON.parse(loc);
  var getlocMsg = getloc.currentMessage;
  var getlocName = getloc.userInfo.name;
  var getlocEmail = getloc.userInfo.email;

  if ((typeof (Storage) == "undefined") || (getlocEmail === "" && getlocMsg === "" && getlocName === "")) {
    document.getElementById('register').style.display = 'block';
    document.getElementById('register').style.zIndex = 1;
    document.getElementById('js-modal').style.zIndex = 1;
  }
  else {
    document.getElementById('register').style.display = 'none';
    document.getElementById('register').style.zIndex = 0;
    document.getElementById('js-modal').style.zIndex = 0;

    var localS = JSON.parse(localStorage.getItem('babble'));
    var name = localS.userInfo.name;
    var email = localS.userInfo.email;
    var currentMessage = localS.currentMessage;
    Babble.register({ name: name, email: email });
    Babble.currentMessage = currentMessage;
    Babble.userInfo.name = name;
    Babble.userInfo.email = email;
    document.getElementById('js-textarea').value = currentMessage;
  }
});

function deleteMsg(id) {
  var response;
  try {
    var request = new XMLHttpRequest();
    request.open("DELETE", 'http://localhost:9000' + '/messages/' + id, false);

    request.onload = function () {
      if (request.status !== 204 && request.status !== 400 && request.status !== 404 && request.status !== 405) {
        // Success!
        response = JSON.parse(request.responseText);
        Babble.counter--;
      }
    }
    request.send();
  } catch (e) { }
  return response;
};

document.getElementById("btnLogin").addEventListener("click", function () {
  document.getElementById('register').style.display = 'none';

  document.getElementById('register').style.zIndex = 0;
  document.getElementById('js-modal').style.zIndex = 0;

});
document.getElementById("btnAnony").addEventListener("click", function () {
  document.getElementById('register').style.zIndex = 0;
  document.getElementById('js-modal').style.zIndex = 0;
  document.getElementById('register').style.display = 'none';

});

function poll(counter) {
  var ret = [];
  sendAsync({
    method: 'GET',
    action: 'http://localhost:9000' + '/messages?counter=' + Babble.counter
  }).then(function (result) {


    // if (result !== undefined && result.length >= 0) {
    var sentUser = result.name;

    //message email
    var sentEmail = result.email;

    //message time
    var sentTime = result.timestamp;

    //message content
    var res = result.append;
    //message id
    var sentId = result.id;

    if (sentUser != undefined) {
      for (var i = 0; i < sentUser.length; i++) {
        function1(sentUser[i], decodeURIComponent(sentEmail[i]), res[i], sentTime[i], sentId[i]);
        ret.push({ name: sentUser[i], email: decodeURIComponent(sentEmail[i]), message: res[i], timestamp: sentTime[i], id: sentId[i] });
        var index = sentId[i];
      }
      Babble.counter = result.count;
    }
  });
  return ret;
}

function putHoverEventsToLi(name, id) {
  var parent = document.getElementById('js-ol');
  var elems = parent.getElementsByTagName('LI');

  for (var x = 0; x < elems.length; x++) {
    elems[x].addEventListener('mouseover', function () {
      if (Babble.userInfo.name == name) {
        document.getElementById('js-li' + id).style.display = "block";
      }
    });
  }
}

function withDeleteButton(name) {
  var parent = document.getElementById('js-ol');
  var elems = parent.getElementsByTagName('LI');
  for (var x = 0; x < elems.length; x++) {
    if (Babble != null) {
      if (Babble.userInfo.name == name) {
        elems[x].children[1].children[2].style.display = "block";
      }
    }
  }
}


function withDeleteButtonAfterLogin() {
  var parent = document.getElementById('js-ol');
  var elems = parent.getElementsByTagName('LI');
  for (var x = 0; x < elems.length; x++) {
    if (Babble != null) {
      if (Babble.userInfo.name == elems[x].children[1].children[0].textContent) {
        elems[x].children[1].children[2].style.display = "block";
      }
    }
  }
}

function withDeleteButtonAfterLoginId(id) {
  var parent = document.getElementById('js-ol');
  var elems = parent.getElementsByTagName('LI');
  for (var x = 0; x < elems.length; x++) {
    elems[x].addEventListener('mouseover', function () {
      if (Babble != null) {
        if (Babble.userInfo.name == elems[x].children[1].children[0].textContent) {
          document.getElementById('js-li' + id).style.display = "block";
        }
      }
    });
  }
}

function stats() {
  var response;
  var currentStats = {};
  try {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:9000' + '/stats', false);
    request.onload = function () {
      if (request.status !== 204 && request.status !== 400 && request.status !== 404 && request.status !== 405) {
        // Success!
        if (request.responseText !== "") {
          response = JSON.parse(request.responseText);
          var usersNumber = response.users;
          var messagesNumber = response.messages;
          currentStats = { users: usersNumber, messages: messagesNumber };
        }

        document.getElementById("js-num_clients").textContent = usersNumber;
        document.getElementById("js-num_messages").textContent = messagesNumber;
      } else {
        // We reached our target server, but it returned an error
      }
    }
    request.send();
  } catch (e) {
  }
  return JSON.stringify(response);
};

window.addEventListener('keyup', function keyCheck(e) {
  if (typeof (keyCheck.i) === "undefined") {
    keyCheck.i = 0;
  }
  if (typeof (keyCheck.j) === "undefined") {
    keyCheck.j = 0;
  }
  //tab key had pressed
  var parent = document.getElementById('js-ol');
  var elems = parent.getElementsByTagName('LI');
  var messagesContent = [];
  if (keyCheck.j > 0 && keyCheck.j <= elems.length) {
    elems[keyCheck.j - 1].children[1].className = "message";
    FireEvent(elems[keyCheck.j - 1].id, "mouseout");

  }

  if (e.which == 9 && keyCheck.j < elems.length) {

    elems[keyCheck.j].children[1].className = "hov message";
    if (keyCheck.i % 2 == 0) {
      elems[keyCheck.j].focus();
      FireEvent(elems[keyCheck.j].id, "mouseover");
      if (elems[keyCheck.j].children[1].children[2].style.display == "none") {
        keyCheck.i++;
        keyCheck.j++;
      }
    }

    else {
      if (elems[keyCheck.j].children[1].className == "hov message") {
        elems[keyCheck.j].children[1].children[2].className = "focus-delete";
        elems[keyCheck.j].children[1].className = "hov message";
      }
      keyCheck.j++;

    }
    keyCheck.i++;
  }
});

window.addEventListener('unload', function () {
  if (Babble != "undefined") {
    setCurrentMessage(document.getElementById('js-textarea').value, Babble.userInfo.name, Babble.userInfo.email);
  }
});

function setCurrentMessage(value, name, email) {
  if (localStorage.getItem('babble') != "undefined" && JSON.parse(localStorage.getItem('babble')) != null) {
    val = JSON.parse(localStorage.getItem('babble'));
    if (val.userInfo.name == name && val.userInfo.email == email) {
      val.currentMessage = value;
    }
    localStorage.setItem('babble', JSON.stringify(val));
  }
}

function FireEvent(ElementId, EventName) {
  if (document.getElementById(ElementId) != null) {
    if (document.getElementById(ElementId).fireEvent) {
      document.getElementById(ElementId).fireEvent('on' + EventName);
    }
    else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(EventName, true, false);
      document.getElementById(ElementId).dispatchEvent(evObj);
    }
  }
}

function getDateTimeUNIX() {
  return Math.round((new Date()).getTime() / 1000);
}

function sendAsync(props) {
  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      if (props.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }
      xhr.onload = function () {
        if (xhr.status === 200 && xhr.responseText !== "") {
          resolve(JSON.parse(xhr.responseText));
        }
      }
      xhr.open(props.method, props.action);
      xhr.timeout = 400;
      // xhr.on('error', function () {
      // });
      //if (request.status != 0)
      xhr.send(JSON.stringify(props.data));
      setTimeout(function () {
        Babble.getMessages(Babble.counter);
        Babble.getStats();
      }, 10);
    } catch (e) {
      // console.log('catch', e);
    }
    // xhr.send();
  });
}
