import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUrlSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/urls", async (_req, res) => {
    const urls = await storage.getUrls();
    res.json(urls);
  });

  app.post("/api/urls", async (req, res) => {
    const parsed = insertUrlSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid URL data" });
      return;
    }
    
    const url = await storage.addUrl(parsed.data);
    res.json(url);
  });

  const httpServer = createServer(app);
  return httpServer;
}
