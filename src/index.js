const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'Hello from Express!' });
});

app.get('/health', (req, res) => res.send('OK'));

app.post('/echo', (req, res) => {
	res.json({ body: req.body });
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});