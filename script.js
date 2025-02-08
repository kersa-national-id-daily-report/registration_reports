document.addEventListener("DOMContentLoaded", function () {
    fetchRegistrations();
    fetchSliderImages();
});

// 🔐 Admin Login
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    fetch("https://nid.ksug.com/hdocs/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `login=true&username=${username}&password=${password}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") alert("Login successful!");
        else alert("Invalid credentials!");
    });
}

// 📊 Fetch Registrations
function fetchRegistrations() {
    fetch("https://nid.ksug.com/hdocs/api.php?fetch_registrations=true")
    .then
