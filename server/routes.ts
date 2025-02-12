import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUrlSchema } from "@shared/schema";
import { scanUrlForNewsletterForm } from "./url-scanner";

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

    const sourceUrl = parsed.data.sourceUrl;
    const formInfo = await scanUrlForNewsletterForm(sourceUrl);

    if (!formInfo) {
      res.json({ found: false });
      return;
    }

    const url = await storage.addUrl({ 
      sourceUrl: sourceUrl,
      formUrl: formInfo.formUrl,
      hasFirstName: formInfo.hasFirstName ? 'true' : 'false',
      hasLastName: formInfo.hasLastName ? 'true' : 'false',
      hasCheckbox: formInfo.hasCheckbox ? 'true' : 'false',
      hasRadio: formInfo.hasRadio ? 'true' : 'false'
    });

    res.json({ found: true, url });
  });

  const httpServer = createServer(app);
  return httpServer;
}