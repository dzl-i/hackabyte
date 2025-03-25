import * as fs from 'fs';

export function processVTT(filePath: string): string {
  const vttContent = fs.readFileSync(filePath, 'utf-8');
  
  const lines = vttContent.split('\n');
  const result: string[] = [];
  const timestampRegex = /^(\d{2}:\d{2}:\d{2})\.\d{3}/;
  const textRegex = /^<v\s+[^>]+>\s*(.+)/;

  let currentTimestamp = '';

  for (const line of lines) {
    const timestampMatch = line.match(timestampRegex);
    if (timestampMatch) {
      currentTimestamp = timestampMatch[1]; // Extract timestamp without milliseconds
      continue;
    }

    const textMatch = line.match(textRegex);
    if (textMatch && currentTimestamp) {
      result.push(`${currentTimestamp} ${textMatch[1]}`);
    }
  }

  return result.join('\n');
}
