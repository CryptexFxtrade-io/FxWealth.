const cors = require('cors');

app.use(cors({
  origin: [
    'https://fx-wealth-fecz2kwd0-cryptextradefxs-projects.vercel.app',
    'https://www.fx-wealth-fecz2kwd0-cryptextradefxs-projects.vercel.app'
  ],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization'
}));

app.options('*', cors());
