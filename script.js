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

// Update Attendance Table
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

// Update Registration Chart
function updateRegistrationChart() {
    const start = chartPage * chartItemsPerPage;
    const end = start + chartItemsPerPage;
    const pageLabels = chartLabels.slice(start, end);
    const pageData = chartData.slice(start, end);

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
                backgroundColor: createGradient(ctx, ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3"]),
                borderColor: ["#C70039", "#2ECC71", "#8E44AD", "#D35400", "#3498DB"],
                borderWidth: 2,
                hoverBackgroundColor: createGradient(ctx, ["#FF8C66", "#66FF8C", "#8C66FF", "#FFD966", "#66FFF3"]),
                hoverBorderColor: ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3"],
                borderRadius: 10,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        font: {
                            size: 14,
                            family: "Poppins",
                        },
                        color: "#2c3e50",
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    titleFont: {
                        size: 16,
                        family: "Poppins",
                    },
                    bodyFont: {
                        size: 14,
                        family: "Poppins",
                    },
                    footerFont: {
                        size: 12,
                        family: "Poppins",
                    },
                    padding: 10,
                    cornerRadius: 5,
                    displayColors: true,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#e0e0e0",
                    },
                    ticks: {
                        font: {
                            size: 14,
                            family: "Poppins",
                        },
                        color: "#2c3e50",
                    }
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            size: 14,
                            family: "Poppins",
                        },
                        color: "#2c3e50",
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: "easeOutQuart",
            }
        }
    });

    document.getElementById("prevChart").disabled = chartPage === 0;
    document.getElementById("nextChart").disabled = end >= chartData.length;
}

// Update Booked Chart
function updateBookedChart() {
    const start = bookedPage * bookedItemsPerPage;
    const end = start + bookedItemsPerPage;
    const pageLabels = bookedLabels.slice(start, end);
    const pageData = bookedData.slice(start, end);

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
                backgroundColor: createGradient(ctx, ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3"]),
                borderColor: ["#C70039", "#2ECC71", "#8E44AD", "#D35400", "#3498DB"],
                borderWidth: 2,
                hoverBackgroundColor: createGradient(ctx, ["#FF8C66", "#66FF8C", "#8C66FF", "#FFD966", "#66FFF3"]),
                hoverBorderColor: ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3"],
                borderRadius: 10,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        font: {
                            size: 14,
                            family: "Poppins",
                        },
                        color: "#2c3e50",
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    titleFont: {
                        size: 16,
                        family: "Poppins",
                    },
                    bodyFont: {
                        size: 14,
                        family: "Poppins",
                    },
                    footerFont: {
                        size: 12,
                        family: "Poppins",
                    },
                    padding: 10,
                    cornerRadius: 5,
                    displayColors: true,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#e0e0e0",
                    },
                    ticks: {
                        font: {
                            size: 14,
                            family: "Poppins",
                        },
                        color: "#2c3e50",
                    }
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            size: 14,
                            family: "Poppins",
                        },
                        color: "#2c3e50",
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: "easeOutQuart",
            }
        }
    });

    document.getElementById("prevBooked").disabled = bookedPage === 0;
    document.getElementById("nextBooked").disabled = end >= bookedData.length;
}

// Gradient Function for Chart Backgrounds
function createGradient(ctx, colors) {
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    return gradient;
}

// Pagination for Table
let tablePage = 0;
const rowsPerPage = 10;

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

// Pagination for Attendance Table
let attendancePage = 0;

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

// Pagination for Registration Chart
let chartPage = 0;
const chartItemsPerPage = 5;

document.getElementById("prevChart").addEventListener("click", () => {
    if (chartPage > 0) {
        chartPage--;
        updateRegistrationChart();
    }
});

document.getElementById("nextChart").addEventListener("click", () => {
    if ((chartPage + 1) * chartItemsPerPage < chartData.length) {
        chartPage++;
        updateRegistrationChart();
    }
});

// Pagination for Booked Chart
let bookedPage = 0;
const bookedItemsPerPage = 5;

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

// Toggle Attendance Table
document.getElementById("attendanceBtn").addEventListener("click", () => {
    const container = document.getElementById("attendanceTableContainer");
    container.style.display = container.style.display === "none" ? "block" : "none";
    updateAttendanceTable();
});
