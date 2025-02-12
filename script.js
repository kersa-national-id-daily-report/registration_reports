// Registration Chart
let registrationChartInstance;

function updateRegistrationChart() {
    let start = chartPage * chartItemsPerPage;
    let end = start + chartItemsPerPage;
    let pageLabels = chartLabels.slice(start, end);
    let pageData = chartData.slice(start, end);

    if (registrationChartInstance) {
        registrationChartInstance.destroy();
    }

    let ctx = document.getElementById("registrationChart").getContext("2d");
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

// Total Booked Chart
let bookedChartInstance;

function updateBookedChart() {
    let start = bookedPage * bookedItemsPerPage;
    let end = start + bookedItemsPerPage;
    let pageLabels = bookedLabels.slice(start, end);
    let pageData = bookedData.slice(start, end);

    if (bookedChartInstance) {
        bookedChartInstance.destroy();
    }

    let ctx = document.getElementById("bookedChart").getContext("2d");
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
