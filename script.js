const x_button = document.querySelector("#x_button");
const y_field = document.querySelector("#y_field");
const err_msg = document.querySelector("#err_msg");
const x_values = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
let x_pointer = 3;
let x_value = x_values[x_pointer];
let y_value;
let r_value;



window.addEventListener("load", customButtonSetValue);
function customButtonSetValue(){
    x_button.textContent = x_value;
}

x_button.addEventListener("click", customButtonClick)
function customButtonClick(){
    x_value = x_values[(++x_pointer)%x_values.length];
    customButtonSetValue();
}


const form = document.querySelector("form");
form.addEventListener("submit", sendAJAX_fetch);

function sendAJAX_fetch(event){
    event.preventDefault();
    if (!validateForm()){
        return;
    }
    const time_offset = (new Date()).getTimezoneOffset();
    const method = form.method;
    const requestURL = form.action;
    const formData =
        'x_value=' + encodeURIComponent(x_value)
        + '&y_value=' + encodeURIComponent(y_value)
        + '&r_value=' + encodeURIComponent(r_value)
        + '&time_offset=' + encodeURIComponent(time_offset) ;

    fetch(requestURL, {
        method: method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formData
    })
        .then(function(response) {
            if(response.ok){
                return response.json();
            }
        })
        .then(function(json) {
            drawTable(json);
        })
        .catch(
            error => {
                alert(error);
            }
        );
}

/*
function sendAJAX_xml(event){
    event.preventDefault();
    if (!validateForm()){
        return;
    }

    const time_offset = (new Date()).getTimezoneOffset();
    const method = form.method;
    const requestURL = form.action;
    const formData =
        'x_value=' + encodeURIComponent(x_value)
        + '&y_value=' + encodeURIComponent(y_value)
        + '&r_value=' + encodeURIComponent(r_value)
        + '&time_offset=' + encodeURIComponent(time_offset) ;
    const xhr = new XMLHttpRequest();
    xhr.open(method, requestURL);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = processRequest_xhr;
    xhr.send(formData);
}

function processRequest_xhr(event){
    try {
        const xhr = event.target;
        console.log(xhr.response)
        if (xhr.status !== 200) {
            return;
        }
        drawTable(xhr.response);
    }
    catch (e){
        alert("Ошибка: " + e.description);
    }

}
*/

function validateForm() {
    r_value = document.querySelector("#r_select").value;
    y_value = Number(y_field.value.replace(",", "."));
    if (isNaN(y_value) || y_value > 3 || y_value < -3) {
        err_msg.textContent = "Изменение Y должно быть числом от -3 до 3!";
        return false;
    }
    else {
        err_msg.textContent = "";
        return true;
    }
}

function drawTable(response){
    const tbody = document.querySelector("#results_table tbody");
    const tableValues = ["date", "x", "y", "r", "area_check", "work_time"];
    clearTable(tbody);
    for (let row of response){
        const tr = document.createElement("tr");
        for (let key of tableValues){
            const td = document.createElement("td");
            const content = row[key];
            if (content === null){
                td.textContent = "-";
            }
            else{
                td.textContent = content;
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function clearTable(tbody){
    tbody.querySelectorAll("tr").forEach((tr)=>{
        tbody.removeChild(tr);
    });
}


const clear_cookie_button = document.querySelector("#clear_cookie");
clear_cookie_button.addEventListener("click", clearCookie)
function clearCookie(){
    const cookies = document.cookie.split(";");
    document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearTable(document.querySelector("#results_table tbody"));
}

const clear_form_button = document.querySelector("button[type='reset']");
clear_form_button.addEventListener("click", clearForm());

function clearForm(){

}