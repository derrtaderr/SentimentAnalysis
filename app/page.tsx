'use client'

import { useState } from 'react'
import { pipeline } from '@xenova/transformers'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, HelpCircle } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<{ label: string; score: number } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeSentiment = async () => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const classifier = await pipeline('sentiment-analysis')
      const result = await classifier(text)
      setResult(result[0])
    } catch (err) {
      setError('An error occurred during analysis. Please try again.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'POSITIVE':
        return 'bg-green-100 text-green-800'
      case 'NEGATIVE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">EmotionEcho</CardTitle>
          <CardDescription>Analyze the sentiment of your text</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your text here (max 500 characters)"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              rows={5}
            />
            <div className="flex justify-between items-center">
              <Button onClick={analyzeSentiment} disabled={isAnalyzing || text.length === 0}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>How to use EmotionEcho</DialogTitle>
                    <DialogDescription>
                      EmotionEcho uses AI to analyze the sentiment of your text. Simply enter your text in the input field and click &quot;Analyze Sentiment&quot;. The result will show whether the sentiment is positive, negative, or neutral, along with a confidence score.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <div className={`p-4 rounded-md ${getSentimentColor(result.label)}`}>
                <p className="font-semibold">Sentiment: {result.label}</p>
                <p>Confidence: {(result.score * 100).toFixed(2)}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

