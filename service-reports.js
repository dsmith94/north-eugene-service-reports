
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
   window.open(`mailto:${email}&cc=${secretary_email}?subject=${name} Field Service Report ${month}&enctype="text/plain"&body=${body}`);
}


function saveData(email, secretary_email, name, placements, videos, hours, rvs, studies, comments, gmail)
{
    const d = new Date();
    const m = d.getMonth() - 1;
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
    window.localStorage.setItem("month", m.toString());
    window.localStorage.setItem("year", y.toString());
    window.localStorage.setItem("gmail", gmail.toString());
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


function populateData(email, secretary_email, name, placements, videos, hours, rvs, studies, comments, gmail)
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
    const gmail_checkbox = document.getElementById("gmail");
    if (gmail_checkbox) {
        gmail_checkbox.checked = gmail;
    }
}


function postLoad()
{
    const e = getElement("headerText");
    const d = new Date();
    const m = d.getMonth() - 1;
    const y = getYear();
    if (e) {
        e.textContent = `North Eugene Field Service Report: ${getMonthName(m)} ${y}`
    }
    const email = window.localStorage.getItem("email");
    const name = window.localStorage.getItem("name");
    const secretary_email = window.localStorage.getItem("secretary_email");
    const placements = parseInt(window.localStorage.getItem("placements"));
    const videos = parseInt(window.localStorage.getItem("videos"));
    const hours = parseInt(window.localStorage.getItem("hours"));
    const rvs = parseInt(window.localStorage.getItem("rvs"));
    const studies = parseInt(window.localStorage.getItem("studies"));
    const comments = window.localStorage.getItem("comments");
    const gmail = (window.localStorage.getItem("gmail") === "true");
    populateData(email, secretary_email, name, placements, videos, hours, rvs, studies, comments, gmail);
    const storedMonth = parseInt(window.localStorage.getItem("month"));
    const storedYear = parseInt(window.localStorage.getItem("year"));
    if (storedMonth === m && storedYear === y) {
        setAlertText(`Report submitted for ${getMonthName(m)} ${y}`);
    }
}


function makeReport(month, year, placements, videos, hours, rvs, studies, comments, gmail)
{
    const newline = (gmail ? "\n" : "<br>");
    var s = `
    For ${getMonthName(month)} ${year}:${newline}
    
    Placements (Printed and Electronic): ${placements}${newline}
    
    Video Showings: ${videos}${newline}
    
    Hours: ${hours}${newline}
    
    Return Visits: ${rvs}${newline}
    
    Number of Different Bible Studies Conducted: ${studies}${newline}
    
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
    const gmail = getElement("gmail");
    const month = d.getMonth() - 1;
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
    saveData(email.value, secretary_email.value, name.value, placements.value, videos.value, hours.value, rvs.value, studies.value, comments.value, gmail.checked);
    const r = makeReport(month, year, placements.value, videos.value, hours.value, rvs.value, studies.value, comments.value, gmail.checked);
    sendMail(name.value, getMonthName(month), email.value, secretary_email.value, r);
    setAlertText(`Report submitted for ${getMonthName(month)} ${year}`);
}


window.onload = function()
{
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('service-worker.js')
              .then((reg) => {
                console.log('Service worker registered.', reg);
              });
        });
    }
    postLoad();
};
