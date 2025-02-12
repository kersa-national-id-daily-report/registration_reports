slideIndex = 0; function showSlides() { let slides = document.querySelectorAll(".slides img"); slides.forEach((slide, i) => { slide.classList.remove("active"); if (i === slideIndex) slide.classList.add("active"); }); slideIndex = (slideIndex + 1) % slides.length; } setInterval(showSlides, 3000);

// Pagination for Table let tableData = []; let tablePage = 0; const rowsPerPage = 10;

fetch('data.csv') .then(response => response.text()) .then(data => { let rows = data.trim().split("\n").map(row => row.split(",")); tableData = rows.slice(2); // Skip header

updateTable();
});

function updateTable() { let tableBody = document.querySelector("#registrationTable tbody"); tableBody.innerHTML = "";

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

document.getElementById("prevTable").addEventListener("click", () => { if (tablePage > 0) { tablePage--; updateTable(); } });

document.getElementById("nextTable").addEventListener("click", () => { if ((tablePage + 1) * rowsPerPage < tableData.length) { tablePage++; updateTable(); } });

// Pagination for Chart let chartData = []; let chartLabels = []; let chartPage = 0; const chartItemsPerPage = 5; let chartInstance;

fetch('data.csv') .then(response => response.text()) .then(data => { let rows = data.trim().split("\n").map(row => row.split(",")); let totalDays = rows.slice(2); // Skip header

totalDays.forEach(row => {
        let total = row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0);
        chartLabels.push(row[0]);
        chartData.push(total);
    });

    updateChart();
});

function updateChart() { let start = chartPage * chartItemsPerPage; let end = start + chartItemsPerPage; let pageLabels = chartLabels.slice(start, end); let pageData = chartData.slice(start, end);

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

document.getElementById("prevChart").addEventListener("click", () => { if (chartPage > 0) { chartPage--; updateChart(); } });

document.getElementById("nextChart").addEventListener("click", () => { if ((chartPage + 1) * chartItemsPerPage < chartData.length) { chartPage++; updateChart(); } });
let attendanceData = [];
let attendancePage = 0;
const attendanceDays = 10;

fetch('Attendance.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").slice(1).map(row => row.split(","));
        attendanceData = rows;
    });

function updateAttendanceTable() {
    let tableBody = document.querySelector("#attendanceTable tbody");
    tableBody.innerHTML = "";
    let start = attendancePage * attendanceDays;
    let pageData = attendanceData.slice(start, start + attendanceDays);

    pageData.forEach(row => {
        let tr = document.createElement("tr");
        row.forEach(cell => {
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    document.getElementById("prevAttendance").disabled = attendancePage === 0;
    document.getElementById("nextAttendance").disabled = (attendancePage + 1) * attendanceDays >= attendanceData.length;
}

document.getElementById("toggleAttendance").addEventListener("click", function() {
    let container = document.querySelector(".attendance-container");
    container.style.display = container.style.display === "none" ? "block" : "none";
    updateAttendanceTable();
});

document.getElementById("prevAttendance").addEventListener("click", () => {
    if (attendancePage > 0) {
        attendancePage--;
        updateAttendanceTable();
    }
});

document.getElementById("nextAttendance").addEventListener("click", () => {
    if ((attendancePage + 1) * attendanceDays < attendanceData.length) {
        attendancePage++;
        updateAttendanceTable();
    }
});
