'use client'

import { PromptInput } from '@/components/features/PromptInput'
import { ProviderSelector } from '@/components/features/ProviderSelector'
import { AnalysisDisplay } from '@/components/features/AnalysisDisplay'
import { OptimizationDisplay } from '@/components/features/OptimizationDisplay'
import { usePrompt } from '@/components/hooks/use-prompt'
import { useProvider } from '@/components/hooks/use-provider'
import { Card } from '@/components/ui/card'
import { Sparkles, Zap, Shield, Globe, ArrowRight } from 'lucide-react'

export default function Home() {
  const {
    prompt,
    setPrompt,
    isAnalyzing,
    analysis,
    optimizationResult,
    error,
    handleAnalyze,
  } = usePrompt()

  const {
    providers,
    selectedProvider,
    selectedModel,
    setSelectedModel,
    handleProviderChange,
    isLoading: providersLoading,
  } = useProvider()

  const handleOptimize = () => {
    handleAnalyze(selectedProvider, selectedModel)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Minimal */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Optimization
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-900">
              Transform Your AI Prompts
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From amateur to professional with instant optimization across multiple AI providers
            </p>

            {/* Feature Pills - Minimal */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <FeaturePill icon={Sparkles}>
                AI Analysis
              </FeaturePill>
              <FeaturePill icon={Zap}>
                Real-time
              </FeaturePill>
              <FeaturePill icon={Globe}>
                Multi-Provider
              </FeaturePill>
              <FeaturePill icon={Shield}>
                100% Private
              </FeaturePill>
            </div>
          </div>
        </div>
      </section>

      {/* Main Editor Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Provider Selection */}
          <Card className="notion-card p-6 animate-in">
            <ProviderSelector
              providers={providers}
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              onProviderChange={handleProviderChange}
              onModelChange={setSelectedModel}
              isLoading={providersLoading}
            />
          </Card>

          {/* Prompt Input */}
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Prompt
              </h2>
              <div className="text-sm text-gray-500">
                {prompt.length} characters
              </div>
            </div>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleOptimize}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Error Display */}
          {error && (
            <Card className="notion-card border-red-200 bg-red-50 p-6 animate-in">
              <div className="text-red-900">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                  Error
                </h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </Card>
          )}

          {/* Results Grid */}
          {(analysis || optimizationResult) && (
            <div className="grid md:grid-cols-2 gap-6 animate-in">
              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gray-700" />
                    Analysis
                  </h2>
                  <AnalysisDisplay analysis={analysis} />
                </div>
              )}

              {/* Optimized Prompt */}
              {optimizationResult && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-gray-700" />
                    Optimized
                  </h2>
                  <OptimizationDisplay optimization={optimizationResult} />
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!isAnalyzing && !analysis && !optimizationResult && !error && (
            <Card className="notion-card p-16 text-center animate-in">
              <div className="max-w-md mx-auto space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Sparkles className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Ready to Optimize
                </h3>
                <p className="text-gray-600">
                  Enter your prompt above and click <strong>Optimize</strong> to get started
                </p>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section - Minimal */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              number="1"
              title="Enter Your Prompt"
              description="Type or paste your prompt. Select your preferred AI provider and model."
            />
            <FeatureCard
              number="2"
              title="AI Analysis"
              description="Our AI analyzes your prompt for clarity, specificity, and effectiveness."
            />
            <FeatureCard
              number="3"
              title="Get Optimized Results"
              description="Receive an improved prompt with detailed explanations of all changes."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeaturePill({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="notion-badge">
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  )
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <Card className="notion-card p-8 notion-interactive">
      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-6">
        <span className="text-xl font-semibold text-gray-900">{number}</span>
      </div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </Card>
  )
}
