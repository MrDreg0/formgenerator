var formLayout = document.querySelector('.formLayout');
var requestURL;
var isFirstVariant = confirm("Показать первый вариант массива?");
if (isFirstVariant) {
    requestURL = 'form1.json';
}
else {
    alert("Показываю второй вариант массива.");
    requestURL = 'form2.json';
}
var request = new XMLHttpRequest();

request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    var json = request.response;
    var items = json.form.items;
    getForm(json);
    showElementForm(items);
}

function getForm(jsonObj) {
    var myForm = document.createElement('form');
    myForm.name = jsonObj.form.name;
    myForm.postMessage = jsonObj.form.postmessage;
    formLayout.appendChild(myForm);
}

function createElementForm(typeElement) {
    var myElement = document.createElement(typeElement);
    return myElement;
}

function changeAttributeElement(element, attr, value) {
    if (value || value === "") {
        if ((typeof value) === "object") {
            element.removeAttribute(attr);
        } else {
            element.setAttribute(attr, value);
        }
    } else {
        element.removeAttribute(attr);
    }
}

function showElementForm(items, type) {
    var form = document.querySelector('form');
    var select = document.querySelector('select');
    for (var i = 0; i < items.length; i++) {
        var elementType;
        var item = items[i];
        if (!type || type == "items") {
            if (item.type != "select") {
                elementType = "input";
            } else if (item.type == "select") {
                elementType = "select"
            } 
        } else {
            elementType = type;
        } 

        if (item.type == "filler") {
            var text = createElementForm("div");
            text.innerHTML = item["message"];
            form.appendChild(text);
            continue;
        };
        
        var tagElement = createElementForm(elementType);
        for (var key in item) {
            if (key == "label") {
                var label = createElementForm("label");
                label.textContent = item[key];
                label.appendChild(tagElement);
                form.appendChild(label);
                continue;
            };
            if (type == "option") {
                tagElement.textContent = item["text"];
            }
            if (item[key] === false) {
                if (item[key] === "") {
                    changeAttributeElement(tagElement, key, "");
                    continue;
                }
                changeAttributeElement(tagElement, key);
                continue;
            };
            if (item[key] == "button") {
                changeAttributeElement(tagElement, "value", item["text"]);
                tagElement.addEventListener("click", function () { validateForm() });
            };
            if (key == "validationRules") {
                continue;
            };
            if (key == "options") {
                showElementForm(item.options, "option");
            } else if (key == "items" && type != "items") {
                var arr = new Array();
                for (var j = 0; j < item.items.length; j++) {
                    arr.push( Object.assign(item.items[j], item));
                }
                showElementForm(arr, "items");
            }
            changeAttributeElement(tagElement, key, item[key]);
        }
        if (elementType == "option") {
            select.appendChild(tagElement);
        } else if (tagElement.value != "on" && tagElement.type != "radio"){
            form.appendChild(tagElement);
        }
    }
}

function validateForm () {
    var form = document.querySelector("form");
    var email = document.forms[0]["email"] || null;
    var message = document.forms[0]["message"] || null;
    var name = document.forms[0]["name"] || null;
    var tel = document.forms[0]["tel"] || null;
    var checkbox = document.forms[0]["checkbox"] || null;
    var radios = document.forms[0]["radio"] || null;
    var select = document.querySelector("select");

    if (email && email.value == "") {
        window.alert("Пожалуйста, введите Ваш email.");
        email.focus();
        return false;
    } else if (email.value.indexOf("@", 0) < 0 || email.value.indexOf(".", 0) < 0) {
        window.alert("Вы ввели неправильный email адрес.");
        email.focus();
        return false;
    }
    if ( name && name.value == "" ) {
        window.alert("Пожалуйста, введите Ваше ФИО.");
        name.focus();
        return false;
    };
    if ( tel && tel.value == "" ) {
        window.alert("Пожалуйста, введите Ваш номер телефона.");
        tel.focus();
        return false;
    };
    if ( message && message.value == "" ) {
        window.alert("Пожалуйста, введите Ваше сообщение.");
        message.focus();
        return false;
    };
    if (checkbox && !checkbox.checked) {
        window.alert("Пожалуйста, установите галочку, если Вы согласны с уловиями.");
        return false;
    }
    if (radios) {
        var isChecked = false;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked == true) {
                isChecked = true;
            }
        }
        if (!isChecked) {
            window.alert("Пожалуйста, выберите напиток.");
        return false;
        }
    }
    if (select && select.selectedIndex == 0) {
        window.alert("Пожалуйста, укажите Вашу должность.");
        return false;
    }
    var messageBlock = document.createElement("div");
    messageBlock.innerHTML = form.postMessage;
    form.appendChild(messageBlock);
}

