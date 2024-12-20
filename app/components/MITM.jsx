'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Network, Lock, Unlock, Terminal, AlertTriangle, CheckCircle, Award } from 'lucide-react'
import Timer from './Timer'

const INITIAL_TIME = 600 // 10 minutes in seconds
const POINTS_PER_FIX = 100
const TIME_BONUS_MULTIPLIER = 10

const initialPackets = [
  { id: 1, from: 'Client', to: 'Server', data: 'Hello, Server!', encrypted: false, tampered: false, score: 0 },
  { id: 2, from: 'Server', to: 'Client', data: 'Hello, Client!', encrypted: false, tampered: true, originalData: 'Hello, Client!', score: POINTS_PER_FIX },
  { id: 3, from: 'Client', to: 'Server', data: 'Please send me the secret file.', encrypted: false, tampered: false, score: 0 },
  { id: 4, from: 'Server', to: 'Client', data: 'Here is the secret file: COMPROMISED_DATA', encrypted: false, tampered: true, originalData: 'Here is the secret file: TOP_SECRET_INFO', score: POINTS_PER_FIX },
  { id: 5, from: 'Client', to: 'Server', data: 'Thanks for the file!', encrypted: false, tampered: false, score: 0 },
  { id: 6, from: 'Attacker', to: 'Client', data: 'I am the real server, send me your credentials.', encrypted: false, tampered: true, originalData: null, score: POINTS_PER_FIX },
]

export default function MITMSimulation() {
  const [packets, setPackets] = useState(initialPackets)
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)
  const [gameOver, setGameOver] = useState(false)
  const [selectedPacket, setSelectedPacket] = useState(null)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState(['Welcome to the MITM Defense Terminal. Type "help" for available commands.'])
  const [secureChannelEstablished, setSecureChannelEstablished] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameOver(true)
    }
  }, [timeLeft, gameOver])

  useEffect(() => {
    if (packets.every(packet => !packet.tampered) && !gameOver) {
      setSecureChannelEstablished(true)
      const totalScore = calculateTotalScore()
      setScore(totalScore)
      setGameOver(true)
    }
  }, [packets, gameOver])

  const handlePacketClick = (packet) => {
    setSelectedPacket(packet)
  }

  const calculateTotalScore = () => {
    const packetScore = packets.reduce((total, packet) => total + (packet.tampered ? 0 : packet.score), 0)
    const timeBonus = timeLeft * TIME_BONUS_MULTIPLIER
    return packetScore + timeBonus
  }

  const handleTerminalCommand = (e) => {
    e.preventDefault()
    const command = terminalInput.trim().toLowerCase()
    let output = ''

    const [action, ...args] = command.split(' ')

    switch (action) {
      case 'help':
        output = "Available commands: view, verify, encrypt, decrypt, fix, send"
        break
      case 'view':
        output = packets.map(p => `${p.id}: ${p.from} -> ${p.to}: ${p.data} ${p.encrypted ? '(Encrypted)' : ''} ${p.tampered ? '(Tampered)' : ''}`).join('\n')
        break
      case 'verify':
        if (args[0]) {
          const packet = packets.find(p => p.id === parseInt(args[0]))
          if (packet) {
            output = packet.tampered ? "This packet has been tampered with!" : "This packet is authentic."
          } else {
            output = "Packet not found."
          }
        } else {
          output = "Please specify a packet ID."
        }
        break
      case 'encrypt':
        if (args[0] && args[1]) {
          const packet = packets.find(p => p.id === parseInt(args[0]))
          if (packet) {
            setPackets(packets.map(p => p.id === packet.id ? {...p, data: `ENCRYPTED(${p.data})`, encrypted: true} : p))
            output = "Packet encrypted successfully."
          } else {
            output = "Packet not found."
          }
        } else {
          output = "Please specify a packet ID and encryption key."
        }
        break
      case 'decrypt':
        if (args[0] && args[1]) {
          const packet = packets.find(p => p.id === parseInt(args[0]))
          if (packet && packet.encrypted) {
            setPackets(packets.map(p => p.id === packet.id ? {...p, data: p.data.replace('ENCRYPTED(', '').replace(')', ''), encrypted: false} : p))
            output = "Packet decrypted successfully."
          } else {
            output = "Packet not found or not encrypted."
          }
        } else {
          output = "Please specify a packet ID and decryption key."
        }
        break
      case 'fix':
        if (args[0]) {
          const packet = packets.find(p => p.id === parseInt(args[0]))
          if (packet && packet.tampered) {
            setPackets(packets.map(p => p.id === packet.id ? {...p, data: p.originalData, tampered: false} : p))
            setScore(prevScore => prevScore + packet.score)
            output = "Packet fixed successfully."
          } else {
            output = "Packet not found or not tampered."
          }
        } else {
          output = "Please specify a packet ID."
        }
        break
      case 'send':
        if (args[0]) {
          const packet = packets.find(p => p.id === parseInt(args[0]))
          if (packet) {
            output = "Packet sent successfully."
          } else {
            output = "Packet not found."
          }
        } else {
          output = "Please specify a packet ID."
        }
        break
      default:
        output = "Unknown command. Type 'help' for available commands."
    }

    setTerminalOutput(prev => [...prev, `$ ${command}`, output])
    setTerminalInput('')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-6 font-mono">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-500">Man-in-the-Middle Attack Simulation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-green-500 flex flex-col items-center justify-center">
          <Timer timeLeft={timeLeft} initialTime={INITIAL_TIME} />
          <div className="mt-4 flex items-center">
            <Award className="mr-2 text-yellow-500" />
            <span className="text-xl">Score: {score}</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-green-500 col-span-1 md:col-span-2 md:row-span-2">
          <h2 className="text-xl mb-4 flex items-center">
            <Network className="mr-2" />
            Network Traffic
          </h2>
          <div className="space-y-2 h-96 overflow-y-auto custom-scrollbar">
            {packets.map(packet => (
              <div
                key={packet.id}
                className={`flex items-center cursor-pointer hover:bg-gray-700 p-3 rounded transition-colors duration-200 ${selectedPacket?.id === packet.id ? 'bg-gray-700' : ''}`}
                onClick={() => handlePacketClick(packet)}
              >
                <span className="mr-2 text-green-300">#{packet.id}</span>
                <span className="mr-2 flex-grow">{packet.from} → {packet.to}</span>
                {packet.encrypted ? <Lock className="mr-2 text-yellow-500" /> : <Unlock className="mr-2 text-red-500" />}
                {packet.tampered && <AlertTriangle className="mr-2 text-red-500" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
          <h2 className="text-xl mb-4 flex items-center">
            <AlertTriangle className="mr-2" />
            Packet Details
          </h2>
          {selectedPacket ? (
            <div className="space-y-2">
              <p><strong>From:</strong> {selectedPacket.from}</p>
              <p><strong>To:</strong> {selectedPacket.to}</p>
              <p><strong>Data:</strong> {selectedPacket.data}</p>
              <p><strong>Encrypted:</strong> {selectedPacket.encrypted ? 'Yes' : 'No'}</p>
              <p><strong>Tampered:</strong> {selectedPacket.tampered ? 'Yes' : 'No'}</p>
              <p><strong>Score Value:</strong> {selectedPacket.score}</p>
            </div>
          ) : (
            <p>Select a packet to view its details.</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-green-500 col-span-1 md:col-span-3">
          <h2 className="text-xl mb-4 flex items-center">
            <Terminal className="mr-2" />
            MITM Defense Terminal
          </h2>
          <div className="bg-black p-2 rounded h-64 overflow-y-auto custom-scrollbar mb-2">
            {terminalOutput.map((line, index) => (
              <p key={index} className={line.startsWith('$') ? 'text-blue-400' : ''}>{line}</p>
            ))}
          </div>
          <form onSubmit={handleTerminalCommand} className="flex">
            <Input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-grow bg-gray-900 text-green-400 border-green-500"
              placeholder="Enter command..."
            />
            <Button type="submit" className="ml-2 bg-green-600 hover:bg-green-700 text-black">
              Execute
            </Button>
          </form>
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center border-2 border-green-500">
            <h2 className="text-3xl mb-4">
              {secureChannelEstablished ? (
                <>
                  <CheckCircle className="inline-block mr-2 text-green-500" /> Secure Channel Established!
                  {/* HERE WAITING FOR THE OTHER USER */}
                </>
              ) : (
                <><AlertTriangle className="inline-block mr-2 text-red-500" /> Time is up! Communication compromised.</>
              )}
            </h2>
            <p className="text-2xl mb-4">Final Score: {score}</p>

          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-green-500">
        <h2 className="text-xl font-bold mb-4">MITM Attack Prevention Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Always use encrypted connections (HTTPS) for sensitive data.</li>
          <li>Implement and verify digital signatures for data integrity.</li>
          <li>Use strong authentication methods like two-factor authentication.</li>
          <li>Be cautious when connecting to public Wi-Fi networks.</li>
          <li>Keep your systems and software up-to-date with the latest security patches.</li>
        </ul>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 20px;
        }
        .glow {
          text-shadow: 0 0 5px #4ade80, 0 0 10px #4ade80;
        }
      `}</style>
    </div>
  )
}