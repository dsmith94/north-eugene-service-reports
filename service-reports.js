
var deferredPrompt;

function getYear()
{
    const d = new Date();
    const m = d.getMonth();
    const y = d.getFullYear();
    if (m === 0) {
        return y - 1;
    }
    return y;
}

function getMonthName(month)
{
    switch (month)
    {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        default:
            return "December"
    }
}


function sendMail(name, month, email, secretary_email, body)
{
   window.open(`mailto:${email}?cc=${secretary_email}&subject=${name} Field Service Report ${month}&enctype="application/x-www-form-urlencoded"&body=${body}`);
}


function saveData(email, secretary_email, name, month, placements, videos, hours, rvs, studies, comments)
{
    const d = new Date();
    const y = getYear();
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("secretary_email", secretary_email);
    window.localStorage.setItem("name", name);
    window.localStorage.setItem("placements", placements.toString());
    window.localStorage.setItem("videos", videos.toString());
    window.localStorage.setItem("hours", hours.toString());
    window.localStorage.setItem("rvs", rvs.toString());
    window.localStorage.setItem("studies", studies.toString());
    window.localStorage.setItem("comments", comments);
    window.localStorage.setItem("month", month.toString());
    window.localStorage.setItem("year", y.toString());
}


function setElement(id, data)
{
    const e = document.getElementById(id);
    if (e && data) {
        e.value = data;
    }
}


function getElement(id)
{
    const e = document.getElementById(id);
    if (e) {
        return e;
    }
    return null;
}


function populateData(email, secretary_email, name, placements, videos, hours, rvs, studies, comments)
{
    if (email) {
        setElement("email", email);
    }
    if (secretary_email) {
        setElement("secretary-email", secretary_email);
    }
    if (name) {
        setElement("name", name);
    }
    setElement("placements", placements);
    setElement("videos", videos);
    setElement("hours", hours);
    setElement("rvs", rvs);
    setElement("studies", studies);
    if (comments) {
        setElement("comments", comments);
    }
}


function postLoad()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const overseerAddress = urlParams.get('fsgo');
    const secretaryAddress = urlParams.get('sec');
    const monthSelect = getElement("month");
    const e = getElement("headerText");
    const d = new Date();
    const m = d.getMonth() - 1;
    const y = getYear();
    if (e) {
        e.textContent = `North Eugene Field Service Report`
    }
    if (m > -1) {
        monthSelect.value = m;
    }
    else {
        monthSelect.value = 11;
    }
    const name = window.localStorage.getItem("name");
    var email = window.localStorage.getItem("email");
    if (overseerAddress) {
        email = overseerAddress;
    }
    var secretaryEmail = window.localStorage.getItem("secretary_email");
    if (secretaryAddress) {
        secretaryEmail = secretaryAddress;
    }
    const placements = parseInt(window.localStorage.getItem("placements"));
    const videos = parseInt(window.localStorage.getItem("videos"));
    const hours = parseInt(window.localStorage.getItem("hours"));
    const rvs = parseInt(window.localStorage.getItem("rvs"));
    const studies = parseInt(window.localStorage.getItem("studies"));
    const comments = window.localStorage.getItem("comments");
    //const gmail = (window.localStorage.getItem("gmail") === "true");
    const gmail = false;
    populateData(email, secretaryEmail, name, placements, videos, hours, rvs, studies, comments);
    const storedMonth = parseInt(window.localStorage.getItem("month"));
    const storedYear = parseInt(window.localStorage.getItem("year"));
    if (storedYear) {
        if (storedMonth === m && storedYear === y) {
            setAlertText(`Report submitted for ${getMonthName(storedMonth)} ${y}`);
        }
    }
}


function handleZero(s)
{
    if (!s) {
        return "0";
    }
    else {
        return s;
    }
}


function makeReport(month, year, placements, videos, hours, rvs, studies, comments)
{
    const newline = "\n";
    var s = `
    For ${getMonthName(month)} ${year}:${newline}
    
    Placements (Printed and Electronic): ${handleZero(placements)}${newline}
    
    Video Showings: ${handleZero(videos)}${newline}
    
    Hours: ${handleZero(hours)}${newline}
    
    Return Visits: ${handleZero(rvs)}${newline}
    
    Number of Different Bible Studies Conducted: ${handleZero(studies)}${newline}
    
    Comments: ${comments}${newline}
    
        `;
    return encodeURIComponent(s);
}


function setAlertText(text)
{
    const a = getElement("alertText");
    if (a) {
        a.textContent = text;
    }
}


function sendReport()
{
    const d = new Date();
    const email = getElement("email");
    const secretary_email = getElement("secretary-email");
    const name = getElement("name");
    const placements = getElement("placements");
    const videos = getElement("videos");
    const hours = getElement("hours");
    const rvs = getElement("rvs");
    const studies = getElement("studies");
    const comments = getElement("comments");
    const monthSelect = getElement("month");
    const month = parseInt(monthSelect.value);
    const year = getYear();
    if (!email.value || email.value === "overseer@email.com") {
        setAlertText("Must enter a valid email address for Service Group Overseer.");
        return;
    }
    if (!secretary_email.value || secretary_email.value === "secretary@email.com") {
        setAlertText("Must enter a valid email address for Congregation Secretary.");
        return;
    }
    if (!name.value || name.value === "Your name") {
        setAlertText("Please include your name.");
        return;
    }
    saveData(email.value, secretary_email.value, name.value, month, placements.value, videos.value, hours.value, rvs.value, studies.value, comments.value);
    const r = makeReport(month, year, placements.value, videos.value, hours.value, rvs.value, studies.value, comments.value);
    sendMail(name.value, getMonthName(month), email.value, secretary_email.value, r);
    setAlertText(`Report submitted for ${getMonthName(month)} ${year}`);
}



/*
function handleBeforeInstall()
{
    const installButton = document.getElementById("install-button");
    console.log("The before install prompt tested here");
    window.addEventListener('beforeinstallprompt', (event) => {
        console.log('👍', 'beforeinstallprompt', event);
        deferredPrompt = event;
        installButton.style.visibility = "visible";
      });
      installButton.addEventListener('click', () => {
        // Show the install prompt.
        deferredPrompt.prompt();
        // Log the result
        deferredPrompt.userChoice.then((result) => {
          console.log('👍', 'userChoice', result);
          // Reset the deferred prompt variable, since
          // prompt() can only be called once.
          deferredPrompt = null;
          // Hide the install button.
          installButton.style.visibility = "hidden";
        });
      });
}
*/


window.onload = function()
{
    /* Only register a service worker if it's supported */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js');
    }
    postLoad();
};

