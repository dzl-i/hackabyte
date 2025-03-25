"use client"

import NavBar from "@/components/NavBar"
import { ArrowLeft, Captions, Heart, Layers } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import FlashCard from "@/components/FlashCard"

export default function Page() {
	const router = useRouter()

	// DATABASE
	const flashcardsDummy = [
		{ question: "how is merry's mental state?", answer: "not good" },
		{ question: "how is merry's mental state?", answer: "not good" },
		{ question: "how is merry's mental state?", answer: "not good" },
	]

	const summaryDummy =
		"Utilitarianism is a consequentialist ethical theory that holds the view that the morality of an action is determined by its outcomes—specifically, the extent to which it promotes overall happiness or minimizes suffering..."

	const transcriptsDummy = [
		{
			timestamp: "00:01",
			text: "Okay, so… Utilitarianism is what we call a consequentialist ethical theory.",
		},
		{
			timestamp: "00:01",
			text: "Okay, so… Utilitarianism is what we call a consequentialist ethical theory.",
		},
		{
			timestamp: "200:01",
			text: "Okay, so… Utilitarianism is what we call a consequentialist ethical theory.",
		},
	]

	const transcriptsDummy2 = [
		{
			timestamp: "00:01",
			text: "Test",
		},
	]

	const sections = [
		{
			name: "Rule & Act Utilitarianism",
			summary: summaryDummy,
			transcripts: transcriptsDummy,
			flashcards: flashcardsDummy,
		},
		{
			name: "Rule & Act Utilitarianism 2",
			summary: "different one trust",
			transcripts: transcriptsDummy2,
			flashcards: flashcardsDummy,
		},
	]

	// Section and tab state
	const [topicTab, setTopicTab] = useState(sections[0])
	const [selectedTabIndex, setSelectedTabIndex] = useState(0)

	// Dynamically generates lecture type tab
	const lectureTabs = [
		{
			name: "Summary",
			icon: Heart,
			content: (
				<div className="px-4">
					<h4 className="text-lg font-bold text-white mb-4">Summary</h4>
					<p className="text-white">{topicTab.summary}</p>
				</div>
			),
		},
		{
			name: "Transcript",
			icon: Captions,
			content: (
				<div className="px-4">
					<h4 className="text-lg font-bold text-white mb-4">Transcript</h4>
					<div className="grid grid-cols-[80px_1fr] gap-y-2">
						{topicTab.transcripts.map((transcript, index) => (
							<React.Fragment key={index}>
								<p className="text-gray-400 font-mono">
									[{transcript.timestamp}]
								</p>
								<p className="text-white">{transcript.text}</p>
							</React.Fragment>
						))}
					</div>
				</div>
			),
		},
		{
			name: "Flashcards",
			icon: Layers,
			content: (
				<div className="px-4">
					<h4 className="text-lg font-bold text-white mb-4">Flashcards</h4>

					<div className="space-y-4">
						{topicTab.flashcards.map((flashcard, index) => (
							<FlashCard
								key={index}
								question={flashcard.question}
								answer={flashcard.answer}
							/>
						))}
					</div>
				</div>
			),
		},
	]

	const selectedTab = lectureTabs[selectedTabIndex]

	function truncate(str: string) {
		const limit = 25
		return str.length > limit ? str.slice(0, limit) + "…" : str
	}

	return (
		<main>
			<NavBar />
			<main className="p-6 flex gap-8">
				{/* Sidebar: Topics */}
				<section className="space-y-6 flex-1 min-w-[280px]">
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 py-2 px-4 duration-200 hover:bg-white/5 rounded-lg text-white cursor-pointer"
					>
						<ArrowLeft className="w-4 h-4" /> Back
					</button>
					<div className="max-w-xs space-y-2">
						<p className="text-white/75 font-bold uppercase">Sections</p>
						<div className="flex flex-col gap-1">
							{sections.map((section, index) => (
								<button
									key={index}
									onClick={() => setTopicTab(section)}
									className={`flex gap-2 px-4 py-2 rounded-lg duration-200 ${
										topicTab.name === section.name
											? "bg-[rgba(32,_33,_42,_1)] text-white font-bold"
											: "text-gray-400 hover:text-white hover:bg-[rgba(32,_33,_42,_1)]"
									}`}
								>
									<p>{truncate(section.name)}</p>
								</button>
							))}
						</div>
					</div>
				</section>

				{/* Main Panel */}
				<section className="space-y-4 w-full">
					<h1 className="text-white font-bold text-2xl">{topicTab.name}</h1>
					<div className="flex gap-2">
						{lectureTabs.map((tab, index) => (
							<button
								key={tab.name}
								onClick={() => setSelectedTabIndex(index)}
								className={`flex justify-center items-center gap-2 px-4 py-2 rounded-lg duration-200 ${
									selectedTabIndex === index
										? "bg-[rgba(32,_33,_42,_1)] text-white"
										: "text-gray-400 hover:text-white hover:bg-[rgba(32,_33,_42,_1)]"
								}`}
							>
								<tab.icon className="h-4 w-4" /> {tab.name}
							</button>
						))}
					</div>
					{selectedTab.content}
				</section>
			</main>
		</main>
	)
}
