'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, XCircle, Mail, Shield } from 'lucide-react'

const emails = [
  {
    id: 1,
    sender: "security@yourbank.com",
    subject: "Urgent: Verify Your Account",
    content: "Dear valued customer, we've noticed suspicious activity on your account. Click here to verify your identity immediately.",
    isPhishing: true
  },
  {
    id: 2,
    sender: "friend@gmail.com",
    subject: "Check out this funny video",
    content: "Hey! I found this hilarious video and thought you'd enjoy it. Click the link to watch!",
    isPhishing: true
  },
  {
    id: 3,
    sender: "newsletter@legitcompany.com",
    subject: "Your Weekly Newsletter",
    content: "Here's your weekly roundup of industry news and updates. No action required.",
    isPhishing: false
  },
  {
    id: 4,
    sender: "support@fakeamazon.com",
    subject: "Your Amazon order",
    content: "Your recent order has been delayed. Please log in to your account to update your shipping information.",
    isPhishing: true
  },
  {
    id: 5,
    sender: "hr@yourcompany.com",
    subject: "Company Policy Update",
    content: "Please review the attached document for important updates to our company policies.",
    isPhishing: false
  }
]

export default function PhishingLevel() {
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [emailIndex, setEmailIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastActionCorrect, setLastActionCorrect] = useState(false)

  useEffect(() => {
    if (emailIndex < emails.length) {
      setCurrentEmail(emails[emailIndex])
    } else {
      setGameOver(true)
    }
  }, [emailIndex])

  useEffect(() => {
    if (timeRemaining > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleAnswer(true) // Treat timeout as "Report as Phishing"
    }
  }, [timeRemaining, gameOver])

  const handleAnswer = (reportAsPhishing) => {
    if (currentEmail) {
      const correct = reportAsPhishing === currentEmail.isPhishing
      setLastActionCorrect(correct)
      setShowFeedback(true)
      
      if (correct) {
        setScore(prev => prev + 10)
      } else {
        setLives(prev => prev - 1)
        if (lives <= 1) {
          setGameOver(true)
        }
      }

      setTimeout(() => {
        setShowFeedback(false)
        setEmailIndex(prev => prev + 1)
        setTimeRemaining(30)
      }, 2000)
    }
  }

  const fetchEmail = async () => {
    // Get request localhost:8080/mails 
  }

  const resetGame = () => {
    setScore(0)
    setLives(3)
    setGameOver(false)
    setEmailIndex(0)
    setTimeRemaining(30)
    setShowFeedback(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-green-500">Phishing Email Detector</h1>
      
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Shield className="text-green-500 mr-2" />
            <span>Score: {score}</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" />
            <span>Lives: {lives}</span>
          </div>
          <div>Time: {timeRemaining}s</div>
        </div>
        
        <Progress value={(timeRemaining / 30) * 100} className="mb-4" />

        {currentEmail && !gameOver && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <Mail className="mr-2" />
              <span className="font-bold">From: {currentEmail.sender}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Subject:</span> {currentEmail.subject}
            </div>
            <div className="border-t border-gray-600 pt-2">
              {currentEmail.content}
            </div>
          </div>
        )}

        {!gameOver && (
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => handleAnswer(false)}
              variant="secondary"
              className="w-1/2"
            >
              Seems Legitimate
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              variant="destructive"
              className="w-1/2"
            >
              Report as Phishing
            </Button>
          </div>
        )}

        {showFeedback && (
          <div className={`mt-4 p-2 rounded-lg text-center ${lastActionCorrect ? 'bg-green-600' : 'bg-red-600'}`}>
            {lastActionCorrect ? (
              <div className="flex items-center justify-center">
                <CheckCircle className="mr-2" />
                <span>Correct! Good job identifying {currentEmail?.isPhishing ? 'the phishing attempt' : 'a legitimate email'}.</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <XCircle className="mr-2" />
                <span>Oops! That was {currentEmail?.isPhishing ? 'a phishing attempt' : 'actually a legitimate email'}.</span>
              </div>
            )}
          </div>
        )}

        {gameOver && (
          <div className="text-center mt-4">
            <h2 className="text-2xl mb-4">Game Over</h2>
            <p className="mb-4">Your final score: {score}</p>
            <Button onClick={resetGame}>Play Again</Button>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-green-500">Phishing Email Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Check the senders email address for misspellings or unusual domains.</li>
          <li>Be wary of urgent or threatening language pushing you to act immediately.</li>
          <li>Hover over links to see the actual URL before clicking.</li>
          <li>Be cautious of emails asking for personal information or login credentials.</li>
          <li>Look for generic greetings instead of personalized ones.</li>
        </ul>
      </div>
    </div>
  )
}