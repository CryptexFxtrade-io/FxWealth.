const cors = require('cors');

app.use(cors({
  origin: [
    'https://fxwealthtrade.onrender.com',       // allow your backend root if needed
    'https://<your-frontend-url>.vercel.app'    // allow your frontend URL
  ],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
}));
