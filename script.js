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

// Pagination for Table
let tableData = [];
let tablePage = 0;
const rowsPerPage = 10;

fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").map(row => row.split(","));
        tableData = rows.slice(1); // Skip header
        updateTable();
    });

function updateTable() {
    let tableBody = document.querySelector("#registrationTable tbody");
    tableBody.innerHTML = "";

    let start = tablePage * rowsPerPage;
    let end = start + rowsPerPage;
    let pageData = tableData.slice(start, end);

    pageData.forEach(row => {
        let total = row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0);
        let htmlRow = `<tr><td>${row[0]}</td>${row.slice(1).map(num => `<td>${num}</td>`).join("")}<td>${total}</td></tr>`;
        tableBody.innerHTML += htmlRow;
    });

    document.getElementById("prevTable").disabled = tablePage === 0;
    document.getElementById("nextTable").disabled = end >= tableData.length;
}

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

// Pagination for Chart
let chartData = [];
let chartLabels = [];
let chartPage = 0;
const chartItemsPerPage = 5;
let chartInstance;

fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").map(row => row.split(","));
        let totalDays = rows.slice(1); // Skip header

        totalDays.forEach(row => {
            let total = row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0);
            chartLabels.push(row[0]);
            chartData.push(total);
        });

        updateChart();
    });

function updateChart() {
    let start = chartPage * chartItemsPerPage;
    let end = start + chartItemsPerPage;
    let pageLabels = chartLabels.slice(start, end);
    let pageData = chartData.slice(start, end);

    if (chartInstance) {
        chartInstance.destroy();
    }

    let ctx = document.getElementById("registrationChart").getContext("2d");
    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: pageLabels,
            datasets: [{
                label: "Total Registrations",
                data: pageData,
                backgroundColor: ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3"],
                borderColor: ["#C70039", "#2ECC71", "#8E44AD", "#D35400", "#3498DB"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById("prevChart").disabled = chartPage === 0;
    document.getElementById("nextChart").disabled = end >= chartData.length;
}

document.getElementById("prevChart").addEventListener("click", () => {
    if (chartPage > 0) {
        chartPage--;
        updateChart();
    }
});

document.getElementById("nextChart").addEventListener("click", () => {
    if ((chartPage + 1) * chartItemsPerPage < chartData.length) {
        chartPage++;
        updateChart();
    }
});

// Attendance Table Logic
let attendanceData = [];
let attendancePage = 0;

fetch('attendance.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").map(row => row.split(","));
        attendanceData = rows.slice(1); // Skip header
    });

document.getElementById("attendanceBtn").addEventListener("click", () => {
    let container = document.getElementById("attendanceTableContainer");
    container.style.display = container.style.display === "none" ? "block" : "none";
    updateAttendanceTable();
});

function updateAttendanceTable() {
    let tableBody = document.querySelector("#attendanceTable tbody");
    tableBody.innerHTML = "";

    let start = attendancePage * rowsPerPage;
    let end = start + rowsPerPage;
    let pageData = attendanceData.slice(start, end);

    pageData.forEach(row => {
        let htmlRow = `<tr><td>${row[0]}</td>${row.slice(1).map(num => `<td>${num}</td>`).join("")}</tr>`;
        tableBody.innerHTML += htmlRow;
    });

    document.getElementById("prevAttendance").disabled = attendancePage === 0;
    document.getElementById("nextAttendance").disabled = end >= attendanceData.length;
}

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

// Total Booked Graph Logic
let bookedData = [];
let bookedLabels = [];
let bookedPage = 0;
const bookedItemsPerPage = 5;
let bookedInstance;

fetch('booked.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").map(row => row.split(","));
        let totalDays = rows.slice(1); // Skip header

        totalDays.forEach(row => {
            bookedLabels.push(row[0]);
            bookedData.push(parseInt(row[1]));
        });

        updateBookedChart();
    });

function updateBookedChart() {
    let start = bookedPage * bookedItemsPerPage;
    let end = start + bookedItemsPerPage;
    let pageLabels = bookedLabels.slice(start, end);
    let pageData = bookedData.slice(start, end);

    if (bookedInstance) {
        bookedInstance.destroy();
    }

    let ctx = document.getElementById("bookedChart").getContext("2d");
    bookedInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: pageLabels,
            datasets: [{
                label: "Total Booked",
                data: pageData,
                backgroundColor: ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3"],
                borderColor: ["#C70039", "#2ECC71", "#8E44AD", "#D35400", "#3498DB"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById("prevBooked").disabled = bookedPage === 0;
    document.getElementById("nextBooked").disabled = end >= bookedData.length;
}

document.getElementById("prevBooked").addEventListener("click", () => {
    if (bookedPage > 0) {
        bookedPage--;
        updateBookedChart();
    }
});

document.getElementById("nextBooked").addEventListener("click", () => {
    if ((bookedPage + 1) * bookedItemsPerPage < bookedData.length) {
        bookedPage++;
        updateBookedChart();
    }
});
