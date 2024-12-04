// Get the form and the submit button
var form = document.querySelector("form");
var submitButton = document.querySelector("button[type=submit]");

// Listen for form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from submitting

  // Get the booking details from the form
  var pickupLocation = document.getElementById("pickup-location").value;
  var dropLocation = document.getElementById("drop-location").value;
  var pickupDate = document.getElementById("pickup-date").value;
  var dropDate = document.getElementById("drop-date").value;
  var carType = document.getElementById("car-type").value;

  // Save the booking details to localStorage
  localStorage.setItem("booking-pickup-location", pickupLocation);
  localStorage.setItem("booking-drop-location", dropLocation);
  localStorage.setItem("booking-pickup-date", pickupDate);
  localStorage.setItem("booking-drop-date", dropDate);
  localStorage.setItem("booking-car-type", carType);

  // Redirect the user to the confirmation page
  window.location.href = "confirmation.html";
});

// Populate the booking details on the confirmation page
var pickupLocationElement = document.getElementById("pickup-location");
var dropLocationElement = document.getElementById("drop-location");
var pickupDateElement = document.getElementById("pickup-date");
var dropDateElement = document.getElementById("drop-date");
var carTypeElement = document.getElementById("car-type");

pickupLocationElement.textContent = localStorage.getItem("booking-pickup-location");
dropLocationElement.textContent = localStorage.getItem("booking-drop-location");
pickupDateElement.textContent = localStorage.getItem("booking-pickup-date");
dropDateElement.textContent = localStorage.getItem("booking-drop-date");
carTypeElement.textContent = localStorage.getItem("booking-car-type");