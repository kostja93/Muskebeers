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

const STORAGE_KEY_CURRENT_QUESTION = "STORAGE_KEY_CURRENT_QUESTION";
const QRCODE_VIDEO_ID = "QRCODE_VIDEO_ID"

var currentQuestion = null;
var qrScanner = null;

function initView () {
    console.log("init View");
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
    console.log("Change content");
    $("main").html(htmlCode);
    
    // When there is a video element we have the qr view activated.
    if ($("#" + QRCODE_VIDEO_ID).length) {
        initQrCodeScanner();
    }
    hideMenu();
}

function initQrCodeScanner() {
    const videoElem = $("#" + QRCODE_VIDEO_ID).get(0)
    // TODO: This leads to an error 
    // 1523qr-scanner.umd.min.js:14 DOMException: Failed to construct 'Worker': Script at 'file:///C:/Users/kaiha/Desktop/mshack/Muskebeers/app/qr-scanner-worker.min.js' cannot be accessed from origin 'null'.
    // Because chrome doesnt let you run workers on local files.
    // https://stackoverflow.com/a/23206866/8524651
    qrScanner = new QrScanner(videoElem, result => console.log('decoded qr code:', result));
    qrScanner.start();
}

function deinitQrCodeScanner() {
    qrScanner.stop();
    qrScanner = null;
}

function getHtmlCodeForQrScanner () {
    return "<video" + 
        " style='width: 100%; min-height: 150px; height: 100%; background: #241;' " + // TODO: Move style to class.
        " id='" + QRCODE_VIDEO_ID + "'></video>";
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