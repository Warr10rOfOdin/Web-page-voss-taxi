import { promises as fs } from 'fs';
import path from 'path';

export async function getDestinationContent(slug: string) {
  const filePath = path.join(process.cwd(), 'content', 'destinations', `${slug}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading destination content for ${slug}:`, error);
    return null;
  }
}

export async function getPageContent(pageName: string) {
  const filePath = path.join(process.cwd(), 'content', 'pages', `${pageName}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading page content for ${pageName}:`, error);
    return null;
  }
}

export async function getSiteSettings() {
  const filePath = path.join(process.cwd(), 'content', 'settings', 'site.json');

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading site settings:', error);
    return null;
  }
}
