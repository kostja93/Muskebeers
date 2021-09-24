/**
 * DEV Fields
 */

var counter = 0
const dummyQuestions = [
    {
        "type": "Feature",
        "properties": {
            "question": "Finde den Turm mit den drei Käfigen",
            "hints": ["Es ist eine Kirche", "https://...."],
            "buffer": 100.0 // Wie nah muss man an dem Punkt sein?
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "question": "Groß und Rund in MS",
            "hints": ["Kreisel", "https://...."],
            "buffer": 100.0 // Wie nah muss man an dem Punkt sein?
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-110.99404, 50.75621]
        }
    }
]

/**
 * Implementation
 */


/**
 * Request of Geolocation for current position in
 * @param stand
 */
function currentPosition () {
        if (navigator.geolocation) {
        let stand = [];
        //getCurrentPosition or watchPosition
        navigator.geolocation.getCurrentPosition(function (position) {
            stand.push(position.coords.latitude);
            stand.push(position.coords.longitude);
        })

        return stand;
}else{
        return null;
}}
const STORAGE_KEY_CURRENT_QUESTION = "STORAGE_KEY_CURRENT_QUESTION";

var currentQuestion = null;

function initView () {
    if (localStorage.getItem(STORAGE_KEY_CURRENT_QUESTION) == null) {
        getAndStorNewQuestion();
    }
    currentQuestion = JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT_QUESTION));
    setMainContent(getHTMLCodeForQuestion())
}

function getAndStorNewQuestion () {
    localStorage.setItem(STORAGE_KEY_CURRENT_QUESTION, JSON.stringify(getNextQuestion()));
}

function getNextQuestion () {
    // TODO: Server Call
    return dummyQuestions[counter++ % dummyQuestions.length];
}

function setMainContent(htmlCode) {
    $("main").html(htmlCode);
    hideMenu();
}

function getHTMLCodeForQuestion () {
    let question = currentQuestion.properties.question;
    return "<span>"
        + question +
        "</span>";
}

$(document).ready(function() {
	$("body").on('click', '.top', toggleMenu);
    initView();
});