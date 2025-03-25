export function processVTT(file: string) {
  const lines = file.split('\n');
  const refinedResult: { timestamp: string; text: string }[] = [];
  const rawResult: string[] = [];
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
      rawResult.push(`${currentTimestamp} ${textMatch[1]}`);
      refinedResult.push({ timestamp: currentTimestamp, text: textMatch[1] });
    }
  }

  return {
    refinedResult,
    rawResult: rawResult.join('\n')
  }
}
