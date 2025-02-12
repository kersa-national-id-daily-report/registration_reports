// Slide Image Carousel
setInterval(() => {
    let slides = document.querySelectorAll(".slides img");
    let active = document.querySelector(".slides .active");
    let next = active.nextElementSibling || slides[0];
    active.classList.remove("active");
    next.classList.add("active");
}, 3000);

// Booked Card Print Graph
let bookedChart;
let bookedData = [];
let bookedLabels = [];
let bookedPage = 0;
const bookedItemsPerPage = 5;

fetch('Booked.csv')
    .then(response => response.text())
    .then(data => {
        let rows = data.trim().split("\n").slice(1).map(row => row.split(","));
        rows.forEach(row => {
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

    if (bookedChart) {
        bookedChart.destroy();
    }

    let ctx = document.getElementById("bookedChart").getContext("2d");
    bookedChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: pageLabels,
            datasets: [{
                label: "Booked Card Prints",
                data: pageData,
                backgroundColor: ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3"],
                borderColor: ["#C70039", "#2ECC71", "#8E44AD", "#D35400", "#3498DB"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    document.getElementById("prevBookedChart").disabled = bookedPage === 0;
    document.getElementById("nextBookedChart").disabled = end >= bookedData.length;
}

document.getElementById("prevBookedChart").addEventListener("click", () => {
    if (bookedPage > 0) {
        bookedPage--;
        updateBookedChart();
    }
});

document.getElementById("nextBookedChart").addEventListener("
