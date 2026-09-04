## Car Fleet Tracker

A single-page web app for managing a small car fleet. Users can add, edit, and delete cars (model, year, MPG) through a form, and the server maintains the dataset in memory, computing two derived fields — an efficiency rating and an age category — for every car before it's stored. The client always reflects the latest state returned by the server after every action.

CSS layout uses **flexbox** (`main` lays the form and table panels side by side and wraps them on narrow screens).


## Technical Achievements
- **Single-page app with live server sync**: The form for adding/editing cars and the results table both live on `index.html` ([public/index.html](public/index.html)). Every form submission (`POST /cars` or `PUT /cars/:id`) and every delete (`DELETE /cars/:id`) receives the server's full, freshly-recomputed dataset in the response, and the client ([public/js/main.js](public/js/main.js)) re-renders the table from that response — the page never reloads and the table is never updated optimistically from client-only data. This was tricky to get right with the raw `http` module rather than Express: routes needed to be split manually by both HTTP method and URL path (e.g. distinguishing `PUT /cars/:id` from `POST /cars`), and the derived-field logic had to be centralized in one `addDerivedFields` function ([server.js](server.js)) so add and edit paths stay consistent.
- **Full edit/update support (5 pts)**: Beyond add and delete, clicking "Edit" on a row populates the form with that car's data and switches the app into an editing mode (tracked via `state.editingId` in [public/js/main.js](public/js/main.js)); submitting then sends a `PUT /cars/:id` instead of a `POST /cars`. The server ([server.js](server.js)) implements a `PUT` handler that replaces the matching car by id and recomputes its derived fields, since editing the MPG or year must also update the efficiency rating and age category rather than leaving stale derived data behind.

## Derived Fields
Every car stored on the server has two fields computed from data already present on the row:
- `efficiency` — "Excellent" / "Good" / "Poor", derived from `mpg`
- `ageCategory` — "Classic" / "Modern", derived from `year`

## AI Usage
AI was used to create this readme based off of the code. I checked to make sure the created readme was accurate to the code before submission.