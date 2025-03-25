import { jsPDF } from "jspdf"
import { Download } from "lucide-react"

type DownloadPDFProps = {
	text: string
}

function DownloadPDF({ text }: DownloadPDFProps) {
	const handleDownload = () => {
		const doc = new jsPDF()
		doc.text(doc.splitTextToSize(text, 180), 10, 10)
		doc.save("download.pdf")
	}

	return (
		<button
			onClick={handleDownload}
			className="flex items-center gap-2 py-2 px-4 duration-200 hover:bg-white/5 border border-white/10 rounded-lg text-white cursor-pointer"
		>
			<Download className="h-4 w-4" />
			Download PDF
		</button>
	)
}

export default DownloadPDF
