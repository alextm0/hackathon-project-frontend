"use client";

import React, { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, XCircle, Mail, Shield, Flag } from "lucide-react";
import { v4 as uuidv4 } from "uuid";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const newMails = [
  {
    "sender": "john.doe@example.com",
    "subject": "Meeting Reminder",
    "body": "Don't forget our meeting scheduled for tomorrow at 10 AM.",
    "phish_reason": ""
  },
  {
    "sender": "googleHR@gmail.com",
    "subject": "Application Update",
    "body": "We've decided to move you forward, click this link to proceed: https://interview_process.com",
    "phish_reason": "Shady expeditor address and content"
  },
  {
    "sender": "team@codeinvaders.com",
    "subject": "Welcome to CodeInvaders",
    "body": "Thank you for joining CodeInvaders. We're thrilled to have you on board!",
    "phish_reason" : ""
  },
  {
    "sender": "finances@bcr.ro",
    "subject": "Thank you for your loyalty",
    "body": "Good news! Access this link to be able to enjoy 1000 euro added to your balance! https://get_my_money.ro",
    "phish_reason": "Suspicious content, seems too good to be true, eh?"
  },
  {
    "sender": "rewards@emag.com",
    "subject": "Conggratulations!",
    "body": "you Have just been selected as the winner of our giveaaway: A promo code for 50% off on youur next Order!. Redeem it here: https://giveaway_reward@emag.com.",
    "phish_reason": "Poor grammar, suspicious activity"
  },
  {
    "sender": "orders@emag.com",
    "subject": "Order update",
    "body": "Your order has been packed",
    "phish_reason": ""
  },
  {
    "sender": "recruitment@cloudflight.com",
    "subject": "Your job application",
    "body": "We received your application and are carefully reviewing it. We will keep in touch",
    "phish_reason": ""
  },
  {
    "sender": "rewards@fashion.com",
    "subject": "Conggratulations!",
    "body": "you Have just been selected as the winner of our giveaaway: A promo code for 80% off on youur next Order!. Redeem it here: https://giveaway_reward@emag.com.",
    "phish_reason": "Poor grammar, suspicious activity"
  }
  // {
  //   "sender": "support@banksecure.com",
  //   "subject": "Urgent: Your Account is on Hold",
  //   "body": "Dear user, We have detected suspicious activity on your account. Please click here immediately to verify your identity: https://verifyaccount_bank.com.",
  //   "phish_reason": "Urgent tone, suspicious link, generic greeting"
  // },
  // {
  //   "sender": "deals@electromart.com",
  //   "subject": "Congratulations! You Won a Free iPhone!",
  //   "body": "You are the lucky winner of our iPhone giveaway! Click here to claim your prize: http://iphone_giveaway.com.",
  //   "phish_reason": "Too good to be true, suspicious link"
  // },
  // {
  //   "sender": "info@legittravel.com",
  //   "subject": "Enjoy 10% off Your Next Vacation Booking",
  //   "body": "Dear valued customer, As a thank you for being with us, enjoy 10% off on your next booking with code TRAVEL10. Redeem here: https://legittravel.com/offers.",
  //   "phish_reason": ""
  // },
  // {
  //   "sender": "admin@securityalert-mail.com",
  //   "subject": "Immediate Action Required: Account Breach Detected",
  //   "body": "We have noticed unusual login attempts on your account. To protect your data, click the link to secure your account: https://account-protect@secure-mail.com.",
  //   "phish_reason": "Scare tactics, suspicious link, generic sender"
  // },
  // {
  //   "sender": "deals@fashionhub.com",
  //   "subject": "Exclusive Offer: 50% Off for a Limited Time!",
  //   "body": "Shop now and enjoy a 50% discount on all our items. No gimmicks, just use the code FALL50 at checkout: https://fashionhub.com/shop.",
  //   "phish_reason": ""
  // },
  // {
  //   "sender": "rewards@winbigprizes.com",
  //   "subject": "You’ve Won Big! Claim Your $1000 Gift Card Now",
  //   "body": "Click here to claim your $1000 gift card: http://winbigprizes-gift.com. Hurry, time is running out!",
  //   "phish_reason": "Excessive urgency, suspicious link"
  // },
  // {
  //   "sender": "customer-care@onlinebank.com",
  //   "subject": "Verify Your Account Now or It Will Be Suspended",
  //   "body": "Dear user, We noticed suspicious activity in your account. Please verify your details immediately to prevent suspension: https://onlinebank-verify.com.",
  //   "phish_reason": "Urgent tone, generic greeting, fake link"
  // },
  // {
  //   "sender": "promotions@electronicsworld.com",
  //   "subject": "Flash Sale: 30% Off on All Electronics",
  //   "body": "Don’t miss our limited-time offer! Enjoy 30% off sitewide. Use the promo code TECH30 at checkout: https://electronicsworld.com.",
  //   "phish_reason": ""
  // },
  // {
  //   "sender": "noreply@winnersclub.com",
  //   "subject": "You Have Won A Free Vacation! Confirm Now",
  //   "body": "Congratulations! You've won a free vacation. Click here to book your trip: http://winnersclub-freevacation.com.",
  //   "phish_reason": "Unbelievable offer, suspicious link"
  // },
  // {
  //   "sender": "offers@beautyco.com",
  //   "subject": "Beauty Sale! 25% Off All Skincare Products",
  //   "body": "Shop your favorite skincare items at a discount. Use code BEAUTY25 to save: https://beautyco.com/shop.",
  //   "phish_reason": ""
  // }
]

export default function PhishingDetector({params}) {
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

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await params; // Await the promise
        setRoomId(resolvedParams.roomId); // Use the resolved value
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };
  
    fetchParams(); // Call the async function inside the useEffect
  }, [params]);

  useEffect(() => {
    if (emailIndex < newMails.length) {
      setCurrentEmail(newMails[emailIndex]);
    } else {
      setGameOver(true);
      setShowResults(true);
      getWinning();
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
          getWinning();
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

  const getWinning = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/room/${roomId}/score/0`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (data.success === true) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        setMessage("You won the game!");
      } else {
        setMessage("You lost...");
      }

      setWinning(data.success);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching winning:", error);
      setWinning("Error fetching data");
      setLoading(false);
    }
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
              {loading ? (
                <p>Loading...</p> // Show loading text while waiting for the response
              ) : (
                <p className="text-xl font-bold text-green-600">
                  {message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
