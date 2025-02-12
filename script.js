// Slide Image Carousel
let slideIndex = 0;
function showSlides() {
    let slides = document.querySelectorAll(".slides img");
    slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === slideIndex) slide.classList.add("active");
    });
    slideIndex = (slideIndex + 1) % slides.length;
}
setInterval(showSlides, 3000);

// Fetch and Parse Data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        const data = await response.text();
        return data.trim().split("\n").map(row => row.split(","));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Load Data
let tableData = [];
let attendanceData = [];
let bookedData = [];

Promise.all([
    fetchData('data.csv'),
    fetchData('attendance.csv'),
    fetchData('booked.csv')
]).then(([data, attendance, booked]) => {
    tableData = data.slice(1); // Skip header
    attendanceData = attendance.slice(1); // Skip header
    bookedData = booked.slice(1); // Skip header

    // Log data to console for debugging
    console.log("Table Data:", tableData);
    console.log("Attendance Data:", attendanceData);
    console.log("Booked Data:", bookedData);

    // Initialize tables and charts
    updateTable();
    updateAttendanceTable();
    updateRegistrationChart();
    updateBookedChart();
});

// Update Registration Table
function updateTable() {
    const tableBody = document.querySelector("#registrationTable tbody");
    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    tableBody.innerHTML = "";

    tableData.forEach(row => {
        const total = row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0);
        const htmlRow = `<tr><td>${row[0]}</td>${row.slice(1).map(num => `<td>${num}</td>`).join("")}<td>${total}</td></tr>`;
        tableBody.innerHTML += htmlRow;
    });
}

// Update Attendance Table
function updateAttendanceTable() {
    const tableBody = document.querySelector("#attendanceTable tbody");
    if (!tableBody) {
        console.error("Attendance table body not found!");
        return;
    }

    tableBody.innerHTML = "";

    attendanceData.forEach(row => {
        const htmlRow = `<tr><td>${row[0]}</td>${row.slice(1).map(status => `<td>${status}</td>`).join("")}</tr>`;
        tableBody.innerHTML += htmlRow;
    });
}

// Update Registration Chart
function updateRegistrationChart() {
    const ctx = document.getElementById("registrationChart").getContext("2d");
    const labels = tableData.map(row => row[0]);
    const data = tableData.map(row => row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0));

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Registrations",
                data: data,
                backgroundColor: createGradient(ctx, ["#FF5733", "#33FF57", "#5733FF"]),
                borderColor: ["#C70039", "#2ECC71", "#8E44AD"],
                borderWidth: 2,
                borderRadius: 10,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

// Update Booked Chart
function updateBookedChart() {
    const ctx = document.getElementById("bookedChart").getContext("2d");
    const labels = bookedData.map(row => row[0]);
    const data = bookedData.map(row => parseInt(row[1]));

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Booked",
                data: data,
                backgroundColor: createGradient(ctx, ["#FFC300", "#FF5733", "#33FF57"]),
                borderColor: ["#D35400", "#C70039", "#2ECC71"],
                borderWidth: 2,
                borderRadius: 10,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

// Gradient Function for Chart Backgrounds
function createGradient(ctx, colors) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    return gradient;
}

// Toggle Attendance Table
document.getElementById("attendanceBtn").addEventListener("click", () => {
    const container = document.getElementById("attendanceTableContainer");
    container.style.display = container.style.display === "none" ? "block" : "none";
    updateAttendanceTable();
});
