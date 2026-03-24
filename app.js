const API_BASE = "https://api.aladhan.com/v1";

const cities = [
  { key: "karachi", en: "Karachi", ur: "کراچی" },
  { key: "lahore", en: "Lahore", ur: "لاہور" },
  { key: "islamabad", en: "Islamabad", ur: "اسلام آباد" },
  { key: "rawalpindi", en: "Rawalpindi", ur: "راولپنڈی" },
  { key: "faisalabad", en: "Faisalabad", ur: "فیصل آباد" },
  { key: "multan", en: "Multan", ur: "ملتان" },
  { key: "peshawar", en: "Peshawar", ur: "پشاور" },
  { key: "quetta", en: "Quetta", ur: "کوئٹہ" },
  { key: "sialkot", en: "Sialkot", ur: "سیالکوٹ" },
  { key: "gujranwala", en: "Gujranwala", ur: "گوجرانوالہ" },
  { key: "hyderabad", en: "Hyderabad", ur: "حیدرآباد" },
  { key: "sukkur", en: "Sukkur", ur: "سکھر" },
  { key: "bahawalpur", en: "Bahawalpur", ur: "بہاولپور" }
];

const translations = {
  en: {
    title: "Sahar & Iftar Times",
    subtitle: "Select city, date and fiqh to view daily timings with Hijri + Gregorian dates.",
    theme: "Theme",
    language: "Language",
    city: "City",
    fiqh: "Fiqh",
    year: "Year",
    month: "Month",
    day: "Day",
    hijriAdjust: "Hijri Adjustment",
    gregorianDate: "Gregorian Date",
    hijriDate: "Hijri Date",
    timezone: "Timezone",
    sahar: "Sahar (Fajr)",
    iftar: "Iftar (Maghrib)",
    fastDuration: "Fast Duration",
    countdown: "Countdown",
    noteTitle: "Notes",
    noteBody: "Times are calculated via AlAdhan prayer times API and may differ slightly from local announcements. Always verify with your local mosque.",
    countingToIftar: "Counting down to Iftar",
    countingToSahar: "Counting down to next day's Sahar",
    notToday: "Countdown is shown only for today's date.",
    methodKarachi: "Method: Karachi",
    methodJafari: "Method: Jafari"
  },
  ur: {
    title: "سحری اور افطار اوقات",
    subtitle: "شہر، تاریخ اور فقہ منتخب کریں تاکہ ہجری و گریگورین تاریخ کے ساتھ اوقات دیکھ سکیں۔",
    theme: "تھیم",
    language: "زبان",
    city: "شہر",
    fiqh: "فقہ",
    year: "سال",
    month: "مہینہ",
    day: "دن",
    hijriAdjust: "ہجری ایڈجسٹمنٹ",
    gregorianDate: "گریگورین تاریخ",
    hijriDate: "ہجری تاریخ",
    timezone: "ٹائم زون",
    sahar: "سحری (فجر)",
    iftar: "افطار (مغرب)",
    fastDuration: "روزے کا دورانیہ",
    countdown: "کاؤنٹ ڈاؤن",
    noteTitle: "نوٹ",
    noteBody: "اوقات AlAdhan API کے مطابق ہیں اور مقامی اعلان سے معمولی فرق ہو سکتا ہے۔ اپنے مقامی مسجد سے تصدیق کریں۔",
    countingToIftar: "افطار تک کاؤنٹ ڈاؤن",
    countingToSahar: "اگلے دن کی سحری تک کاؤنٹ ڈاؤن",
    notToday: "کاؤنٹ ڈاؤن صرف آج کی تاریخ کیلئے دکھایا جاتا ہے۔",
    methodKarachi: "طریقہ: کراچی",
    methodJafari: "طریقہ: جعفری"
  }
};

const state = {
  lang: "en",
  theme: "system",
  fiqh: "sunni",
  city: cities[0].key,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  hijriAdjust: 0,
  cache: new Map(),
  countdownTimer: null,
  nextDayData: null
};

const elements = {
  citySelect: document.getElementById("citySelect"),
  fiqhSelect: document.getElementById("fiqhSelect"),
  yearSelect: document.getElementById("yearSelect"),
  monthSelect: document.getElementById("monthSelect"),
  daySelect: document.getElementById("daySelect"),
  hijriAdjust: document.getElementById("hijriAdjust"),
  hijriAdjustValue: document.getElementById("hijriAdjustValue"),
  themeSelect: document.getElementById("themeSelect"),
  langSelect: document.getElementById("langSelect"),
  gregorianDate: document.getElementById("gregorianDate"),
  hijriDate: document.getElementById("hijriDate"),
  weekday: document.getElementById("weekday"),
  hijriWeekday: document.getElementById("hijriWeekday"),
  timezone: document.getElementById("timezone"),
  method: document.getElementById("method"),
  saharTime: document.getElementById("saharTime"),
  iftarTime: document.getElementById("iftarTime"),
  fastDuration: document.getElementById("fastDuration"),
  countdownDisplay: document.getElementById("countdownDisplay"),
  countdownNote: document.getElementById("countdownNote")
};

const monthNamesEn = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthNamesUr = [
  "جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون",
  "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"
];

function init() {
  populateCities();
  populateYears();
  populateMonths();
  populateDays();
  elements.fiqhSelect.value = state.fiqh;
  elements.themeSelect.value = state.theme;
  elements.langSelect.value = state.lang;
  bindEvents();
  applyTranslations();
  loadTimings();
}

function populateCities() {
  elements.citySelect.innerHTML = "";
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city.key;
    option.textContent = state.lang === "ur" ? city.ur : city.en;
    elements.citySelect.appendChild(option);
  });
  elements.citySelect.value = state.city;
}

function populateYears() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1;
  const endYear = currentYear + 1;
  elements.yearSelect.innerHTML = "";

  for (let year = startYear; year <= endYear; year += 1) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    elements.yearSelect.appendChild(option);
  }
  elements.yearSelect.value = state.year;
}

function populateMonths() {
  elements.monthSelect.innerHTML = "";
  const names = state.lang === "ur" ? monthNamesUr : monthNamesEn;
  names.forEach((name, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = name;
    elements.monthSelect.appendChild(option);
  });
  elements.monthSelect.value = state.month;
}

function populateDays() {
  const daysInMonth = new Date(state.year, state.month, 0).getDate();
  elements.daySelect.innerHTML = "";
  for (let day = 1; day <= daysInMonth; day += 1) {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day;
    elements.daySelect.appendChild(option);
  }
  state.day = Math.min(state.day, daysInMonth);
  elements.daySelect.value = state.day;
}

function bindEvents() {
  elements.citySelect.addEventListener("change", () => {
    state.city = elements.citySelect.value;
    loadTimings();
  });

  elements.fiqhSelect.addEventListener("change", () => {
    state.fiqh = elements.fiqhSelect.value;
    loadTimings();
  });

  elements.yearSelect.addEventListener("change", () => {
    state.year = Number(elements.yearSelect.value);
    populateDays();
    loadTimings();
  });

  elements.monthSelect.addEventListener("change", () => {
    state.month = Number(elements.monthSelect.value);
    populateDays();
    loadTimings();
  });

  elements.daySelect.addEventListener("change", () => {
    state.day = Number(elements.daySelect.value);
    loadTimings();
  });

  elements.hijriAdjust.addEventListener("input", () => {
    state.hijriAdjust = Number(elements.hijriAdjust.value);
    elements.hijriAdjustValue.textContent = state.hijriAdjust;
  });

  elements.hijriAdjust.addEventListener("change", () => {
    loadTimings();
  });

  elements.themeSelect.addEventListener("change", () => {
    state.theme = elements.themeSelect.value;
    document.body.setAttribute("data-theme", state.theme);
  });

  elements.langSelect.addEventListener("change", () => {
    state.lang = elements.langSelect.value;
    document.documentElement.lang = state.lang;
    document.body.setAttribute("dir", state.lang === "ur" ? "rtl" : "ltr");
    populateCities();
    populateMonths();
    applyTranslations();
  });
}

function applyTranslations() {
  const dictionary = translations[state.lang];
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.getAttribute("data-i18n");
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });

  const fiqhOptions = elements.fiqhSelect.options;
  fiqhOptions[0].textContent = state.lang === "ur" ? "سنی (حنفی)" : "Sunni (Hanafi)";
  fiqhOptions[1].textContent = state.lang === "ur" ? "جعفری (شیعہ اثنا عشری)" : "Jafari (Shia Ithna-Ashari)";
}

function getCityLabel() {
  const city = cities.find(item => item.key === state.city);
  return state.lang === "ur" ? city.ur : city.en;
}

function getFiqhConfig() {
  if (state.fiqh === "jafari") {
    return { method: 0, school: 0, methodLabel: translations[state.lang].methodJafari };
  }
  return { method: 1, school: 1, methodLabel: translations[state.lang].methodKarachi };
}

async function loadTimings() {
  const cityLabel = getCityLabel();
  const { method, school, methodLabel } = getFiqhConfig();
  const data = await getMonthData(cityLabel, method, school, state.month, state.year, state.hijriAdjust);
  if (!data) return;
  const dayData = data[state.day - 1];
  if (!dayData) return;

  const gregorian = dayData.date.gregorian;
  const timings = dayData.timings;

  const gregorianIso = toIsoDate(gregorian);
  elements.gregorianDate.textContent = `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;
  elements.weekday.textContent = state.lang === "ur" ? gregorian.weekday?.ar : gregorian.weekday?.en;
  elements.timezone.textContent = dayData.meta.timezone;
  elements.method.textContent = methodLabel;

  const fajr = cleanTime(timings.Fajr);
  const maghrib = cleanTime(timings.Maghrib);

  elements.saharTime.textContent = fajr;
  elements.iftarTime.textContent = maghrib;
  elements.fastDuration.textContent = calculateDuration(fajr, maghrib);

  const hijriData = await getAdjustedHijriData(gregorianIso, cityLabel, method, school, state.hijriAdjust);
  setHijriDisplay(hijriData || dayData.date.hijri);

  state.nextDayData = await getNextDayData(data, cityLabel, method, school, state.hijriAdjust);
  updateCountdown(gregorianIso, fajr, maghrib);
}

function cleanTime(value) {
  return value.split(" ")[0];
}

function toIsoDate(gregorian) {
  const month = String(gregorian.month.number).padStart(2, "0");
  const day = String(gregorian.day).padStart(2, "0");
  return `${gregorian.year}-${month}-${day}`;
}

function setHijriDisplay(hijri) {
  elements.hijriDate.textContent = state.lang === "ur"
    ? `${hijri.day} ${hijri.month.ar} ${hijri.year}`
    : `${hijri.day} ${hijri.month.en} ${hijri.year}`;
  elements.hijriWeekday.textContent = state.lang === "ur" ? hijri.weekday?.ar : hijri.weekday?.en;
}

function calculateDuration(startTime, endTime) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const diff = end - start;

  if (diff <= 0) return "—";

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

function parseTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function updateCountdown(gregorianDate, fajrTime, maghribTime) {
  if (state.countdownTimer) {
    clearInterval(state.countdownTimer);
  }

  const selectedDate = new Date(gregorianDate + "T00:00:00");
  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();

  if (!isToday) {
    elements.countdownDisplay.textContent = "—";
    elements.countdownNote.textContent = translations[state.lang].notToday;
    return;
  }

  const update = () => {
    const now = new Date();
    const maghrib = new Date(gregorianDate + "T" + maghribTime + ":00");

    if (now < maghrib) {
      const diff = maghrib - now;
      elements.countdownDisplay.textContent = formatCountdown(diff);
      elements.countdownNote.textContent = translations[state.lang].countingToIftar;
      return;
    }

    const nextDayData = state.nextDayData;
    if (!nextDayData) {
      elements.countdownDisplay.textContent = "—";
      elements.countdownNote.textContent = translations[state.lang].countingToSahar;
      return;
    }

    const nextFajr = cleanTime(nextDayData.timings.Fajr);
    const nextGregorian = toIsoDate(nextDayData.date.gregorian);
    const target = new Date(nextGregorian + "T" + nextFajr + ":00");
    const diff = target - now;

    elements.countdownDisplay.textContent = formatCountdown(diff);
    elements.countdownNote.textContent = translations[state.lang].countingToSahar;
  };

  update();
  state.countdownTimer = setInterval(update, 1000);
}

async function getMonthData(cityLabel, method, school, month, year, adjustment) {
  const cacheKey = `${cityLabel}|${month}|${year}|${method}|${school}|${adjustment}`;

  if (state.cache.has(cacheKey)) {
    return state.cache.get(cacheKey);
  }

  const params = new URLSearchParams({
    city: cityLabel,
    country: "Pakistan",
    method: String(method),
    school: String(school),
    month: String(month),
    year: String(year),
    adjustment: String(adjustment)
  });

  try {
    const response = await fetch(`${API_BASE}/calendarByCity?${params.toString()}`);
    const payload = await response.json();
    if (payload.code !== 200) {
      throw new Error(payload.status || "API error");
    }
    state.cache.set(cacheKey, payload.data);
    return payload.data;
  } catch (error) {
    elements.countdownDisplay.textContent = "—";
    elements.countdownNote.textContent = state.lang === "ur" ? "API سے ڈیٹا حاصل نہیں ہو سکا۔" : "Unable to load data from API.";
    return null;
  }
}

async function getNextDayData(currentMonthData, cityLabel, method, school, adjustment) {
  if (state.day < currentMonthData.length) {
    return currentMonthData[state.day];
  }

  let nextMonth = state.month + 1;
  let nextYear = state.year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  const nextMonthData = await getMonthData(cityLabel, method, school, nextMonth, nextYear, adjustment);
  if (!nextMonthData || nextMonthData.length === 0) return null;
  return nextMonthData[0];
}

async function getAdjustedHijriData(gregorianIso, cityLabel, method, school, adjustment) {
  if (!adjustment) return null;

  const targetDate = new Date(gregorianIso + "T00:00:00");
  targetDate.setDate(targetDate.getDate() + adjustment);

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetIso = targetDate.toISOString().split("T")[0];

  const monthData = await getMonthData(cityLabel, method, school, targetMonth, targetYear, 0);
  if (!monthData) return null;

  const match = monthData.find(item => {
    const itemIso = toIsoDate(item.date.gregorian);
    return itemIso === targetIso;
  });

  return match ? match.date.hijri : null;
}

function formatCountdown(milliseconds) {
  if (milliseconds <= 0) return "0h 0m 0s";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

init();
