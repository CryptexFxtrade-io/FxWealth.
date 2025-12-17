const API_URL = "https://<your-backend-url>/api"; // https://fxwealthtrade.onrender.com

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(data.token){
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Login failed');
  }
});

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    alert(data.message || 'Registered successfully');
  } catch (err) {
    alert('Registration failed');
  }
});

// Load Dashboard Data
async function loadDashboard() {
  const token = localStorage.getItem('token');
  if(!token) return window.location.href = 'index.html';

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const user = await res.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('balance').innerText = user.balance;

    // Fetch investments
    const invRes = await fetch(`${API_URL}/invest/my`, { headers: { 'Authorization': `Bearer ${token}` } });
    const investments = await invRes.json();
    document.getElementById('investments').innerHTML = investments.map(i => `<p>${i.plan}: $${i.amount} (${i.status})</p>`).join('');

    // Fetch withdrawals
    const wdRes = await fetch(`${API_URL}/wallet/my`, { headers: { 'Authorization': `Bearer ${token}` } });
    const withdrawals = await wdRes.json();
    document.getElementById('withdrawals').innerHTML = withdrawals.map(w => `<p>$${w.amount} (${w.status})</p>`).join('');

  } catch(err){
    console.error(err);
    alert('Failed to load dashboard');
  }
}

loadDashboard();

// Withdraw request
document.getElementById('withdrawBtn')?.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const amount = Number(document.getElementById('withdrawAmount').value);
  if(!amount) return alert('Enter amount');

  try {
    const res = await fetch(`${API_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    alert(data.message || 'Withdrawal requested');
    loadDashboard();
  } catch(err){
    alert('Withdrawal failed');
  }
});
