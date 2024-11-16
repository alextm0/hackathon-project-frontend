'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Lock, Clock } from 'lucide-react';

export default function RansomwareScene() {
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [message, setMessage] = useState('');
  const [paidRansom, setPaidRansom] = useState(false);
  const [decryptionAttempts, setDecryptionAttempts] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);

  const HARD_CODED_KEY = 'DECRYPT123';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePayRansom = () => {
    setPaidRansom(true);
    setMessage('Ransom paid! Files are still locked. The attacker took the money and disappeared.');
  };

  const handleDecryptAttempt = () => {
    if (userInput === HARD_CODED_KEY) {
      setIsDecrypted(true);
      setMessage('Success! Your files have been decrypted.');
    } else {
      setDecryptionAttempts((prev) => prev + 1);
      setMessage(
        `Decryption failed. ${
          3 - decryptionAttempts > 0
            ? `${3 - decryptionAttempts} attempts remaining.`
            : 'No attempts remaining.'
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-center">Ransomware Attack Simulation</h1>

      <div className="relative w-full h-[600px] bg-gray-800 rounded-lg border border-green-500 overflow-hidden">
        {/* Computer screen */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-black border-4 border-gray-700 rounded-lg overflow-hidden">
          <div
            className={`w-full h-full p-4 flex flex-col items-center justify-center ${
              isDecrypted ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <AlertTriangle
              className={`${
                isDecrypted ? 'hidden' : 'text-yellow-300'
              } w-16 h-16 mb-4`}
            />
            <h2 className="text-white text-2xl font-bold mb-2">
              {isDecrypted
                ? 'Files Decrypted Successfully!'
                : 'Your Files Have Been Encrypted!'}
            </h2>
            {!isDecrypted && (
              <>
                <p className="text-white mb-4">Pay 1 BTC to unlock your files</p>
                <div className="bg-white w-24 h-24 mb-4"></div> {/* Placeholder for QR code */}
                <Lock className="text-white w-8 h-8" />
              </>
            )}
          </div>
        </div>

        {/* Timer */}
        <div className="absolute top-4 right-4 bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center">
          <Clock className="text-red-500 w-16 h-16" />
        </div>
        <div className="absolute top-28 right-4 text-red-500 text-xl">
          {formatTime(countdown)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handlePayRansom}
          disabled={paidRansom || isDecrypted}
          className={`px-6 py-2 font-bold rounded ${
            paidRansom || isDecrypted
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-700'
          }`}
        >
          Pay Ransom
        </button>
        <button
          onClick={handleDecryptAttempt}
          disabled={isDecrypted || decryptionAttempts >= 3}
          className={`px-6 py-2 font-bold rounded ${
            isDecrypted || decryptionAttempts >= 3
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          Attempt Decryption
        </button>
      </div>

      {/* Decrypt Input */}
      <div className="mt-6 flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter decryption key"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-64 p-2 mb-4 text-black rounded border border-gray-500"
          disabled={isDecrypted}
        />
        {message && (
          <div className="p-4 bg-gray-800 text-yellow-300 rounded-lg border border-yellow-500">
            {message}
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-800 p-4 rounded-lg border border-green-500">
        <h2 className="text-xl font-bold mb-4">Ransomware Attack Explanation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ransomware encrypts files on a device, making them inaccessible to the user.</li>
          <li>Attackers demand payment, often in cryptocurrency, to provide the decryption key.</li>
          <li>A countdown timer adds pressure, threatening permanent file loss if not paid in time.</li>
          <li>Ransomware can spread through phishing emails, infected websites, or network vulnerabilities.</li>
          <li>Regular backups and security updates are crucial for protection against ransomware.</li>
        </ul>
      </div>
    </div>
  );
}
