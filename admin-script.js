// Mock Login System (Replace with real authentication)
function handleAdminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // WARNING: This is NOT secure - just for demo
    if (username === 'admin' && password === 'whitezebra2024') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Invalid credentials. Use demo login: admin / whitezebra2024');
    }
}

// Check if logged in
if (window.location.pathname.includes('admin-dashboard.html')) {
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
    }
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

// Dashboard navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Add active to clicked menu item
    event.target.classList.add('active');
}

// Load leads (this would connect to a backend)
function loadLeads() {
    const leadsTable = document.getElementById('leadsTable');
    // This would normally fetch from a server
    const mockLeads = [
        {date: '2024-01-15', name: 'John Smith', company: 'Tech Corp', service: 'E-commerce', email: 'john@techcorp.com'},
        {date: '2024-01-14', name: 'Sarah Johnson', company: 'Retail Plus', service: 'Digital Marketing', email: 'sarah@retailplus.com'}
    ];
    
    leadsTable.innerHTML = mockLeads.map(lead => `
        <tr>
            <td>${lead.date}</td>
            <td>${lead.name}</td>
            <td>${lead.company}</td>
            <td>${lead.service}</td>
            <td>${lead.email}</td>
            <td><button class="action-btn">View</button></td>
        </tr>
    `).join('');
}

// Load leads on dashboard load
if (window.location.pathname.includes('admin-dashboard.html')) {
    loadLeads();
}