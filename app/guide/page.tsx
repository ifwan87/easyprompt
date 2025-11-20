'use client'

import { Card } from '@/components/ui/card'
import { BookOpen, Lightbulb, AlertTriangle, CheckCircle2, Code2, Sparkles, Target, Zap, RefreshCw } from 'lucide-react'

export default function GuidePage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <section className="border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-2">
                            <BookOpen className="h-3.5 w-3.5" />
                            Master Class
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-900">
                            Prompt Engineering
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Learn the art and science of crafting effective prompts for AI models. From basics to advanced techniques.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Core Principles */}
                    <div className="space-y-6 animate-in">
                        <SectionHeader icon={Target} title="Core Principles" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <PrincipleCard
                                title="Clarity & Specificity"
                                description="Be precise about what you want. Avoid ambiguity and vague instructions."
                                icon={CheckCircle2}
                            />
                            <PrincipleCard
                                title="Context is King"
                                description="Provide background information, role, and constraints to guide the AI."
                                icon={Lightbulb}
                            />
                            <PrincipleCard
                                title="Format & Structure"
                                description="Define the desired output format (JSON, Markdown, List) explicitly."
                                icon={Code2}
                            />
                            <PrincipleCard
                                title="Iterative Refinement"
                                description="Start simple, then refine based on the output. It's a conversation."
                                icon={RefreshCw}
                            />
                        </div>
                    </div>

                    {/* Good vs Bad Examples */}
                    <div className="space-y-6 animate-in">
                        <SectionHeader icon={Zap} title="Good vs. Bad Prompts" />
                        <div className="space-y-4">
                            <ComparisonCard
                                bad="Write a blog post about AI."
                                good="Write a 1500-word technical blog post about the impact of Large Language Models on software development productivity. Target audience is senior engineers. Use a professional but engaging tone. Include 3 code examples."
                                explanation="The good prompt specifies length, topic, audience, tone, and content requirements."
                            />
                            <ComparisonCard
                                bad="Fix this code."
                                good="Analyze this Python function for time complexity and memory leaks. Suggest optimizations to reduce execution time by 50%. Explain your changes with comments."
                                explanation="The good prompt defines the specific type of analysis and the goal of the optimization."
                            />
                        </div>
                    </div>

                    {/* Advanced Techniques */}
                    <div className="space-y-6 animate-in">
                        <SectionHeader icon={Sparkles} title="Advanced Techniques" />
                        <div className="grid gap-6">
                            <TechniqueCard
                                title="Few-Shot Prompting"
                                description="Provide examples of inputs and desired outputs to teach the model the pattern."
                                example={`User: "Convert to emoji: Happy" → AI: "😊"
User: "Convert to emoji: Sad" → AI: "😢"
User: "Convert to emoji: Excited" → AI: ?`}
                            />
                            <TechniqueCard
                                title="Chain of Thought"
                                description="Ask the model to explain its reasoning step-by-step before giving the final answer."
                                example={`"Let's think step by step. First, identify the key variables..."`}
                            />
                            <TechniqueCard
                                title="Role Prompting"
                                description="Assign a specific persona to the AI to influence tone and expertise."
                                example={`"Act as a senior React developer with 10 years of experience..."`}
                            />
                        </div>
                    </div>

                </div>
            </section>
        </main>
    )
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType, title: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gray-100">
                <Icon className="h-5 w-5 text-gray-700" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
        </div>
    )
}

function PrincipleCard({
    title,
    description,
    icon: Icon,
}: {
    title: string
    description: string
    icon: React.ElementType
}) {
    return (
        <Card className="notion-card p-6">
            <div className="inline-block p-3 rounded-lg bg-gray-100 mb-4">
                <Icon className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </Card>
    )
}

function ComparisonCard({ bad, good, explanation }: { bad: string, good: string, explanation: string }) {
    return (
        <Card className="notion-card overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6 bg-red-50">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-red-900 uppercase text-xs tracking-wider">Weak Prompt</span>
                    </div>
                    <p className="text-gray-900 text-sm font-mono bg-white p-4 rounded-lg border border-red-200">
                        "{bad}"
                    </p>
                </div>
                <div className="p-6 bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-900 uppercase text-xs tracking-wider">Strong Prompt</span>
                    </div>
                    <p className="text-gray-900 text-sm font-mono bg-white p-4 rounded-lg border border-green-200">
                        "{good}"
                    </p>
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{explanation}</span>
                </div>
            </div>
        </Card>
    )
}

function TechniqueCard({ title, description, example }: { title: string, description: string, example: string }) {
    return (
        <Card className="notion-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        {title}
                        <span className="notion-badge text-[10px] uppercase bg-purple-50 text-purple-700 border-purple-200">
                            Advanced
                        </span>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
                </div>
                <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-xs text-gray-900 whitespace-pre-wrap">
                        {example}
                    </div>
                </div>
            </div>
        </Card>
    )
}
