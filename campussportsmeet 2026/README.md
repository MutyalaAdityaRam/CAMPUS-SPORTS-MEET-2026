# Campus Sports Meet 2026

Campus Sports Meet 2026 is a simple browser-based frontend web application developed using HTML, CSS3, and JavaScript. It displays sports event details, collects student participation entries, validates form data, prevents duplicate entries during the current page session, and collects feedback after events.

This project does not use backend programming, database, or local storage. It runs directly in a browser.

## Project Files

```text
campussportsmeet 2026/
  index.html
  sports.html
  register.html
  feedback.html
  style.css
  script.js
  images/
    banner.jpg
    logo.svg
    sportseventimages/
```

## Page Navigation

All pages contain a common navigation menu.

- `Home` opens `index.html`
- `Sports Events` opens `sports.html`
- `Register` opens `register.html`
- `Feedback` opens `feedback.html`

The navigation bar is placed inside the `<header>` section and is styled using the common external CSS file `style.css`.

## Home Page

File: `index.html`

The home page includes:

- Sports meet title
- Banner image
- Short introduction about the sports meet
- Important announcements
- Current date and time using JavaScript
- Footer with department and contact details

The current date and time is displayed using the `startClock()` function in `script.js`.

## Sports Event Display

File: `sports.html`

The sports event page displays sports events dynamically using JavaScript. Event data is stored in the `sportsEvents` array inside `script.js`.

Each event displays:

- Event ID
- Event name
- Category
- Date and time
- Venue
- Participation fee
- Status: Open or Closed
- Event image
- Register button for open events only

Closed events do not show the Register button.

## Registration Page

File: `register.html`

The participation form collects:

- Student name
- Register number
- Email ID
- Mobile number
- Department
- Year of study
- Event selection
- Participation type
- Team name
- Number of team members

Only open events are shown in the registration form event dropdown.

## Form Validation

Registration form validation is handled in `handleParticipationSubmit()` inside `script.js`.

The validation checks:

- Student name must contain valid alphabets and spaces
- Register number must follow the required format, for example `BL.AI.U4AID24054`
- Email must be in valid email format
- Mobile number must contain exactly 10 digits
- Department must be selected
- Year of study must be selected
- Event must be selected
- Closed events cannot be registered
- Participation type must be selected
- Team size must be between 2 and 6 for team events
- Team name is required for team events

Error messages are displayed near the fields using `<span class="error">`.

## Team Field Condition

The team fields are shown only when the selected event is a team event.

For individual sports:

- Only `Individual` participation type is available
- Team name is hidden
- Number of team members is hidden

For team sports:

- Only `Team` participation type is available
- Team name is shown
- Number of team members is shown

This condition is controlled by:

```javascript
updateParticipationOptions();
updateTeamFields();
```

## Successful Participation Entry

After successful registration:

- A success banner message is shown
- The form container blinks once in green
- Participant details are displayed dynamically
- Total participation count is updated
- Event-wise participation count is updated separately
- The form is cleared

The successful entries are stored temporarily in a JavaScript array named `participants`.

## Event-wise Participation Count

The registration summary displays participation count separately for each sports event.

For open events:

- The count starts from `0`
- The count increases whenever a successful registration is submitted for that event

For closed events:

- The count is shown as `25`
- The closed event count does not change because registration is not allowed for closed events

This event-wise count is displayed using the `renderEventParticipationCounts()` function in `script.js`.

Example:

```javascript
const count = event.status === "Closed" ? closedEventParticipationCount : submittedCount;
```

Here, `closedEventParticipationCount` is set to `25`.

## Duplicate Entry Prevention

Duplicate participation is prevented using register number and event name.

If the same register number tries to register again for the same event, the application displays an error message and stops submission.

Example logic:

```javascript
const duplicate = participants.some((entry) => {
  return entry.registerNumber === data.registerNumber && entry.eventName === data.eventName;
});
```

This duplicate check works during the current browser page session because no database or local storage is used.

## Feedback Submission

File: `feedback.html`

The feedback form collects:

- Student name
- Register number
- Event attended
- Rating from 1 to 5
- Comments

Feedback validation checks:

- Student name must be valid
- Register number must follow the required format
- Event must be selected
- Rating must be selected
- Comments must contain at least 20 characters

After successful submission:

- A success banner message is shown
- Feedback count is updated
- Event-wise average rating is displayed
- Overall average rating is displayed
- The form is cleared

## Average Rating Display

Average rating is calculated in `renderFeedback()` inside `script.js`.

The application displays:

- Overall average rating for all submitted feedback
- Separate average rating for each event
- Total feedback count for each event
- Latest comment for each event

Overall average rating formula:

```javascript
const totalRating = feedbackEntries.reduce((sum, entry) => sum + entry.rating, 0);
const average = feedbackEntries.length ? totalRating / feedbackEntries.length : 0;
```

Event-wise average is calculated by filtering feedback entries based on event name.

## Responsive Design

The app is fully responsive using CSS grid, flexbox, and media queries.

Responsive features include:

- Navigation adjusts on small screens
- Sports event cards change from 3 columns to 2 columns and then 1 column
- Forms become single-column on mobile screens
- Buttons and cards have smooth transitions
- Footer remains at the bottom of the page

Media queries are written in `style.css` using:

```css
@media (max-width: 760px) {
  /* mobile layout */
}
```

## Syntax Explanation

### HTML Syntax

HTML is used to create the structure of the web pages.

Example:

```html
<form id="participationForm" class="form-card" novalidate>
  <input type="text" id="studentName" name="studentName">
</form>
```

- `<form>` creates a form
- `id` is used by JavaScript to select the element
- `class` is used by CSS for styling
- `novalidate` disables default browser validation so custom JavaScript validation can be used

### CSS Syntax

CSS is used to style the application.

Example:

```css
.primary-button {
  background: var(--primary);
  color: #ffffff;
  transition: background 180ms ease, transform 180ms ease;
}
```

- `.primary-button` selects elements with that class
- `background` sets the button color
- `transition` creates smooth animation effects

### JavaScript Syntax

JavaScript is used for dynamic behavior and validation.

Example:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  setupSportsPage();
  setupRegisterPage();
  setupFeedbackPage();
});
```

- `document.addEventListener()` runs code after the page loads
- Arrow function `() => {}` defines a function
- Functions are called based on which page is currently open

Example array:

```javascript
const participants = [];
```

This array stores successful participation entries temporarily.

Example condition:

```javascript
if (!data.eventName) {
  setError("eventSelectionError", "Select an event.");
}
```

This checks whether the event was selected or not.

## Working Flow

1. User opens `index.html`.
2. Home page displays title, banner, announcements, and live date/time.
3. User clicks `Sports Events`.
4. `sports.html` displays all sports events as cards.
5. Open events show a Register button.
6. User clicks Register for an open event.
7. `register.html` opens and preselects the selected event.
8. JavaScript checks whether the event is individual or team.
9. For team events, team name and team members fields are shown.
10. User fills the registration form and submits it.
11. JavaScript validates all fields.
12. If valid, success banner appears, form blinks green, participant details are displayed, and total count is updated.
13. If duplicate entry is found, registration is stopped and an error is shown.
14. Event-wise participation count is updated for the selected event.
15. Closed events continue to show a fixed participation count of `25`.
16. User opens `feedback.html`.
17. User submits feedback with rating and comments.
18. JavaScript validates feedback details.
19. If valid, success banner appears.
20. Event-wise average rating and overall average rating are updated.

## Demo Points for Viva

- Show common navigation on all pages.
- Show home page live date and time.
- Open sports page and explain dynamic event display.
- Show that closed events do not have Register buttons.
- Click Register for an individual event and show only Individual option.
- Click Register for a team event and show Team fields.
- Submit invalid form and show validation messages.
- Submit valid form and show success banner, green blink, participant details, and count update.
- Show event-wise participation count for each event.
- Explain that closed events show `25` participants and do not allow new registration.
- Try same register number for same event and explain duplicate prevention.
- Submit feedback and show event-wise average rating.
- Submit feedback for multiple events and show overall average rating.
- Resize browser or use mobile view to show responsive design.

## Limitations

- Data is not permanently saved.
- Entries are stored only in JavaScript arrays during the current browser session.
- Refreshing the page clears the submitted entries because local storage and database are not used.
