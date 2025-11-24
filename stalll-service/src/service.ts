import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/api/stalls", routes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "stall-service" });
});

app.get("/stall-status", (req, res) => {
  res.json({ status: "OK", service: "stall-service-status" });
});

app.listen(PORT, () => {
  console.log(`Stall Service running on port ${PORT}`);
});
