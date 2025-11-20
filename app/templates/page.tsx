'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PROMPT_TEMPLATES, PromptTemplate } from '@/lib/prompts/templates'
import { Copy, Check, Search, BookTemplate, Tag, ArrowRight } from 'lucide-react'

export default function TemplatesPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const categories = Array.from(new Set(PROMPT_TEMPLATES.map((t) => t.category)))

    const filteredTemplates = PROMPT_TEMPLATES.filter((template) => {
        const matchesSearch =
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCategory = selectedCategory ? template.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    const handleCopy = async (template: PromptTemplate) => {
        await navigator.clipboard.writeText(template.prompt)
        setCopiedId(template.id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleUseTemplate = (template: PromptTemplate) => {
        // Store template in localStorage to be picked up by home page
        localStorage.setItem('selectedTemplate', template.prompt)
        router.push('/')
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <section className="border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-2">
                            <BookTemplate className="h-3.5 w-3.5" />
                            Professional Library
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-900">
                            Prompt Templates
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Curated collection of high-performance prompts for every use case. Copy, customize, and deploy in seconds.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between animate-in">
                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <Button
                                onClick={() => setSelectedCategory(null)}
                                className={`notion-button-secondary text-sm h-9 ${
                                    selectedCategory === null ? 'bg-gray-900 text-white border-gray-900' : ''
                                }`}
                            >
                                All
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`notion-button-secondary text-sm h-9 capitalize ${
                                        selectedCategory === category ? 'bg-gray-900 text-white border-gray-900' : ''
                                    }`}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 notion-input h-10"
                            />
                        </div>
                    </div>

                    {/* Templates Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in">
                        {filteredTemplates.map((template) => (
                            <Card key={template.id} className="notion-card flex flex-col notion-interactive">
                                <div className="p-6 flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="notion-badge capitalize text-xs">
                                            {template.category}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => handleCopy(template)}
                                                className={`h-8 w-8 p-0 rounded-lg transition-all ${
                                                    copiedId === template.id
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : 'notion-button-secondary'
                                                }`}
                                            >
                                                {copiedId === template.id ? (
                                                    <Check className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {template.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {template.description}
                                    </p>

                                    {/* Preview */}
                                    <div className="mt-auto space-y-4">
                                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 font-mono line-clamp-3">
                                            {template.prompt}
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {template.tags.map((tag) => (
                                                <div
                                                    key={tag}
                                                    className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded"
                                                >
                                                    <Tag className="h-2.5 w-2.5" />
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Use Template Button */}
                                        <Button
                                            onClick={() => handleUseTemplate(template)}
                                            className="notion-button w-full text-sm h-9 gap-2"
                                        >
                                            Use Template
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-20 animate-in">
                            <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                            <p className="text-gray-600 text-sm">Try adjusting your search or category filters</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
