import express from 'express';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'TTP-APP' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to TTP-APP' });
});

app.listen(port, () => {
  console.log(`TTP-APP listening at http://localhost:${port}`);
});
