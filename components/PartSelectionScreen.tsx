import { ArrowLeft, BookOpen, Brain, Globe, Sparkles } from 'lucide-react'
import React from 'react'
import { PART_CONFIG } from '../constants'
import { Subject } from '../types'

interface PartSelectionScreenProps {
	subject: Subject
	onSelectPart: (partIndex: number) => void
	onBack: () => void
}

const getSubjectConfig = (subject: Subject) => {
	const configs = {
		philosophy: {
			name: 'Philosophy',
			icon: BookOpen,
			bgClass: 'bg-brand-100',
			textClass: 'text-brand-600',
			ringClass: 'ring-brand-500',
			hoverClass: 'hover:border-brand-500'
		},
		psychology: {
			name: 'Psychology',
			icon: Brain,
			bgClass: 'bg-purple-100',
			textClass: 'text-purple-600',
			ringClass: 'ring-purple-500',
			hoverClass: 'hover:border-purple-500'
		},
		culturology: {
			name: 'Culturology',
			icon: Globe,
			bgClass: 'bg-teal-100',
			textClass: 'text-teal-600',
			ringClass: 'ring-teal-500',
			hoverClass: 'hover:border-teal-500'
		},
		psychocultural: {
			name: 'Psychology + Culture',
			icon: Sparkles,
			bgClass: 'bg-amber-100',
			textClass: 'text-amber-600',
			ringClass: 'ring-amber-500',
			hoverClass: 'hover:border-amber-500'
		}
	}
	return configs[subject]
}

export const PartSelectionScreen: React.FC<PartSelectionScreenProps> = ({
	subject,
	onSelectPart,
	onBack
}) => {
	const partConfig = PART_CONFIG[subject]
	const subjectConfig = getSubjectConfig(subject)
	const Icon = subjectConfig.icon

	// Calculate question ranges for each part
	const getQuestionRange = (partIndex: number) => {
		let start = 1
		for (let i = 0; i < partIndex; i++) {
			start += partConfig.questionsPerPart[i]
		}
		const end = start + partConfig.questionsPerPart[partIndex] - 1
		return { start, end }
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

				{/* Back button */}
				<button
					onClick={onBack}
					className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
				>
					<ArrowLeft size={20} />
					<span className="font-medium">Back</span>
				</button>

				{/* Header */}
				<div className="space-y-4">
					<div className={`inline-flex items-center justify-center p-4 ${subjectConfig.bgClass} rounded-2xl shadow-lg mb-4`}>
						<Icon className={`w-12 h-12 ${subjectConfig.textClass}`} />
					</div>
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
						{subjectConfig.name}
					</h1>
					<p className="text-xl text-gray-500 max-w-2xl mx-auto">
						Select a part to practice. Each part contains a specific set of questions.
					</p>
				</div>

				{/* Parts Grid */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
					{Array.from({ length: partConfig.partCount }).map((_, index) => {
						const range = getQuestionRange(index)
						const questionCount = partConfig.questionsPerPart[index]

						return (
							<button
								key={index}
								onClick={() => onSelectPart(index)}
								className={`group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent ${subjectConfig.hoverClass} transition-all text-left overflow-hidden`}
							>
								<div className={`absolute top-2 right-2 w-10 h-10 ${subjectConfig.bgClass} rounded-full flex items-center justify-center`}>
									<span className={`text-lg font-bold ${subjectConfig.textClass}`}>
										{index + 1}
									</span>
								</div>

								<div className="space-y-3 mt-2">
									<h3 className="text-xl font-bold text-gray-900">
										Part {index + 1}
									</h3>
									<div className="space-y-1 text-sm text-gray-500">
										<p className="font-medium">
											Questions {range.start} - {range.end}
										</p>
										<p>
											{questionCount} questions
										</p>
									</div>
								</div>

								<div className={`mt-4 text-sm font-semibold ${subjectConfig.textClass} group-hover:translate-x-1 transition-transform`}>
									Start Practice →
								</div>
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}
