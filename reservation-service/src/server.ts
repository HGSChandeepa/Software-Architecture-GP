import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/api/reservations', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'reservation-service' });
});

app.listen(PORT, () => {
  console.log(`Reservation Service running on port ${PORT}`);
});