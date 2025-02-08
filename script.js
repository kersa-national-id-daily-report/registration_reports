document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const addPartnerForm = document.getElementById('add-partner-form');
  const addRegistrationForm = document.getElementById('add-registration-form');
  const partnerSelect = document.getElementById('partner-select');
  const imageUpload = document.getElementById('image-upload');
  const deleteImageBtn = document.getElementById('delete-image-btn');
  const sliderImages = document.getElementById('slider-images');
  const registrationTable = document.getElementById('registration-table');
  const graphsContainer = document.getElementById('graphs-container');

  const ADMIN_PASSWORD = 'admin123'; // Hardcoded password for demo
  let partners = JSON.parse(localStorage.getItem('partners')) || [];
  let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
  let images = JSON.parse(localStorage.getItem('images')) || [];

  // Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
      loginSection.classList.add('hidden');
      dashboard.classList.remove('hidden');
      loadData();
    } else {
      alert('Incorrect password');
    }
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    loginSection.classList.remove('hidden');
    dashboard.classList.add('hidden');
  });

  // Add Partner
  addPartnerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const partnerName = document.getElementById('partner-name').value;
    partners.push(partnerName);
    localStorage.setItem('partners', JSON.stringify(partners));
    loadPartners();
    document.getElementById('partner-name').value = '';
  });

  // Add Registration Data
  addRegistrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('registration-date').value;
    const partner = document.getElementById('partner-select').value;
    const count = parseInt(document.getElementById('registration-count').value);

    const registration = { date, partner, count };
    registrations.push(registration);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    loadTable();
    loadGraphs();
    document.getElementById('registration-date').value = '';
    document.getElementById('registration-count').value = '';
  });

  // Upload Image
  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        images.push(event.target.result);
        localStorage.setItem('images', JSON.stringify(images));
        loadImages();
      };
      reader.readAsDataURL(file);
    }
  });

  // Delete Image
  deleteImageBtn.addEventListener('click', () => {
    images = [];
    localStorage.setItem('images', JSON.stringify(images));
    loadImages();
  });

  // Load Data
  function loadData() {
    loadPartners();
    loadTable();
    loadGraphs();
    loadImages();
  }

  // Load Partners
  function loadPartners() {
    partnerSelect.innerHTML = '';
    partners.forEach(partner => {
      const option = document.createElement('option');
      option.value = partner;
      option.textContent = partner;
      partnerSelect.appendChild(option);
    });
  }

  // Load Table
  function loadTable() {
    const thead = registrationTable.querySelector('thead');
    const tbody = registrationTable.querySelector('tbody');
    thead.innerHTML = '<tr><th>Date</th>';
    tbody.innerHTML = '';

    partners.forEach(partner => {
      thead.innerHTML += `<th>${partner}</th>`;
    });
    thead.innerHTML += '<th>Total</th></tr>';

    const dates = [...new Set(registrations.map(r => r.date))];
    dates.forEach(date => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${date}</td>`;
      let total = 0;

      partners.forEach(partner => {
        const count = registrations
          .filter(r => r.date === date && r.partner === partner)
          .reduce((sum, r) => sum + r.count, 0);
        row.innerHTML += `<td>${count}</td>`;
        total += count;
      });

      row.innerHTML += `<td>${total}</td>`;
      tbody.appendChild(row);
    });
  }

  // Load Graphs
  function loadGraphs() {
    graphsContainer.innerHTML = '';
    const dates = [...new Set(registrations.map(r => r.date))];
    dates.forEach((date, index) => {
      if (index % 5 === 0) {
        const row = document.createElement('div');
        row.classList.add('graph-row');
        graphsContainer.appendChild(row);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const data = {
        labels: partners,
        datasets: [{
          label: `Registrations on ${date}`,
          data: partners.map(partner => registrations
            .filter(r => r.date === date && r.partner === partner)
            .reduce((sum, r) => sum + r.count, 0)),
          backgroundColor: partners.map(() => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`),
          borderColor: partners.map(() => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`),
          borderWidth: 1
        }]
      };
      new Chart(ctx, { type: 'bar', data });
      graphsContainer.appendChild(canvas);
    });
  }

  // Load Images
  function loadImages() {
    sliderImages.innerHTML = '';
    images.forEach(image => {
      const img = document.createElement('img');
      img.src = image;
      sliderImages.appendChild(img);
    });
  }
});
