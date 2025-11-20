'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptInputProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    isAnalyzing: boolean
    maxLength?: number
}

export function PromptInput({
    value,
    onChange,
    onSubmit,
    isAnalyzing,
    maxLength = 2000,
}: PromptInputProps) {
    const [charCount, setCharCount] = useState(0)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        setCharCount(value.length)
    }, [value])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            onSubmit()
        }
    }

    const percentage = (charCount / maxLength) * 100
    const isNearLimit = percentage > 90
    const isApproachingLimit = percentage > 70

    return (
        <Card className={cn(
            "notion-card transition-all duration-150",
            isFocused && "border-gray-300 shadow-sm"
        )}>
            <div className="relative">
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your prompt here... (⌘+Enter to optimize)"
                    className="min-h-[200px] resize-none border-0 bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 leading-relaxed p-4"
                    maxLength={maxLength}
                />

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50/50">
                    {/* Character Counter */}
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "text-xs font-medium tabular-nums transition-colors",
                            isNearLimit
                                ? "text-red-600"
                                : isApproachingLimit
                                    ? "text-orange-600"
                                    : "text-gray-500"
                        )}>
                            {charCount} / {maxLength}
                        </span>

                        {/* Simple Progress Bar */}
                        {charCount > 0 && (
                            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-200 rounded-full",
                                        isNearLimit
                                            ? "bg-red-500"
                                            : isApproachingLimit
                                                ? "bg-orange-500"
                                                : "bg-gray-900"
                                    )}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={onSubmit}
                        disabled={!value.trim() || isAnalyzing}
                        className={cn(
                            "notion-button h-9 px-4 text-sm gap-2",
                            "disabled:opacity-40"
                        )}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                <span>Optimize</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
