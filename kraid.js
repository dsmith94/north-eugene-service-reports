
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


function sendMail(name, month, address, body)
{
    /*
    Email.send({
        Host : "smtp.gmail.com",
        Username : "north.eugene.service.time",
        Password : "lalalalalalalalalalalalalalalala981!",
        To : address,
        From : name,
        Subject : `Service time for ${name} for ${month}`,
        Body : body
        }).then(
            message => alert(message)
    );
    */
   window.open(`mailto:${address}?subject=${name} Field Service Report&body=${body}`);
}


function saveData(email, name, placements, videos, hours, rvs, studies, comments)
{
    const d = new Date();
    const m = d.getMonth() - 1;
    const y = getYear();
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("placements", placements.toString());
    localStorage.setItem("videos", videos.toString());
    localStorage.setItem("hours", hours.toString());
    localStorage.setItem("rvs", rvs.toString());
    localStorage.setItem("studies", studies.toString());
    localStorage.setItem("comments", comments);
    localStorage.setItem("month", m.toString());
    localStorage.setItem("year", y.toString());
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


function populateData(email, name, placements, videos, hours, rvs, studies, comments)
{
    if (email.value) {
        setElement("email", email.value);
    }
    if (name.value) {
        setElement("name", name.value);
    }
    setElement("placements", placements.value);
    setElement("videos", videos.value);
    setElement("hours", hours.value);
    setElement("rvs", rvs.value);
    setElement("studies", studies.value);
    if (comments.value) {
        setElement("comments", comments.value);
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
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const placements = parseInt(localStorage.getItem("placements"));
    const videos = parseInt(localStorage.getItem("videos"));
    const hours = parseInt(localStorage.getItem("hours"));
    const rvs = parseInt(localStorage.getItem("rvs"));
    const studies = parseInt(localStorage.getItem("studies"));
    const comments = localStorage.getItem("comments");
    populateData(email, name, placements, videos, hours, rvs, studies, comments);
    const storedMonth = parseInt(localStorage.getItem("month"));
    const storedYear = parseInt(localStorage.getItem("year"));
    if (storedMonth === m && storedYear === y) {
        setAlertText(`Report submitted for ${getMonthName(m)} ${y}`);
    }
}


function makeReport(month, year, placements, videos, hours, rvs, studies, comments)
{
    return encodeURIComponent(`
For ${getMonthName(month)} ${year}:\r\n
Placements (Printed and Electronic): ${placements}\r\n
Video Showings: ${videos}\r\n
Hours: ${hours}\r\n
Return Visits: ${rvs}\r\n
Number of Different Bible Studies Conducted: ${studies}\r\n
Comments: ${comments}\r\n
    `);
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
    const name = getElement("name");
    const placements = getElement("placements");
    const videos = getElement("videos");
    const hours = getElement("hours");
    const rvs = getElement("rvs");
    const studies = getElement("studies");
    const comments = getElement("comments");
    const month = d.getMonth() - 1;
    const year = getYear();
    if (!email.value || email.value === "overseer@email.com") {
        setAlertText("Must enter a valid email address for Service Group Overseer.");
        return;
    }
    if (!name.value || name.value === "Your name") {
        setAlertText("Please include your name.");
        return;
    }
    saveData(email.value, name.value, placements.value, videos.value, hours.value, rvs.value, studies.value, comments.value);
    const r = makeReport(month, year, placements.value, videos.value, hours.value, rvs.value, studies.value, comments.value);
    sendMail(name.value, getMonthName(month), email.value, r);
    setAlertText(`Report submitted for ${getMonthName(month)} ${year}`);
}

window.onload = function()
{
    postLoad();
};
