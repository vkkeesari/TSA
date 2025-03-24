import { getDatabase, ref, set, get, child, onValue, remove } from "firebase/app";

document.addEventListener("DOMContentLoaded", () => {
    loadReservations();         // Load reservations from localStorage
    populateTimeDropdown();
    displayReservations();      // Show current reservations on load

    document.getElementById("date").addEventListener("change", updateTimeAvailability);
});
const db = getDatabase();

let reservations = {};

// Load reservations from Firebase
function loadReservations() {
    const dbRef = ref(db, "reservations/");
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            reservations = snapshot.val();
        } else {
            reservations = {};
        }
        displayReservations();
        updateTimeAvailability();
    }).catch((error) => {
        console.error("Error loading reservations:", error);
    });
}

// Save reservation to Firebase
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

    if (!reservations[date]) {
        reservations[date] = {};
    }

    if (!reservations[date][time]) {
        reservations[date][time] = [];
    }

    if (reservations[date][time].length >= 3) {
        alert(`Sorry, ${time} on ${date} is fully booked.`);
        return;
    }

    reservations[date][time].push({ name, guests });

    // Save to Firebase
    set(ref(db, "reservations/"), reservations)
        .then(() => {
            displayReservations();
            updateTimeAvailability();
            alert(`Reservation confirmed for ${name} at ${time} on ${date}.`);
        })
        .catch((error) => {
            console.error("Error saving reservation:", error);
        });

    document.getElementById("reservation-form").reset();
}

// Display reservations on the page
function displayReservations() {
    const display = document.getElementById("reservation-display");
    display.textContent = JSON.stringify(reservations, null, 4);
}

// Clear all reservations
function clearReservations() {
    if (confirm("Are you sure you want to clear all reservations?")) {
        remove(ref(db, "reservations/"))
            .then(() => {
                reservations = {};
                displayReservations();
                alert("All reservations have been cleared.");
            })
            .catch((error) => {
                console.error("Error clearing reservations:", error);
            });
    }
}

// Update availability in the dropdown
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
