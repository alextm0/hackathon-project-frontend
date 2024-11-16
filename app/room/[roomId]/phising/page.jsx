"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, XCircle, Mail, Shield, Flag } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const newMails = [
  {
    sender: "john.doe@example.com",
    subject: "Meeting Reminder",
    body: "Don't forget our meeting scheduled for tomorrow at 10 AM.",
    phish_reason: "",
  },
  {
    sender: "googleHR@gmail.com",
    subject: "Application Update",
    body: "We've decided to move you forward, click this link to proceed: https://interview_process.com",
    phish_reason: "Shady sender address and content",
  },
  {
    sender: "team@codeinvaders.com",
    subject: "Welcome to CodeInvaders",
    body: "Thank you for joining CodeInvaders. We're thrilled to have you on board!",
    phish_reason: "",
  },
  {
    sender: "finances@bcr.ro",
    subject: "Thank you for your loyalty",
    body: "Good news! Access this link to be able to enjoy 1000 euro added to your balance! https://get_my_money.ro",
    phish_reason: "Suspicious content, seems too good to be true, eh?",
  },
  {
    sender: "rewards@emag.com",
    subject: "Congratulations!",
    body: "You have just been selected as the winner of our giveaway: A promo code for 50% off on your next order! Redeem it here: https://giveaway_reward@emag.com.",
    phish_reason: "Poor grammar, suspicious activity",
  },
];

export default function PhishingDetector() {
  const [currentEmail, setCurrentEmail] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [emailIndex, setEmailIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastActionCorrect, setLastActionCorrect] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (emailIndex < newMails.length) {
      setCurrentEmail(newMails[emailIndex]);
    } else {
      setGameOver(true);
      setShowResults(true);
    }
  }, [emailIndex]);

  useEffect(() => {
    if (timeRemaining > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleAnswer(true); // Treat timeout as "Report as Phishing"
    }
  }, [timeRemaining, gameOver]);

  const handleAnswer = (reportAsPhishing) => {
    if (currentEmail) {
      const correct = reportAsPhishing === (currentEmail.phish_reason !== "");
      setLastActionCorrect(correct);
      setShowFeedback(true);

      if (correct) {
        setScore((prev) => prev + 10);
      } else {
        setLives((prev) => prev - 1);
        if (lives <= 1) {
          setGameOver(true);
          setShowResults(true);
        }
      }

      setUserAnswers((prev) => [
        ...prev,
        { email: currentEmail, userAnswer: reportAsPhishing, correct },
      ]);

      setTimeout(() => {
        setShowFeedback(false);
        setEmailIndex((prev) => prev + 1);
        setTimeRemaining(30);
      }, 2000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setEmailIndex(0);
    setTimeRemaining(30);
    setShowFeedback(false);
    setUserAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Phishing Email Detector
      </h1>

      <div className="flex flex-1 bg-gray-800 rounded-lg overflow-hidden border border-green-500">
        {/* Email List */}
        <div className="w-1/3 bg-gray-800 p-4 border-r border-green-500">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Shield className="text-green-500 mr-2" />
              <span className="font-mono">Score: {score}</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" />
              <span className="font-mono">Lives: {lives}</span>
            </div>
          </div>
          <Progress value={(timeRemaining / 30) * 100} className="mb-4" />
          <ScrollArea key={uuidv4()} className="h-[calc(100vh-200px)]">
            {newMails.map((email, index) => (
              <div
                key={uuidv4()}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  index === emailIndex ? "bg-green-900" : "hover:bg-gray-700"
                }`}
                onClick={() => !gameOver && setEmailIndex(index)}
              >
                <div className="font-mono">{email.sender}</div>
                <div className="text-sm text-green-300 truncate">
                  {email.subject}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Email Content */}
        <div className="flex-1 p-6 font-mono">
          {currentEmail && !gameOver && (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">
                  {currentEmail.subject}
                </h2>
                <div className="text-sm text-green-300 mb-2">
                  From: {currentEmail.sender}
                </div>
                <Separator className="my-4 bg-green-500" />
                <div className="text-green-100">{currentEmail.body}</div>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="flex items-center justify-center w-1/3 border-2 border-green-500 text-green-500 hover:bg-green-700 hover:text-white transition-all duration-300"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Legitimate
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  variant="destructive"
                  className="flex items-center justify-center w-1/3 bg-red-700 text-white hover:bg-red-600 transition-all duration-300"
                >
                  <Flag className="mr-2 w-5 h-5" />
                  Phishing
                </Button>
              </div>
            </>
          )}

          {showFeedback && (
            <div
              className={`mt-4 p-4 rounded-lg text-white ${
                lastActionCorrect ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {lastActionCorrect ? (
                <div className="flex items-center">
                  <CheckCircle className="mr-2" />
                  <span>
                    Correct! Good job identifying{" "}
                    {currentEmail.phish_reason
                      ? "the phishing attempt"
                      : "a legitimate email"}
                    .
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <XCircle className="mr-2" />
                  <span>
                    Oops! That was{" "}
                    {currentEmail.phish_reason
                      ? "a phishing attempt"
                      : "actually a legitimate email"}
                    .
                  </span>
                </div>
              )}
            </div>
          )}

          {showResults && (
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold mb-4">Game Over</h2>
              <p className="text-xl mb-4">Your final score: {score}</p>
              <Button
                onClick={resetGame}
                className="bg-green-600 hover:bg-green-700"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
