<?php
// File where reservations are stored
$file = 'reservations.txt';

// Get form data
$name = trim($_POST['name']);
$date = trim($_POST['date']);
$time = trim($_POST['time']);
$guests = trim($_POST['guests']);

// Check if the reservation is already booked
$reservations = file($file, FILE_IGNORE_NEW_LINES);
$isBooked = false;

foreach ($reservations as $reservation) {
    [$resDate, $resTime] = explode('|', explode('=', $reservation)[0]);
    
    if ($resDate === $date && $resTime === $time) {
        $isBooked = true;
        break;
    }
}

// If the time is already reserved
if ($isBooked) {
    echo "<h3>Sorry, this time slot is already reserved. Please choose another time.</h3>";
    echo "<a href='index.html'>Go back</a>";
} else {
    // Save reservation in key-value format: date|time=name|guests
    $newReservation = "$date|$time=$name|$guests\n";
    file_put_contents($file, $newReservation, FILE_APPEND);

    echo "<h3>Reservation confirmed for $name at $time on $date for $guests guests.</h3>";
    echo "<a href='index.html'>Make another reservation</a>";
}
?>
