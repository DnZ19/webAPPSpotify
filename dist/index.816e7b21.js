//const axios = require('axios');
const redirect_uri = "http://localhost:1234/callback";
const AUTHORIZE = "https://accounts.spotify.com/authorize?";
const TOKEN = "https://accounts.spotify.com/api/token";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
// const access_token = null;
// const refresh_token = null;
let client_id = "";
let client_secret = "";
//scope later toevoegen in relatie met te gebruiken endPoints...
//const scope = "user-read-private user-read-mail";
// Maakt een string vn de URL op basis van alle authorization gegevens en pushed die in de searchbar van de pagina
// ... die zorgt dan voor een prompt van Spotify en geeft de 'code' terug.
function onPageLoad() {
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    if (window.location.search.length > 0) handleRedirect();
    else {
        access_token = localStorage.getItem("access_token");
        if (access_token === null) // we don't have an access token so present token section
        document.getElementById("tokenSection").style.display = "block";
        else {
            // we have an access token so present device section
            document.getElementById("deviceSection").style.display = "block";
            refreshDevices();
        //refreshPlaylists();
        //currentlyPlaying();
        }
    }
//refreshRadioButtons();
}
// const pageLoad = document.getElementById("onPageLoad");
// pageLoad.addEventListener("onload", onPageLoad);
function handleRedirect() {
    let code = getCode();
    getAccessToken(code);
    window.history.pushState("", "", redirect_uri); // remove param from url
}
function getAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + redirect_uri;
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    getAccessAPI(body);
}
function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callApi(body);
}
//slaat code op voor hergebruik...
function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get("code");
    }
    return code;
}
function requestAuthorization() {
    const client_id1 = "87bccbeb23114d44b788fd6cea0511b1";
    const client_secret1 = "2b6c6f0ac7bc45a8b23bb33510a6182b";
    localStorage.setItem("client_id", client_id1);
    localStorage.setItem("client_secret", client_secret1);
    let url = AUTHORIZE;
    url += "client_id=" + client_id1;
    url += "&response_type=code";
    url += "&redirect_uri=" + redirect_uri;
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url;
}
const buttonAuth = document.getElementById("auth-button");
buttonAuth.addEventListener("click", requestAuthorization);
//(XHR) objects are used to interact with server
function getAccessAPI(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("post", TOKEN, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}
function handleAuthorizationResponse() {
    if (this.status === 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        console.log("test ok");
        // data = JSON.parse(this.responseText);
        if (data.access_token !== undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token !== undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
function refreshDevices() {
    callApi("GET", DEVICES, null, handleDevicesResponse);
}
const refreshDevButton = document.getElementById("dev-button");
refreshDevButton.addEventListener("click", refreshDevices);
function handleDevicesResponse() {
    if (this.status === 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("devices");
        data.devices.forEach((item)=>addDevice(item));
    } else if (this.status === 401) refreshAccessToken();
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
function addDevice(item) {
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    document.getElementById("devices").appendChild(node);
}
function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.send(body);
    xhr.onload = callback;
}
function removeAllItems(elementId) {
    let node = document.getElementById(elementId);
    while(node.firstChild)node.removeChild(node.firstChild);
}

//# sourceMappingURL=index.816e7b21.js.map
