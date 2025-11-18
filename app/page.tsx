export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Welcome to EasyPrompt
        </h1>
        <p className="mb-4 text-center text-lg">
          AI Prompt Optimization Platform with Multi-Provider Support
        </p>
        <div className="mt-8 rounded-lg border border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold">Features</h2>
          <ul className="space-y-2">
            <li>✅ Multi-provider support (Anthropic, OpenAI, Google, Ollama, Hugging Face)</li>
            <li>✅ Real-time prompt analysis and optimization</li>
            <li>✅ Before/after comparison with actual AI responses</li>
            <li>✅ Local model support via Ollama (100% free, private)</li>
            <li>✅ Educational prompt engineering tips</li>
            <li>✅ Provider health monitoring</li>
          </ul>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Phase 1 Complete: Foundation Setup ✅
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Next.js 15 • React 19 • TypeScript 5.7 • Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  )
}
