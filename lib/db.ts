import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "artworks.json");

export interface Artwork {
  id: string;
  title: string;
  category: string;
  year: string;
  coverImage: string;
  images: string[];
  description?: string;
}

export async function getArtworks(): Promise<Artwork[]> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading artworks:", error);
    return [];
  }
}

export async function saveArtworks(artworks: Artwork[]) {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(artworks, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving artworks:", error);
  }
}
