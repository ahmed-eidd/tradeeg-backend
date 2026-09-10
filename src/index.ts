import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/', (_req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
