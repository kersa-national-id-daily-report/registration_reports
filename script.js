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

// Pagination for Tables
let tablePage = 0;
const rowsPerPage = 10;

function updateTable() {
    const tableBody = document.querySelector("#registrationTable tbody");
    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    tableBody.innerHTML = "";

    const start = tablePage * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = tableData.slice(start, end);

    pageData.forEach(row => {
        const total = row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0);
        const htmlRow = `<tr><td>${row[0]}</td>${row.slice(1).map(num => `<td>${num}</td>`).join("")}<td>${total}</td></tr>`;
        tableBody.innerHTML += htmlRow;
    });

    document.getElementById("prevTable").disabled = tablePage === 0;
    document.getElementById("nextTable").disabled = end >= tableData.length;
}

let attendancePage = 0;

function updateAttendanceTable() {
    const tableBody = document.querySelector("#attendanceTable tbody");
    if (!tableBody) {
        console.error("Attendance table body not found!");
        return;
    }

    tableBody.innerHTML = "";

    const start = attendancePage * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = attendanceData.slice(start, end);

    pageData.forEach(row => {
        const htmlRow = `<tr><td>${row[0]}</td>${row.slice(1).map(status => `<td>${status}</td>`).join("")}</tr>`;
        tableBody.innerHTML += htmlRow;
    });

    document.getElementById("prevAttendance").disabled = attendancePage === 0;
    document.getElementById("nextAttendance").disabled = end >= attendanceData.length;
}

// Pagination for Graphs
let registrationChartPage = 0;
const registrationChartItemsPerPage = 5;
let registrationChartInstance;

function updateRegistrationChart() {
    const start = registrationChartPage * registrationChartItemsPerPage;
    const end = start + registrationChartItemsPerPage;
    const pageLabels = tableData.slice(start, end).map(row => row[0]);
    const pageData = tableData.slice(start, end).map(row => row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0));

    if (registrationChartInstance) {
        registrationChartInstance.destroy();
    }

    const ctx = document.getElementById("registrationChart").getContext("2d");
    registrationChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: pageLabels,
            datasets: [{
                label: "Total Registrations",
                data: pageData,
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

    document.getElementById("prevRegistrationChart").disabled = registrationChartPage === 0;
    document.getElementById("nextRegistrationChart").disabled = end >= tableData.length;
}

let bookedChartPage = 0;
const bookedChartItemsPerPage = 5;
let bookedChartInstance;

function updateBookedChart() {
    const start = bookedChartPage * bookedChartItemsPerPage;
    const end = start + bookedChartItemsPerPage;
    const pageLabels = bookedData.slice(start, end).map(row => row[0]);
    const pageData = bookedData.slice(start, end).map(row => parseInt(row[1]));

    if (bookedChartInstance) {
        bookedChartInstance.destroy();
    }

    const ctx = document.getElementById("bookedChart").getContext("2d");
    bookedChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: pageLabels,
            datasets: [{
                label: "Total Booked",
                data: pageData,
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

    document.getElementById("prevBookedChart").disabled = bookedChartPage === 0;
    document.getElementById("nextBookedChart").disabled = end >= bookedData.length;
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

// Pagination Event Listeners
document.getElementById("prevTable").addEventListener("click", () => {
    if (tablePage > 0) {
        tablePage--;
        updateTable();
    }
});

document.getElementById("nextTable").addEventListener("click", () => {
    if ((tablePage + 1) * rowsPerPage < tableData.length) {
        tablePage++;
        updateTable();
    }
});

document.getElementById("prevAttendance").addEventListener("click", () => {
    if (attendancePage > 0) {
        attendancePage--;
        updateAttendanceTable();
    }
});

document.getElementById("nextAttendance").addEventListener("click", () => {
    if ((attendancePage + 1) * rowsPerPage < attendanceData.length) {
        attendancePage++;
        updateAttendanceTable();
    }
});

document.getElementById("prevRegistrationChart").addEventListener("click", () => {
    if (registrationChartPage > 0) {
        registrationChartPage--;
        updateRegistrationChart();
    }
});

document.getElementById("nextRegistrationChart").addEventListener("click", () => {
    if ((registrationChartPage + 1) * registrationChartItemsPerPage < tableData.length) {
        registrationChartPage++;
        updateRegistrationChart();
    }
});

document.getElementById("prevBookedChart").addEventListener("click", () => {
    if (bookedChartPage > 0) {
        bookedChartPage--;
        updateBookedChart();
    }
});

document.getElementById("nextBookedChart").addEventListener("click", () => {
    if ((bookedChartPage + 1) * bookedChartItemsPerPage < bookedData.length) {
        bookedChartPage++;
        updateBookedChart();
    }
});
