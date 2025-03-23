document.addEventListener("DOMContentLoaded", () => {
    loadReservations();         // Load reservations from localStorage
    populateTimeDropdown();
    displayReservations();      // Show current reservations on load

    document.getElementById("date").addEventListener("change", updateTimeAvailability);
});

let reservations = {};  // The reservation dictionary

// Function to save the dictionary to localStorage
function saveToLocalStorage() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

// Function to load the dictionary from localStorage
function loadReservations() {
    const storedReservations = localStorage.getItem("reservations");

    // Check if reservations exist in localStorage
    if (storedReservations) {
        reservations = JSON.parse(storedReservations);
    }
}

// Function to display the reservations on the page
function displayReservations() {
    const display = document.getElementById("reservation-display");
    
    if (Object.keys(reservations).length === 0) {
        display.textContent = "No reservations yet.";
    } else {
        display.textContent = JSON.stringify(reservations, null, 4);
    }
}

// Function to save reservation and update dictionary
function saveReservation(event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const name = document.getElementById("name").value;
    const guests = document.getElementById("guests").value;

    if (!date || !time || !name || !guests) {
        alert("Please fill out all fields.");
        return;
    }

    // Initialize date key if it doesn't exist
    if (!reservations[date]) {
        reservations[date] = {};
    }

    // Initialize time slot if it doesn't exist
    if (!reservations[date][time]) {
        reservations[date][time] = [];
    }

    // Check if the time slot is full
    if (reservations[date][time].length >= 3) {
        alert(`Sorry, ${time} on ${date} is fully booked.`);
        return;
    }

    // Add the reservation
    reservations[date][time].push({ name, guests });

    // Save to localStorage
    saveToLocalStorage();

    // Update the display
    displayReservations();
    updateTimeAvailability();

    // Show confirmation
    document.getElementById("status").innerText = `Reservation confirmed for ${name} at ${time} on ${date}.`;
    document.getElementById("status").style.color = "green";

    // Reset form
    document.getElementById("reservation-form").reset();
}

// Function to populate the dropdown with 15-minute intervals
function populateTimeDropdown() {
    const timeSelect = document.getElementById("time");
    timeSelect.innerHTML = "";  // Clear dropdown before repopulating

    const start = new Date();
    start.setHours(11, 30, 0, 0);
    
    const end = new Date();
    end.setHours(22, 0, 0, 0);

    while (start <= end) {
        const time = start.toTimeString().split(" ")[0].slice(0, 5);  // HH:MM format
        const option = document.createElement("option");
        option.value = time;
        option.textContent = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSelect.appendChild(option);
        
        start.setMinutes(start.getMinutes() + 15);
    }
}

// Function to update time availability
function updateTimeAvailability() {
    const date = document.getElementById("date").value;
    const timeSelect = document.getElementById("time");

    if (!date) return;

    for (let option of timeSelect.options) {
        const time = option.value;

        if (reservations[date] && reservations[date][time] && reservations[date][time].length >= 3) {
            option.disabled = true;
            option.textContent = `${option.textContent.replace(" (Fully Booked)", "")} (Fully Booked)`;
        } else {
            option.disabled = false;
            option.textContent = option.textContent.replace(" (Fully Booked)", "");
        }
    }
}

// 💥 Function to clear reservations
function clearReservations() {
    if (confirm("Are you sure you want to clear all reservations?")) {
        reservations = {};  // Reset dictionary
        saveToLocalStorage();  // Save empty dictionary
        displayReservations();
        updateTimeAvailability();
        alert("All reservations have been cleared.");
    }
}
