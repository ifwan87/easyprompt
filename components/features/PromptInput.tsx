'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Wand2, Sparkles } from 'lucide-react'
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

    useEffect(() => {
        setCharCount(value.length)
    }, [value])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            onSubmit()
        }
    }

    return (
        <Card className="glass-card border-0 p-1">
            <div className="relative">
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your prompt here... (Cmd+Enter to analyze)"
                    className="min-h-[200px] resize-none border-0 bg-transparent text-lg focus-visible:ring-0"
                    maxLength={maxLength}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-4">
                    <span className={cn(
                        "text-xs transition-colors",
                        charCount > maxLength * 0.9 ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--muted-foreground))]"
                    )}>
                        {charCount}/{maxLength}
                    </span>
                    <Button
                        onClick={onSubmit}
                        disabled={!value.trim() || isAnalyzing}
                        className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] hover:opacity-90 transition-opacity"
                    >
                        {isAnalyzing ? (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Optimize
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
