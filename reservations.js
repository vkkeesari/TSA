import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";


window.saveReservation = saveReservation;
window.clearReservations = clearReservations;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDu2f71DLUEX73Vi5ccIe47FxYw2K2l-Vg",
    authDomain: "ahara-reservations.firebaseapp.com",
    databaseURL: "https://ahara-reservations-default-rtdb.firebaseio.com",
    projectId: "ahara-reservations",
    storageBucket: "ahara-reservations.firebasestorage.app",
    messagingSenderId: "860869953925",
    appId: "1:860869953925:web:9cceb6a4a8dc050c091cec"
  };

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let reservations = {};

// Load reservations from Firebase
function loadReservations() {
    const reservationsRef = ref(db, "reservations/");
    onValue(reservationsRef, (snapshot) => {
        if (snapshot.exists()) {
            reservations = snapshot.val();
            displayReservations();
            updateTimeAvailability();
        } else {
            reservations = {};
            console.log("No reservations found.");
        }
    });
}

// Save reservations to Firebase
function saveToFirebase() {
    const reservationsRef = ref(db, "reservations/");
    set(reservationsRef, reservations)
        .then(() => console.log("Reservations saved to Firebase."))
        .catch((error) => console.error("Error saving reservations:", error));
}

// Save reservation
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
    saveToFirebase();
    displayReservations();
    updateTimeAvailability();

    document.getElementById("status").innerText = `Reservation confirmed for ${name} at ${time} on ${date}.`;
    document.getElementById("status").style.color = "green";
    document.getElementById("reservation-form").reset();
}

// Display reservations
function displayReservations() {
    const display = document.getElementById("reservation-display");

    if (Object.keys(reservations).length === 0) {
        display.textContent = "No reservations yet.";
    } else {
        display.textContent = JSON.stringify(reservations, null, 4);
    }
}

// Populate the time dropdown
function populateTimeDropdown() {
    const timeSelect = document.getElementById("time");
    const start = new Date();
    start.setHours(11, 30, 0, 0);

    const end = new Date();
    end.setHours(22, 0, 0, 0);

    while (start <= end) {
        const option = document.createElement("option");
        option.value = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        option.textContent = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSelect.appendChild(option);
        start.setMinutes(start.getMinutes() + 15);
    }
}

// Update time availability
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

// Clear reservations
// Clear reservations
function clearReservations() {
    if (confirm("Are you sure you want to clear all reservations?")) {
        const reservationsRef = ref(db, "reservations/");
        set(reservationsRef, {}) // Clear the data in Firebase
            .then(() => {
                reservations = {}; // Clear local reservations object
                displayReservations(); // Update display
                updateTimeAvailability(); // Refresh availability
                alert("All reservations have been cleared.");
            })
            .catch((error) => {
                console.error("Error clearing reservations in Firebase:", error);
            });
    }
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    loadReservations();         // Load reservations from Firebase
    populateTimeDropdown();     // Populate the time dropdown
    displayReservations();      // Show current reservations on load

    document.getElementById("date").addEventListener("change", updateTimeAvailability);
});

// Populate the dropdown and ensure all functionalities are working.
populateTimeDropdown();