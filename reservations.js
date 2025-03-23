function saveReservation(event) {
    event.preventDefault(); // Prevents the page from reloading

    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const guests = document.getElementById("guests").value;

    const reservation = { name, date, time, guests };

    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    reservations.push(reservation);
    localStorage.setItem("reservations", JSON.stringify(reservations));

    document.getElementById("status").innerText = "Reservation saved successfully!";
    event.target.reset();
}

function showReservations() {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const container = document.getElementById("reservations");
    container.innerHTML = "<h3>Reservations:</h3>";

    if (reservations.length === 0) {
        container.innerHTML += "<p>No reservations yet.</p>";
        return;
    }

    reservations.forEach((res, index) => {
        container.innerHTML += `
            <p><strong>Reservation #${index + 1}</strong></p>
            <p>Name: ${res.name}</p>
            <p>Date: ${res.date}</p>
            <p>Time: ${res.time}</p>
            <p>Guests: ${res.guests}</p>
            <hr>`;
    });
}
