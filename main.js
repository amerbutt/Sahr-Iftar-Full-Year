<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Ramadan Timetable 2026</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
    body {
        font-family: "Segoe UI", Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: #f4f7f4;
        color: #2b2b2b;
        transition: background 0.3s, color 0.3s;
    }

    /* Dark Mode */
    body.dark {
        background: #1a1a1a;
        color: #e6e6e6;
    }
    body.dark table {
        background: #222;
        color: #eee;
    }
    body.dark th {
        background: #0f3d0f;
    }

    header {
        text-align: center;
        padding: 25px 10px;
        background: linear-gradient(135deg, #0f3d0f, #1b5e20);
        color: white;
    }

    .crescent {
        font-size: 55px;
        margin-bottom: 10px;
    }

    h1 {
        margin: 0;
        font-size: 28px;
        letter-spacing: 1px;
    }

    #controls {
        text-align: center;
        margin: 15px 0;
    }

    button {
        padding: 8px 14px;
        margin: 5px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background: #1b5e20;
        color: white;
        font-size: 14px;
    }

    button:hover {
        opacity: 0.85;
    }

    #clock, #countdown {
        text-align: center;
        font-size: 20px;
        margin-top: 10px;
        font-weight: bold;
    }

    table {
        width: 95%;
        margin: 20px auto;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
    }

    th, td {
        padding: 10px;
        border: 1px solid #ccc;
        text-align: center;
    }

    th {
        background: #1b5e20;
        color: white;
    }

    tr.highlight {
        background: #fff3cd;
        font-weight: bold;
    }

    /* Urdu font */
    .urdu {
        font-family: "Noto Nastaliq Urdu", serif;
        direction: rtl;
        font-size: 20px;
    }
</style>
</head>

<body>

<header>
    <div class="crescent">🌙</div>
    <h1 id="title">Ramadan Timetable 2026</h1>
</header>

<div id="controls">
    <button onclick="toggleDarkMode()">Dark Mode</button>
    <button onclick="toggleLanguage()">اردو / English</button>
</div>

<div id="clock"></div>
<div id="countdown"></div>

<table id="ramadanTable">
    <thead>
        <tr>
            <!-- English -->
            <th class="en">Day</th>
            <th class="en">Date</th>
            <th class="en">Day Name</th>
            <th class="en">Sehri</th>
            <th class="en">Iftar</th>
            <th class="en">Duration</th>

            <!-- Urdu -->
            <th class="ur" style="display:none">دن</th>
            <th class="ur" style="display:none">تاریخ</th>
            <th class="ur" style="display:none">دن کا نام</th>
            <th class="ur" style="display:none">سحری</th>
            <th class="ur" style="display:none">افطار</th>
            <th class="ur" style="display:none">دورانیہ</th>
        </tr>
    </thead>

    <tbody>
        <!-- Replace with your actual timetable rows -->
        <tr><td>1</td><td>2026-02-19</td><td></td><td>5:24 AM</td><td>5:56 PM</td><td>12:32</td></tr>
        <tr><td>2</td><td>2026-02-20</td><td></td><td>5:23 AM</td><td>5:57 PM</td><td>12:34</td></tr>
        <tr><td>3</td><td>2026-02-21</td><td></td><td>5:22 AM</td><td>5:58 PM</td><td>12:36</td></tr>
        <!-- Continue all 30 days -->
    </tbody>
</table>

<script>
/* Live Clock */
function updateClock() {
    const now = new Date();
    document.getElementById("clock").innerText =
        "Current Time: " + now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

/* Highlight Today */
const today = new Date().toISOString().split('T')[0];
const rows = document.querySelectorAll("#ramadanTable tbody tr");

let todaySehri = null;
let todayIftar = null;

rows.forEach(row => {
    const dateCell = row.children[1].innerText.trim();
    if (dateCell === today) {
        row.classList.add("highlight");
        todaySehri = row.children[3].innerText;
        todayIftar = row.children[4].innerText;
    }
});

/* Add Day Name Automatically */
const dayNamesEn = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const dayNamesUr = ["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"];

rows.forEach(row => {
    const date = row.children[1].innerText.trim();
    const dayNameCell = row.children[2];

    const d = new Date(date);
    const dayIndex = d.getDay();

    dayNameCell.innerText = dayNamesEn[dayIndex];
});

/* Countdown */
function updateCountdown() {
    if (!todaySehri || !todayIftar) {
        document.getElementById("countdown").innerText =
            "Ramadan has not started yet.";
        return;
    }

    const now = new Date();
    const sehriTime = new Date(today + " " + todaySehri);
    const iftarTime = new Date(today + " " + todayIftar);

    let target, label;

    if (now < sehriTime) {
        target = sehriTime;
        label = "Time left for Sehri: ";
    } else if (now < iftarTime) {
        target = iftarTime;
        label = "Time left for Iftar: ";
    } else {
        document.getElementById("countdown").innerText =
            "Today's fasting is complete.";
        return;
    }

    const diff = target - now;
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerText =
        label + `${hrs}h ${mins}m ${secs}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* Dark Mode */
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

/* Urdu / English Toggle */
function toggleLanguage() {
    const en = document.querySelectorAll(".en");
    const ur = document.querySelectorAll(".ur");
    const title = document.getElementById("title");

    const isEnglish = en[0].style.display !== "none";

    if (isEnglish) {
        en.forEach(e => e.style.display = "none");
        ur.forEach(e => e.style.display = "table-cell");

        rows.forEach(row => {
            const date = row.children[1].innerText.trim();
            const d = new Date(date);
            row.children[2].innerText = dayNamesUr[d.getDay()];
        });

        title.innerText = "رمضان المبارک ٹائم ٹیبل 2026";
    } else {
        en.forEach(e => e.style.display = "table-cell");
        ur.forEach(e => e.style.display = "none");

        rows.forEach(row => {
            const date = row.children[1].innerText.trim();
            const d = new Date(date);
            row.children[2].innerText = dayNamesEn[d.getDay()];
        });

        title.innerText = "Ramadan Timetable 2026";
    }
}
</script>

</body>
</html>