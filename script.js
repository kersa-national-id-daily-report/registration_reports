const partners = [];
const registrations = [];

document.getElementById('add-partner-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const partnerName = document.getElementById('partner-name').value;
  partners.push(partnerName);
  updatePartnerSelect();
  document.getElementById('partner-name').value = '';
});

document.getElementById('registration-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const partner = document.getElementById('partner-select-reg').value;
  const count = parseInt(document.getElementById('registered-count').value);
  registrations.push({ date, partner, count });
  updateRegistrationTable();
  updateGraph();
});

function updatePartnerSelect() {
  const partnerSelect = document.getElementById('partner-select');
  const partnerSelectReg = document.getElementById('partner-select-reg');
  partnerSelect.innerHTML = '';
  partnerSelectReg.innerHTML = '';
  partners.forEach((partner, index) => {
    const option = document.createElement('option');
    option.value = partner;
    option.textContent = partner;
    partnerSelect.appendChild(option);
    partnerSelectReg.appendChild(option.cloneNode(true));
  });
}

function updateRegistrationTable() {
  const tableBody = document.getElementById('registration-table').querySelector('tbody');
  tableBody.innerHTML = '';
  const totals = {};
  registrations.forEach(reg => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${reg.date}</td><td>${reg.partner}</td><td>${reg.count}</td>`;
    tableBody.appendChild(row);
    totals[reg.date] = (totals[reg.date] || 0) + reg.count;
  });
  for (const date in totals) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${date}</td><td>${totals[date]}</td>`;
    tableBody.appendChild(row);
  }
}

function updateGraph() {
  const ctx = document.getElementById('registration-graph').getContext('2d');
  const labels = registrations.map(reg => reg.date);
  const data = registrations.map(reg => reg.count);
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Registered',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

window.onload = function() {
  updatePartnerSelect();
  updateRegistrationTable();
};
