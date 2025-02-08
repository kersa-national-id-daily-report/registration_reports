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

// Fetch and Display Data in Table
fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").map(row => row.split(","));
        let tableBody = document.querySelector("#registrationTable tbody");
        let totalDays = rows.slice(2); // Skip header rows

        totalDays.forEach(row => {
            let total = row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0);
            let htmlRow = `<tr><td>${row[0]}</td>${row.slice(1).map(num => `<td>${num}</td>`).join("")}<td>${total}</td></tr>`;
            tableBody.innerHTML += htmlRow;
        });
    });

// Generate Chart.js Graph
let chartData = [];
let chartLabels = [];

fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").map(row => row.split(","));
        let totalDays = rows.slice(2);

        totalDays.forEach(row => {
            let total = row.slice(1).reduce((sum, num) => sum + parseInt(num || 0), 0);
            chartLabels.push(row[0]);
            chartData.push(total);
        });

        let ctx = document.getElementById("registrationChart").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: chartLabels,
                datasets: [{
                    label: "Total Registrations",
                    data: chartData,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            }
        });
    });
