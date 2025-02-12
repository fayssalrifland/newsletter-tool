import { urls, type Url, type InsertUrl } from "@shared/schema";

export interface IStorage {
  getUrls(): Promise<Url[]>;
  addUrl(url: InsertUrl): Promise<Url>;
}

export class MemStorage implements IStorage {
  private urls: Map<number, Url>;
  currentId: number;

  constructor() {
    this.urls = new Map();
    this.currentId = 1;
  }

  async getUrls(): Promise<Url[]> {
    return Array.from(this.urls.values());
  }

  async addUrl(insertUrl: InsertUrl): Promise<Url> {
    const id = this.currentId++;
    const url: Url = { 
      ...insertUrl, 
      id,
      hasFirstName: insertUrl.hasFirstName || 'false',
      hasLastName: insertUrl.hasLastName || 'false',
      hasCheckbox: insertUrl.hasCheckbox || 'false',
      hasRadio: insertUrl.hasRadio || 'false'
    };
    this.urls.set(id, url);
    return url;
  }
}

export const storage = new MemStorage();