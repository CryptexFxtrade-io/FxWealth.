const API_URL = "https://fxwealth-backend.onrender.com/api"; //https://fxwealthtrade.onrender.com

// --- LOGIN ---
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Error: Login failed');
    console.error(err);
  }
});

// --- REGISTER ---
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message || 'Registered successfully!');
    if (!data.error) {
      document.getElementById('registerForm').reset();
    }
  } catch (err) {
    alert('Error: Registration failed');
    console.error(err);
  }
});
