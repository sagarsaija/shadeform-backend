import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 3001;

type Instance = {
  id: number;
  name: string;
  status: string;
  ip: string;
  cost: number;
  cloud: string;
  region: string;
  type: string;
  activeGpuData: {};
};

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
  bodyParser.json()
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// In memory instances
let instances: Instance[] = [];
let lastId = 0;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is up and running");
});

// Fetch all available prod instances
app.get("/instances/types", async (req, res) => {
  try {
    const gpuDetails = req.query;
    const response = await axios.get(
      "https://api.shadeform.ai/v1/instances/types",
      {
        params: {
          ...gpuDetails,
          available: true,
          sort: "price",
        },
        headers: {
          "X-API-KEY": process.env.SHADEFORM_API_KEY,
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data from Shadeform API", error });
  }
});

// Create an instance
app.post("/instances/create", (req: Request, res: Response) => {
  const instance: Instance = {
    id: ++lastId,
    name: req.body.name,
    cost: req.body.hourly_price,
    cloud: req.body.cloud,
    region: req.body.region,
    type: req.body.shade_instance_type,
    status: "Active",
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    activeGpuData: req.body,
  };

  instances.push(instance);
  res.status(201).send(instance);
});

// Delete an instance
app.delete("/instances/delete/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  instances = instances.filter((instance) => instance.id !== id);
  res.status(204).send();
});

// Get all active instances
app.get("/instances", (req: Request, res: Response) => {
  res
    .status(200)
    .send(instances.filter((instance) => instance.status === "Active"));
});
