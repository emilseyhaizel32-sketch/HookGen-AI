import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Paystack API Routes
  app.post("/api/paystack/initialize", async (req, res) => {
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: "Paystack is not configured. Please add PAYSTACK_SECRET_KEY to your environment variables." });
    }

    const { email, amount, plan } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const payload: any = {
        email,
        callback_url: `${process.env.APP_URL || `http://localhost:${PORT}`}/?payment=success`.replace(/([^:]\/)\/+/g, "$1"), // Prevent double slashes
      };

      // If a plan is provided, Paystack uses the plan's amount. 
      // We only send amount if we want to override it or if no plan is provided.
      if (plan) {
        payload.plan = plan;
      }
      
      if (amount && amount > 0) {
        payload.amount = Math.round(amount * 100); // Ensure it's an integer in kobo/cents
      }

      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        payload,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data.data);
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Paystack Error Detail:", JSON.stringify(errorData, null, 2));
      
      res.status(error.response?.status || 500).json({ 
        error: errorData?.message || "Payment initialization failed",
        details: errorData?.errors || null
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
