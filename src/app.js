const axios = require('axios');

const client_id = '87bccbeb23114d44b788fd6cea0511b1';
const client_secret = '2b6c6f0ac7bc45a8b23bb33510a6182b';
const redirect_uri = 'http://localhost:1234/callback';

//scope later toevoegen in relatie met te gebruiken endPoints...
//const scope = "user-read-private user-read-mail";

function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect();
    }
}

function handleRedirect() {
    let code = getCode();
    getAccessToken(code);
}

async function getAccessToken(code) {
// token ophalen met de code, deze wel async?
}
//slaat code op voor hergebruik...
function getCode() {
    let code = "";
    const urlString = window.location.search;
    if (urlString > 0) {
        const urlParams = new URLSearchParams(urlString);
        code = urlParams.get("code");
    }
    return code
}


// maakt een string vn de URL op basis van alle authorization gegevens en pushed die in de searchbar van de pagina
// ... die zorgt dan voor een prompt van Spotify en geeft de 'code' terug.

function getAuth() {
    let url = "https://accounts.spotify.com/authorize?";
    url += "client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + redirect_uri;
    url += "&show_dialog=true";
    //url += "&scope=" + scope;
    window.location.href = url;
}

getAuth();

