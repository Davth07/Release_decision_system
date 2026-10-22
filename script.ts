type TicketStatus = "open" | "testing" | "done";

type Classification =
	| "RELEASE_BLOCKER"
	| "PRIORITY"
	| "UNASSIGNED"
	| "ACTIVE"
	| "DONE";

interface Ticket {
	id: number;
	title: string;
	severity: number;
	status: TicketStatus;
	owner: string | null;
	remainingHours: number;
	customerVip: boolean;
	blocked: boolean;
}

//** Tickets
let tickets: Ticket[] = [
	{
		id: 101,
		title: "Login outage",
		severity: 5,
		status: "open",
		owner: "Ava",
		remainingHours: 6,
		customerVip: true,
		blocked: false,
	},
	{
		id: 102,
		title: "Export slow",
		severity: 3,
		status: "open",
		owner: "Noah",
		remainingHours: 4,
		customerVip: false,
		blocked: false,
	},
	{
		id: 103,
		title: "Payment error",
		severity: 5,
		status: "testing",
		owner: "Ava",
		remainingHours: 9,
		customerVip: true,
		blocked: true,
	},
	{
		id: 104,
		title: "Avatar upload",
		severity: 2,
		status: "done",
		owner: "Mira",
		remainingHours: 3,
		customerVip: false,
		blocked: false,
	},
	{
		id: 105,
		title: "Search ranking",
		severity: 3,
		status: "open",
		owner: "Noah",
		remainingHours: 7,
		customerVip: true,
		blocked: false,
	},
	{
		id: 106,
		title: "Role permissions",
		severity: 4,
		status: "testing",
		owner: "Leo",
		remainingHours: 8,
		customerVip: false,
		blocked: false,
	},
	{
		id: 107,
		title: "Email delay",
		severity: 2,
		status: "open",
		owner: null,
		remainingHours: 2,
		customerVip: true,
		blocked: false,
	},
	{
		id: 108,
		title: "Backup failure",
		severity: 5,
		status: "open",
		owner: "Mira",
		remainingHours: 10,
		customerVip: false,
		blocked: true,
	},
	{
		id: 109,
		title: "Report totals",
		severity: 3,
		status: "done",
		owner: "Leo",
		remainingHours: 5,
		customerVip: false,
		blocked: false,
	},
	{
		id: 110,
		title: "Session timeout",
		severity: 4,
		status: "open",
		owner: "Ava",
		remainingHours: 6,
		customerVip: false,
		blocked: false,
	},
	{
		id: 111,
		title: "Mobile menu",
		severity: 1,
		status: "done",
		owner: "Noah",
		remainingHours: 2,
		customerVip: false,
		blocked: false,
	},
	{
		id: 112,
		title: "Invoice mismatch",
		severity: 4,
		status: "testing",
		owner: null,
		remainingHours: 7,
		customerVip: true,
		blocked: false,
	},
];
function saveTickets(): void {
	localStorage.setItem("tickets", JSON.stringify(tickets));
}
const savedTickets = localStorage.getItem("tickets");

if (savedTickets !== null) {
	tickets = JSON.parse(savedTickets) as Ticket[];
}

//* Checks classification of a ticket
function checkType(ticket: Ticket): Classification {
	if (
		(ticket.blocked && ticket.severity >= 4) ||
		(ticket.status === "open" && ticket.severity === 5)
	) {
		return "RELEASE_BLOCKER";
	} else if (ticket.owner === null && ticket.status !== "done") {
		return "UNASSIGNED";
	} else if (
		ticket.customerVip &&
		ticket.severity >= 3 &&
		ticket.status !== "done"
	) {
		return "PRIORITY";
	} else if (ticket.status === "done") {
		return "DONE";
	}

	return "ACTIVE";
}

//* Find ticket by ID
function findTicket(id: number): Ticket | null {
	for (const ticket of tickets) {
		if (ticket.id === id) {
			return ticket;
		}
	}

	return null;
}

//* Summarizes the important numbers
function getSummary() {
	let blockers = 0;
	let priority = 0;
	let unassigned = 0;
	let active = 0;
	let done = 0;
	let activeHours = 0;

	for (const ticket of tickets) {
		const classification = checkType(ticket);

		if (classification === "RELEASE_BLOCKER") {
			blockers++;
		} else if (classification === "PRIORITY") {
			priority++;
		} else if (classification === "UNASSIGNED") {
			unassigned++;
		} else if (classification === "DONE") {
			done++;
		} else {
			active++;
		}

		if (ticket.status !== "done") {
			activeHours += ticket.remainingHours;
		}
	}

	let decision = "RELEASE";

	if (blockers > 0) {
		decision = "BLOCK";
	} else if (unassigned > 0 || activeHours > 35) {
		decision = "REVIEW";
	}

	return {
		blockers,
		priority,
		unassigned,
		active,
		done,
		activeHours,
		decision,
	};
}

//* Function to show the tickets on the website
function showTickets(ticketArray: Ticket[] = tickets): void {
	const ticketList = document.getElementById("ticketList")!;

	ticketList.innerHTML = "";

	for (const ticket of ticketArray) {
		const button = document.createElement("button");

		button.textContent = ticket.id + " - " + ticket.title;

		button.addEventListener("click", function () {
			showTicketDetails(ticket);
		});

		ticketList.appendChild(button);
		ticketList.appendChild(document.createElement("br"));
	}
}

//* Shows ticket details when clicked. Also has edit and close button
function showTicketDetails(ticket: Ticket): void {
	const details = document.getElementById("ticketDetails")!;

	let owner = ticket.owner;
	if (owner === null) {
		owner = "No owner";
	}

	details.innerHTML = `
    <h2>Ticket</h2>
    <p>ID: ${ticket.id}</p>
    <p>Title: ${ticket.title}</p>
    <p>Severity: ${ticket.severity}</p>
    <p>Status: ${ticket.status}</p>
    <p>Owner: ${owner}</p>
    <p>Remaining hours: ${ticket.remainingHours}</p>
    <p>Customer VIP: ${ticket.customerVip}</p>
    <p>Blocked: ${ticket.blocked}</p>
    <p><b>Classification: ${checkType(ticket)}</b></p>

    <button id="editButton">Edit</button>
    <button id="closeButton">Close</button>
	<button id="deleteButton" style="background-color: red">Delete</button>
  `;

	details.hidden = false;

	const editBtn = document.getElementById("editButton")!;
	editBtn.addEventListener("click", function () {
		editTicket(ticket);
	});

	const closeBtn = document.getElementById("closeButton")!;
	closeBtn.addEventListener("click", function () {
		details.hidden = true;
	});

	//* Delete button (checks if textcontent is confirm delete or delete. if its delete then change to confirm and if confirm then splices the id of ticket.)
	//* Also cancel delete button that is added when clicking delete button as it says "Delete". Then it changes the text content of delete button back to "Delete" from confirm
	const deleteBtn = document.getElementById("deleteButton")!;
	deleteBtn.addEventListener("click", function () {
		if (deleteBtn.textContent === "Delete") {
			deleteBtn.textContent = "Confirm Delete?";

			const cancelDeleteBtn = document.createElement("button");
			cancelDeleteBtn.textContent = "Cancel Delete";
			cancelDeleteBtn.id = "cancelDeleteButton";
			details.appendChild(cancelDeleteBtn);

			cancelDeleteBtn.addEventListener("click", function () {
				deleteBtn.textContent = "Delete";
				cancelDeleteBtn.remove();
			});
		} else {
			let index = -1;

			for (let i = 0; i < tickets.length; i++) {
				if (tickets[i].id === ticket.id) {
					index = i;
					break;
				}
			}
			if (index !== -1) {
				tickets.splice(index, 1);
			}
			saveTickets();

			details.hidden = true;
			details.innerHTML = "";

			updateList();
			showSummary();
		}
	});
}

//* Shows form to edit ticket
function editTicket(ticket: Ticket): void {
	const details = document.getElementById("ticketDetails")!;

	details.innerHTML = `
    <h2>Edit Ticket</h2>

    <p>ID: ${ticket.id}</p>

    <p>Title:</p>
    <input type="text" id="editTitle">

    <p>Severity:</p>
    <select id="editSeverity">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>

    <p>Status:</p>
    <select id="editStatus">
      <option value="open">open</option>
      <option value="testing">testing</option>
      <option value="done">done</option>
    </select>

    <p>Owner:</p>
    <input type="text" id="editOwner">

    <p>Remaining hours:</p>
    <input type="number" id="editHours" min="0">

    <p>Customer VIP:</p>
    <select id="editVip">
      <option value="true">true</option>
      <option value="false">false</option>
    </select>

    <p>Blocked:</p>
    <select id="editBlocked">
      <option value="true">true</option>
      <option value="false">false</option>
    </select>

    <p><b>Classification: ${checkType(ticket)}</b></p>

    <br>

    <button id="saveTicketButton">Save</button>
    <button id="cancelEditButton">Cancel</button>
  `;

	(document.getElementById("editTitle") as HTMLInputElement).value =
		ticket.title;

	(document.getElementById("editSeverity") as HTMLSelectElement).value = String(
		ticket.severity,
	);

	(document.getElementById("editStatus") as HTMLSelectElement).value =
		ticket.status;

	(document.getElementById("editOwner") as HTMLInputElement).value =
		ticket.owner ?? "";

	(document.getElementById("editHours") as HTMLInputElement).value = String(
		ticket.remainingHours,
	);

	(document.getElementById("editVip") as HTMLSelectElement).value = String(
		ticket.customerVip,
	);

	(document.getElementById("editBlocked") as HTMLSelectElement).value = String(
		ticket.blocked,
	);

	const saveTicketBtn = document.getElementById("saveTicketButton")!;

	saveTicketBtn.addEventListener("click", function () {
		saveTicket(ticket);
	});

	const cancelEditBtn = document.getElementById("cancelEditButton")!;
	cancelEditBtn.addEventListener("click", function () {
		showTicketDetails(ticket);
	});
}

//* Saves the edit of the ticket
function saveTicket(ticket: Ticket): void {
	const title = document.getElementById("editTitle") as HTMLInputElement;
	const severity = document.getElementById("editSeverity") as HTMLSelectElement;
	const status = document.getElementById("editStatus") as HTMLSelectElement;
	const owner = document.getElementById("editOwner") as HTMLInputElement;
	const hours = document.getElementById("editHours") as HTMLInputElement;
	const vip = document.getElementById("editVip") as HTMLSelectElement;
	const blocked = document.getElementById("editBlocked") as HTMLSelectElement;

	if (title.value.trim() === "") {
		alert("Enter a title.");
		return;
	}

	if (hours.value === "" || Number(hours.value) < 0) {
		alert("Enter valid remaining hours.");
		return;
	}

	ticket.title = title.value;
	ticket.severity = Number(severity.value);
	ticket.status = status.value as TicketStatus;

	if (owner.value.trim() === "") {
		ticket.owner = null;
	} else {
		ticket.owner = owner.value;
	}

	ticket.remainingHours = Number(hours.value);
	ticket.customerVip = vip.value === "true";
	ticket.blocked = blocked.value === "true";

	saveTickets();

	updateList();
	showTicketDetails(ticket);
	showSummary();
}

//* Shows the summary of all tickets and the release decision.
function showSummary(): void {
	const summary = getSummary();

	const result = document.getElementById("releaseAnalysis")!;

	result.innerHTML = `
        <h2>Release Analysis</h2>
        <p>Total tickets: ${tickets.length}</p>
        <p>Release blockers: ${summary.blockers}</p>
        <p>Priority tickets: ${summary.priority}</p>
        <p>Unassigned tickets: ${summary.unassigned}</p>
        <p>Active tickets: ${summary.active}</p>
        <p>Done tickets: ${summary.done}</p>
        <p>Total active hours: ${summary.activeHours}</p>
        <h3>Release Decision: ${summary.decision}</h3>
    `;
}

//* Searches for ticket by id when search button is pressed
const searchForm = document.getElementById("searchForm")!;
searchForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const input = document.getElementById("searchId") as HTMLInputElement;

	const id = Number(input.value);
	const ticketList = document.getElementById("ticketList")!;
	const details = document.getElementById("ticketDetails")!;

	details.hidden = true;
	details.innerHTML = "";

	if (input.value.trim() === "") {
		showTickets();
		return;
	}
	const ticket = findTicket(id);
	if (ticket === null) {
		ticketList.innerHTML = "<p>No ticket found.</p>";
		return;
	}
	showTickets([ticket]);
});

//* Eventlistener for adding a ticket
const addForm = document.getElementById("addForm")!;

addForm.addEventListener("submit", function (event) {
	event.preventDefault();

	const input = document.getElementById("addTitle") as HTMLInputElement;

	if (input.value.trim() === "") {
		alert("Enter a ticket title");
		return;
	}

	let newId = 101;
	for (const ticket of tickets) {
		if (ticket.id >= newId) {
			newId = ticket.id + 1;
		}
	}
	const newTicket: Ticket = {
		id: newId,
		title: input.value,
		severity: 1,
		status: "open",
		owner: null,
		remainingHours: 0,
		customerVip: false,
		blocked: false,
	};
	input.value = "";

	tickets.push(newTicket);
	saveTickets();
	updateList();
	showSummary();
	showTicketDetails(newTicket);
});

//* Filter tickets function
let currentFilter = "all";
let currentSort = "";
let ascending = true;

function updateList(): void {
	let displayedTickets = [...tickets];
	const filteredTickets: Ticket[] = [];

	for (const ticket of displayedTickets) {
		if (currentFilter === "all") {
			filteredTickets.push(ticket);
		} else if (currentFilter === "open" && ticket.status === "open") {
			filteredTickets.push(ticket);
		} else if (currentFilter === "testing" && ticket.status === "testing") {
			filteredTickets.push(ticket);
		} else if (currentFilter === "done" && ticket.status === "done") {
			filteredTickets.push(ticket);
		} else if (
			currentFilter === "blocker" &&
			checkType(ticket) === "RELEASE_BLOCKER"
		) {
			filteredTickets.push(ticket);
		} else if (
			currentFilter === "priority" &&
			checkType(ticket) === "PRIORITY"
		) {
			filteredTickets.push(ticket);
		} else if (
			currentFilter === "unassigned" &&
			checkType(ticket) === "UNASSIGNED"
		) {
			filteredTickets.push(ticket);
		} else if (currentFilter === "active" && checkType(ticket) === "ACTIVE") {
			filteredTickets.push(ticket);
		} else if (currentFilter === "blocked" && ticket.blocked === true) {
			filteredTickets.push(ticket);
		}
	}

	if (currentSort === "id") {
		filteredTickets.sort(function (a, b) {
			return a.id - b.id;
		});
	} else if (currentSort === "severity") {
		filteredTickets.sort(function (a, b) {
			return a.severity - b.severity;
		});
	} else if (currentSort === "title") {
		filteredTickets.sort(function (a, b) {
			return a.title.localeCompare(b.title);
		});
	} else if (currentSort === "hours") {
		filteredTickets.sort(function (a, b) {
			return a.remainingHours - b.remainingHours;
		});
	}

	if (currentSort !== "" && ascending === false) {
		filteredTickets.reverse();
	}

	showTickets(filteredTickets);
}

//* filter buttons
const allFilter = document.getElementById("allFilter")!;
//status
const testingFilter = document.getElementById("testingFilter")!;
const doneFilter = document.getElementById("doneFilter")!;
const openFilter = document.getElementById("openFilter")!;
// class
const blockerFilter = document.getElementById("blockerFilter")!;
const priorityFilter = document.getElementById("priorityFilter")!;
const unassignedFilter = document.getElementById("unassignedFilter")!;
const activeFilter = document.getElementById("activeFilter")!;
//blocked
const blockedFilter = document.getElementById("blockedFilter")!;

allFilter.addEventListener("click", function () {
	currentFilter = "all";
	updateList();
});
openFilter.addEventListener("click", function () {
	currentFilter = "open";
	updateList();
});
testingFilter.addEventListener("click", function () {
	currentFilter = "testing";
	updateList();
});
doneFilter.addEventListener("click", function () {
	currentFilter = "done";
	updateList();
});
blockerFilter.addEventListener("click", function () {
	currentFilter = "blocker";
	updateList();
});
priorityFilter.addEventListener("click", function () {
	currentFilter = "priority";
	updateList();
});
unassignedFilter.addEventListener("click", function () {
	currentFilter = "unassigned";
	updateList();
});
activeFilter.addEventListener("click", function () {
	currentFilter = "active";
	updateList();
});
blockedFilter.addEventListener("click", function () {
	currentFilter = "blocked";
	updateList();
});

//* Sort tickets
function sortTickets(sortType: string): void {
	if (currentSort === sortType) {
		ascending = !ascending;
	} else {
		currentSort = sortType;
		ascending = true;
	}
	const idSort = document.getElementById("idSort")!;
	const severitySort = document.getElementById("severitySort")!;
	const titleSort = document.getElementById("alphabeticalSort")!;
	const hoursSort = document.getElementById("hoursSort")!;

	idSort.textContent = "ID";
	severitySort.textContent = "Severity";
	titleSort.textContent = "Alphabetically";
	hoursSort.textContent = "Remaining Hours";

	if (currentSort === "id") {
		idSort.textContent += ascending ? " ↑" : " ↓";
	} else if (currentSort === "severity") {
		severitySort.textContent += ascending ? " ↑" : " ↓";
	} else if (currentSort === "title") {
		titleSort.textContent += ascending ? " ↑" : " ↓";
	} else if (currentSort === "hours") {
		hoursSort.textContent += ascending ? " ↑" : " ↓";
	}
	updateList();
}
const idSort = document.getElementById("idSort")!;
const severitySort = document.getElementById("severitySort")!;
const titleSort = document.getElementById("alphabeticalSort")!;
const hoursSort = document.getElementById("hoursSort")!;

idSort.addEventListener("click", function () {
	sortTickets("id");
});
severitySort.addEventListener("click", function () {
	sortTickets("severity");
});
titleSort.addEventListener("click", function () {
	sortTickets("title");
});
hoursSort.addEventListener("click", function () {
	sortTickets("hours");
});

//* Shows tickets and summary when page loads
updateList();
showSummary();
