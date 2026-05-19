const sportsEvents = [
  {
    id: "EVT101",
    name: "100m Sprint",
    category: "Track - Individual",
    dateTime: "25 June 2026, 9:00 AM",
    venue: "Main Athletic Track",
    fee: "Rs. 50",
    status: "Open",
    participationMode: "Individual",
    image: "images/sportseventimages/sprint.svg"
  },
  {
    id: "EVT102",
    name: "Football",
    category: "Team",
    dateTime: "25 June 2026, 2:00 PM",
    venue: "College Football Ground",
    fee: "Rs. 300",
    status: "Open",
    participationMode: "Team",
    image: "images/sportseventimages/football.svg"
  },
  {
    id: "EVT103",
    name: "Basketball",
    category: "Team",
    dateTime: "26 June 2026, 10:00 AM",
    venue: "Indoor Court",
    fee: "Rs. 250",
    status: "Open",
    participationMode: "Team",
    image: "images/sportseventimages/basketball.svg"
  },
  {
    id: "EVT104",
    name: "Badminton Singles",
    category: "Indoor - Individual",
    dateTime: "26 June 2026, 1:00 PM",
    venue: "Sports Complex",
    fee: "Rs. 80",
    status: "Closed",
    participationMode: "Individual",
    image: "images/sportseventimages/badminton.svg"
  },
  {
    id: "EVT105",
    name: "Volleyball",
    category: "Team",
    dateTime: "27 June 2026, 9:30 AM",
    venue: "Outdoor Volleyball Court",
    fee: "Rs. 240",
    status: "Open",
    participationMode: "Team",
    image: "images/sportseventimages/volleyball.svg"
  },
  {
    id: "EVT106",
    name: "Chess",
    category: "Indoor - Individual",
    dateTime: "27 June 2026, 11:00 AM",
    venue: "Seminar Hall",
    fee: "Rs. 40",
    status: "Closed",
    participationMode: "Individual",
    image: "images/sportseventimages/chess.svg"
  }
];

const participants = [];
const feedbackEntries = [];
const closedEventParticipationCount = 25;

document.addEventListener("DOMContentLoaded", () => {
  startClock();
  setupSportsPage();
  setupRegisterPage();
  setupFeedbackPage();
});

function startClock() {
  const dateTarget = document.getElementById("currentDateTime");
  if (!dateTarget) {
    return;
  }

  const updateDateTime = () => {
    const now = new Date();
    dateTarget.textContent = now.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  updateDateTime();
  setInterval(updateDateTime, 1000);
}

function setupSportsPage() {
  const eventsGrid = document.getElementById("eventsGrid");

  if (!eventsGrid) {
    return;
  }

  sportsEvents.forEach((event) => {
    const registerAction = event.status === "Open"
      ? `<a class="small-button" href="register.html?event=${encodeURIComponent(event.name)}">Register</a>`
      : "";

    const card = document.createElement("article");
    card.className = `event-card ${event.participationMode.toLowerCase()}-event`;
    card.innerHTML = `
      <img class="event-image" src="${event.image}" alt="${event.name} event image">
      <div class="event-card-body">
        <div class="event-card-top">
          <span class="event-id">${event.id}</span>
          <span class="status ${event.status.toLowerCase()}">${event.status}</span>
        </div>
        <h3>${event.name}</h3>
        <p class="event-category">${event.category} | ${event.participationMode}</p>
        <dl class="event-details">
          <div><dt>Date & Time</dt><dd>${event.dateTime}</dd></div>
          <div><dt>Venue</dt><dd>${event.venue}</dd></div>
          <div><dt>Fee</dt><dd>${event.fee}</dd></div>
        </dl>
        <div class="event-card-actions">
          ${registerAction}
          ${event.status === "Closed" ? `<span class="muted">Registration closed</span>` : ""}
        </div>
      </div>
    `;
    eventsGrid.appendChild(card);
  });
}

function setupRegisterPage() {
  const eventSelect = document.getElementById("eventSelection");
  const form = document.getElementById("participationForm");

  if (!eventSelect || !form) {
    return;
  }

  sportsEvents
    .filter((event) => event.status === "Open")
    .forEach((event) => {
    const option = document.createElement("option");
    option.value = event.name;
    option.dataset.status = event.status;
    option.dataset.mode = event.participationMode;
    option.textContent = event.name;
    eventSelect.appendChild(option);
  });

  const selectedEvent = new URLSearchParams(window.location.search).get("event");
  if (selectedEvent && sportsEvents.some((event) => event.name === selectedEvent && event.status === "Open")) {
    eventSelect.value = selectedEvent;
  }

  eventSelect.addEventListener("change", updateParticipationOptions);
  form.participationType.addEventListener("change", updateTeamFields);
  updateParticipationOptions();
  renderParticipants();
  form.addEventListener("submit", handleParticipationSubmit);
}

function updateParticipationOptions() {
  const form = document.getElementById("participationForm");
  if (!form) {
    return;
  }

  const mode = form.eventSelection.selectedOptions[0]?.dataset.mode || "";
  const typeSelect = form.participationType;
  typeSelect.innerHTML = '<option value="">Select type</option>';

  if (mode) {
    const option = document.createElement("option");
    option.value = mode;
    option.textContent = mode;
    typeSelect.appendChild(option);
    typeSelect.value = mode;
  }

  typeSelect.disabled = !mode;
  updateTeamFields();
}

function updateTeamFields() {
  const form = document.getElementById("participationForm");
  if (!form) {
    return;
  }

  const isTeam = form.participationType.value === "Team";
  document.querySelectorAll(".team-only").forEach((field) => {
    field.classList.toggle("hidden", !isTeam);
  });

  if (!isTeam) {
    form.teamName.value = "";
    form.teamMembers.value = "";
    setError("teamNameError", "");
    setError("teamMembersError", "");
  }
}

function handleParticipationSubmit(event) {
  event.preventDefault();
  clearErrors();

  const form = event.currentTarget;
  const data = {
    studentName: form.studentName.value.trim(),
    registerNumber: form.registerNumber.value.trim().toUpperCase(),
    email: form.email.value.trim(),
    mobile: form.mobile.value.trim(),
    department: form.department.value,
    year: form.year.value,
    eventName: form.eventSelection.value,
    eventStatus: form.eventSelection.selectedOptions[0]?.dataset.status || "",
    eventMode: form.eventSelection.selectedOptions[0]?.dataset.mode || "",
    participationType: form.participationType.value,
    teamName: form.teamName.value.trim(),
    teamMembers: form.teamMembers.value.trim()
  };

  let valid = true;

  if (!/^[A-Za-z ]{3,}$/.test(data.studentName)) {
    setError("studentNameError", "Enter a valid student name.");
    valid = false;
  }

  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email)) {
    setError("emailError", "Enter a valid email address.");
    valid = false;
  }

  if (!/^\d{10}$/.test(data.mobile)) {
    setError("mobileError", "Mobile number must contain exactly 10 digits.");
    valid = false;
  }

  if (!isValidRegisterNumber(data.registerNumber)) {
    setError("registerNumberError", "Use register number format BL.AI.U4AID24054.");
    valid = false;
  }

  if (!data.department) {
    setError("departmentError", "Select department.");
    valid = false;
  }

  if (!data.year) {
    setError("yearError", "Select year of study.");
    valid = false;
  }

  if (!data.eventName) {
    setError("eventSelectionError", "Select an event.");
    valid = false;
  } else if (data.eventStatus === "Closed") {
    setError("eventSelectionError", "This event is closed for participation.");
    valid = false;
  }

  if (!data.participationType) {
    setError("participationTypeError", "Select participation type.");
    valid = false;
  } else if (data.eventMode && data.participationType !== data.eventMode) {
    setError("participationTypeError", `${data.eventName} allows ${data.eventMode} participation only.`);
    valid = false;
  }

  if (data.participationType === "Team") {
    const memberCount = Number(data.teamMembers);
    if (!data.teamName) {
      setError("teamNameError", "Team name is required for team participation.");
      valid = false;
    }
    if (!Number.isInteger(memberCount) || memberCount < 2 || memberCount > 6) {
      setError("teamMembersError", "Team size must be between 2 and 6.");
      valid = false;
    }
  }

  const duplicate = participants.some((entry) => {
    return entry.registerNumber === data.registerNumber && entry.eventName === data.eventName;
  });

  if (duplicate) {
    setError("registerNumberError", "This register number is already entered for the selected event.");
    setError("eventSelectionError", "Duplicate participation is not allowed.");
    valid = false;
  }

  if (!valid) {
    showMessage("participationMessage", "Please correct the highlighted fields.", "error-message");
    return;
  }

  participants.push(data);
  renderParticipants();
  showMessage("participationMessage", "Participation entry submitted successfully.", "success");
  flashRegistrationForm(form);
  form.reset();
  updateParticipationOptions();
}

function renderParticipants() {
  const countTarget = document.getElementById("participationCount");
  const detailsTarget = document.getElementById("participantDetails");

  countTarget.textContent = participants.length;
  detailsTarget.innerHTML = "";
  renderEventParticipationCounts();

  if (!participants.length) {
    detailsTarget.innerHTML = '<p class="muted">Successful entries will appear here.</p>';
    return;
  }

  participants.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "detail-item";
    item.innerHTML = `
      <h3>${entry.studentName}</h3>
      <p><strong>Register No:</strong> ${entry.registerNumber}</p>
      <p><strong>Event:</strong> ${entry.eventName}</p>
      <p><strong>Type:</strong> ${entry.participationType}${entry.teamName ? ` - ${entry.teamName}` : ""}</p>
      <p><strong>Department:</strong> ${entry.department}, ${entry.year}</p>
    `;
    detailsTarget.prepend(item);
  });
}

function renderEventParticipationCounts() {
  const countList = document.getElementById("eventParticipationCounts");
  if (!countList) {
    return;
  }

  countList.innerHTML = "";

  sportsEvents.forEach((event) => {
    const submittedCount = participants.filter((entry) => entry.eventName === event.name).length;
    const count = event.status === "Closed" ? closedEventParticipationCount : submittedCount;
    const item = document.createElement("article");
    item.className = "count-item";
    item.innerHTML = `
      <span>${event.name}</span>
      <strong>${count}</strong>
    `;
    countList.appendChild(item);
  });
}

function flashRegistrationForm(form) {
  form.classList.remove("success-flash");
  void form.offsetWidth;
  form.classList.add("success-flash");
}

function setupFeedbackPage() {
  const feedbackSelect = document.getElementById("feedbackEvent");
  const form = document.getElementById("feedbackForm");

  if (!feedbackSelect || !form) {
    return;
  }

  sportsEvents.forEach((event) => {
    const option = document.createElement("option");
    option.value = event.name;
    option.textContent = event.name;
    feedbackSelect.appendChild(option);
  });

  form.addEventListener("submit", handleFeedbackSubmit);
}

function handleFeedbackSubmit(event) {
  event.preventDefault();
  clearErrors();

  const form = event.currentTarget;
  const data = {
    name: form.feedbackName.value.trim(),
    registerNumber: form.feedbackRegister.value.trim().toUpperCase(),
    eventName: form.feedbackEvent.value,
    rating: Number(form.rating.value),
    comments: form.comments.value.trim()
  };

  let valid = true;

  if (!/^[A-Za-z ]{3,}$/.test(data.name)) {
    setError("feedbackNameError", "Enter a valid student name.");
    valid = false;
  }

  if (!isValidRegisterNumber(data.registerNumber)) {
    setError("feedbackRegisterError", "Use register number format BL.AI.U4AID24054.");
    valid = false;
  }

  if (!data.eventName) {
    setError("feedbackEventError", "Select the event attended.");
    valid = false;
  }

  if (!data.rating) {
    setError("ratingError", "Select a rating from 1 to 5.");
    valid = false;
  }

  if (data.comments.length < 20) {
    setError("commentsError", "Comments must contain at least 20 characters.");
    valid = false;
  }

  if (!valid) {
    showMessage("feedbackMessage", "Please correct the highlighted fields.", "error-message");
    return;
  }

  feedbackEntries.push(data);
  renderFeedback();
  showMessage("feedbackMessage", "Feedback submitted successfully.", "success");
  form.reset();
}

function renderFeedback() {
  const countTarget = document.getElementById("feedbackCount");
  const averageTarget = document.getElementById("averageRating");
  const summaryTarget = document.getElementById("feedbackSummary");

  const totalRating = feedbackEntries.reduce((sum, entry) => sum + entry.rating, 0);
  const average = feedbackEntries.length ? totalRating / feedbackEntries.length : 0;

  countTarget.textContent = feedbackEntries.length;
  averageTarget.textContent = average.toFixed(1);
  summaryTarget.innerHTML = "";

  sportsEvents.forEach((event) => {
    const eventFeedback = feedbackEntries.filter((entry) => entry.eventName === event.name);
    if (!eventFeedback.length) {
      return;
    }

    const eventTotal = eventFeedback.reduce((sum, entry) => sum + entry.rating, 0);
    const eventAverage = eventTotal / eventFeedback.length;
    const latestComment = eventFeedback[eventFeedback.length - 1].comments;
    const item = document.createElement("article");
    item.className = "detail-item";
    item.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Average Rating:</strong> ${eventAverage.toFixed(1)} / 5</p>
      <p><strong>Total Feedback:</strong> ${eventFeedback.length}</p>
      <p><strong>Latest Comment:</strong> ${latestComment}</p>
    `;
    summaryTarget.appendChild(item);
  });
}

function isValidRegisterNumber(value) {
  return /^BL\.[A-Z]{2}\.[A-Z0-9]{10}$/.test(value);
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((target) => {
    target.textContent = "";
  });
}

function setError(id, message) {
  const target = document.getElementById(id);
  if (target) {
    target.textContent = message;
  }
}

function showMessage(id, message, className) {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  target.className = `banner-message ${className}`;
  target.textContent = message;
}
