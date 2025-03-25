import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const prompt = `
This is a transcript of a lecture.
Summarise each section in 150 to 250 words, including a title.
Each section should correspond to a 'start' and an 'end' timestamp, which are the timestamps of the first and the last quote of the section, respectively.
In each section, make 4-6 flash cards with a question and answer to assist revision.

Create data for a graph which shows the relationship of individual sections to each other. 
The title of each section is a node.
Make an edge between pairs of nodes that are closely related.

I want the response format to be JSON:
{
  "sections": [{
      "title": string,
      "summary": string,
      "timestamp_start": string
      "timestamp_end": string,
      "flashcards": [{"question": string, "answer": string}]
  }],
  "graph": {
    "nodes": [{"title": string, // section title}],
    "edges": [{"source": string, "target": string}]
  }
}
`

//       "transcript": [{"timestamp": string, "text": string}]

export async function summarizeLecture(transcript: string) {
  try {
    const response: any = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: transcript }
        ],
        temperature: 0.7,
        max_output_tokens: 16384,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return await JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
      console.error('Error summarizing the lecture:', error);
      throw new Error('Failed to summarize lecture');
  }
}
