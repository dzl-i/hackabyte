import { jsPDF } from "jspdf";

type Sections = {
  title: string;
  summary: string;
  transcript: string;
  flashcards: {
    question: string;
    answer: string;
  }[];
}[];

// PDF DOWNLOAD FUNCTION
export function handleDownload(sections: Sections) {
  const doc = new jsPDF();
  let y = 15;

  const renderParagraphs = (text: string) => {
    const paragraphs = text.split("\n");
    paragraphs.forEach((para) => {
      const lines = doc.splitTextToSize(para, 180);
      doc.text(lines, 16, y);
      y += lines.length * 6 + 4;
    });
  };

  sections.forEach((section, idx) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Section ${idx + 1}: ${section.title}`, 10, y);
    y += 10;

    // Summary
    doc.setFontSize(12);
    doc.text("Summary", 12, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    renderParagraphs(section.summary);

    // Transcript
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Transcript", 12, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    JSON.parse(section.transcript).forEach(
      (t: { timestamp: string; text: string }) => {
        const timestamp = `[${t.timestamp}]`;
        const textLines = doc.splitTextToSize(t.text, 160); // reserve space for timestamp
        doc.text(timestamp, 16, y);
        doc.text(textLines, 35, y); // indent text to align
        y += textLines.length * 6 + 2;

        // Check if we need a new page before the next transcript item
        if (y > 260) {
          doc.addPage();
          y = 15;
          // Reset formatting for new page
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
        }
      }
    );

    y += 5;

    // Flashcards
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Flashcards", 12, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    section.flashcards.forEach((fc, idx) => {
      const q = `Question ${idx + 1}: ${fc.question}`;
      const a = `Answer: ${fc.answer}`;
      doc.text(doc.splitTextToSize(q, 180), 16, y);
      y += 6;
      doc.text(doc.splitTextToSize(a, 180), 16, y);
      y += 10;

      // Check if we need a new page before the next flashcard
      if (y > 260 && idx < section.flashcards.length - 1) {
        doc.addPage();
        y = 15;
        // Reset formatting for new page
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
      }
    });

    y += 7;

    // Add new page if near bottom
    if (y > 260 && idx < sections.length - 1) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save("download.pdf");
}

// TRUNCATE TOPIC TAB TITLE
export function truncate(str: string) {
  const limit = 25;
  return str.length > limit ? str.slice(0, limit) + "…" : str;
}
