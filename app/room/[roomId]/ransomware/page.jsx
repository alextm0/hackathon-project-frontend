'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, File, Lock, Unlock, Clock, Search, AlertTriangle, Terminal, Award } from 'lucide-react'
import Timer from "../../../components/Timer"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const INITIAL_TIME = 300 // 5 minutes in seconds
const DECRYPTION_KEY = "7H3_QU1CK_BR0WN_F0X"
const POINTS_PER_DECRYPT = 100
const TIME_BONUS_MULTIPLIER = 10

const initialFiles = [
  { id: '1', name: 'documents', type: 'folder', encrypted: false, content: [], score: 0 },
  { id: '2', name: 'pictures', type: 'folder', encrypted: false, content: [], score: 0 },
  { id: '3', name: 'important.docx', type: 'file', encrypted: true, content: "This file contains sensitive information.", score: POINTS_PER_DECRYPT },
  { id: '4', name: 'budget.xlsx', type: 'file', encrypted: true, content: "Financial projections for Q3", score: POINTS_PER_DECRYPT },
  { id: '5', name: 'family_photo.jpg', type: 'file', encrypted: true, content: "Family vacation photo", score: POINTS_PER_DECRYPT },
  { id: '6', name: 'system.log', type: 'file', encrypted: false, content: "Last login: user123\nSuspicious activity detected at 03:14\nFile access pattern: QU1CK", score: 0 },
  { id: '7', name: 'notes.txt', type: 'file', encrypted: false, content: "Remember to check the hidden files! Use 'ls -a' in the terminal.", score: 0 },
  { id: '8', name: '.secret', type: 'file', encrypted: false, content: "The brown fox jumps over the lazy dog", score: 0 },
  { id: '9', name: 'readme.md', type: 'file', encrypted: false, content: "Project codename: 7H3", score: 0 },
]

export default function RansomwareMitigation({params}) {
  const [files, setFiles] = useState(initialFiles)
  const [currentDirectory, setCurrentDirectory] = useState('/')
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)
  const [decryptionKey, setDecryptionKey] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState(['Welcome to the Cybersecurity Terminal. Type "help" for available commands.'])
  const [score, setScore] = useState(0)

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    setRoomId(params.roomId);
  }, [params]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameOver(true)
      getWinning();
    }
  }, [timeLeft, gameOver])

  const calculateTotalScore = () => {
    const fileScore = files.reduce((total, file) => total + (file.encrypted ? 0 : file.score), 0)
    const timeBonus = timeLeft * TIME_BONUS_MULTIPLIER
    return fileScore + timeBonus
  }

  const handleDecrypt = () => {
    if (decryptionKey === DECRYPTION_KEY) {
      const decryptedFiles = files.map(file => ({ ...file, encrypted: false }))
      setFiles(decryptedFiles)
      const totalScore = calculateTotalScore()
      setScore(totalScore)
      setGameOver(true)
      setTerminalOutput([...terminalOutput, "Decryption successful! All files have been restored."])
      getWinning();
    } else {
      setTerminalOutput([...terminalOutput, "Incorrect decryption key. Try again!"])
    }
  }

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      setCurrentDirectory(currentDirectory === '/' ? `/${file.name}` : `${currentDirectory}/${file.name}`)
    } else {
      setSelectedFile(file)
    }
  }

  const getCurrentDirectoryFiles = () => {
    if (currentDirectory === '/') {
      return files.filter(file => !file.name.startsWith('.'))
    } else {
      const folder = files.find(f => f.name === currentDirectory.slice(1))
      return folder ? folder.content.filter(file => !file.name.startsWith('.')) : []
    }
  }

  const handleTerminalCommand = (e) => {
    e.preventDefault()
    const command = terminalInput.trim().toLowerCase()
    let output = ''

    switch (command) {
      case 'help':
        output = "Available commands: ls, cat, cd, pwd, help"
        break
      case 'ls':
        output = getCurrentDirectoryFiles().map(f => f.name).join('\n')
        break
      case 'ls -a':
        output = files.map(f => f.name).join('\n')
        break
      case 'pwd':
        output = currentDirectory
        break
      case 'cd ..':
        if (currentDirectory !== '/') {
          setCurrentDirectory('/')
          output = "Changed directory to /"
        } else {
          output = "Already in root directory"
        }
        break
      default:
        if (command.startsWith('cat ')) {
          const fileName = command.split(' ')[1]
          const file = files.find(f => f.name === fileName)
          if (file) {
            output = file.encrypted ? "This file is encrypted." : file.content
          } else {
            output = "File not found"
          }
        } else if (command.startsWith('cd ')) {
          const dirName = command.split(' ')[1]
          const dir = files.find(f => f.name === dirName && f.type === 'folder')
          if (dir) {
            setCurrentDirectory(`/${dirName}`)
            output = `Changed directory to /${dirName}`
          } else {
            output = "Directory not found"
          }
        } else {
          output = "Unknown command. Type 'help' for available commands."
        }
    }

    setTerminalOutput([...terminalOutput, `$ ${command}`, output])
    setTerminalInput('')
  }

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching winning:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-6 font-mono">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-500">Ransomware Mitigation Simulation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-green-500 flex flex-col items-center justify-center">
          <Timer timeLeft={timeLeft} initialTime={INITIAL_TIME} />
          <div className="mt-4 flex items-center">
            <Award className="mr-2 text-yellow-500" />
            <span className="text-xl">Score: {score}</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
          <h2 className="text-xl mb-4 flex items-center">
            <Search className="mr-2" />
            File Explorer ({currentDirectory})
          </h2>
          <div className="space-y-2">
            {currentDirectory !== '/' && (
              <div
                className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
                onClick={() => setCurrentDirectory('/')}
              >
                <Folder className="mr-2" />
                ..
              </div>
            )}
            {getCurrentDirectoryFiles().map(file => (
              <div
                key={file.id}
                className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
                onClick={() => handleFileClick(file)}
              >
                {file.type === 'folder' ? <Folder className="mr-2" /> : <File className="mr-2" />}
                {file.name}
                {file.encrypted ? <Lock className="ml-auto text-red-500" /> : <Unlock className="ml-auto text-green-500" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-green-500 col-span-1 md:col-span-2">
          <h2 className="text-xl mb-4 flex items-center">
            <AlertTriangle className="mr-2" />
            File Content
          </h2>
          {selectedFile ? (
            selectedFile.encrypted ? (
              <p className="text-red-500">This file is encrypted and cannot be accessed.</p>
            ) : (
              <p>{selectedFile.content}</p>
            )
          ) : (
            <p>Select a file to view its contents.</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-green-500 col-span-1 md:col-span-2">
          <h2 className="text-xl mb-4 flex items-center">
            <Terminal className="mr-2" />
            Cybersecurity Terminal
          </h2>
          <div className="bg-black p-2 rounded h-40 overflow-y-auto mb-2">
            {terminalOutput.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <form onSubmit={handleTerminalCommand} className="flex">
            <Input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-grow bg-gray-900 text-green-500 border-green-500"
              placeholder="Enter command..."
            />
            <Button type="submit" className="ml-2 bg-green-600 hover:bg-green-700 text-white">
              Execute
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <Input
          type="text"
          placeholder="Enter decryption key"
          value={decryptionKey}
          onChange={(e) => setDecryptionKey(e.target.value)}
          className="bg-gray-800 text-green-500 border-green-500"
        />
        <Button onClick={handleDecrypt} className="bg-green-600 hover:bg-green-700 text-white">
          Decrypt Files
        </Button>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center border-2 border-green-500">
            <h2 className="text-3xl mb-4">
              {timeLeft > 0 ? "Congratulations! You decrypted the files!" : "Time's up! Data destroyed."}
            </h2>
            <p className="text-2xl mb-4">Final Score: {score}</p>
            {loading ? (
                <p>Loading...</p> // Show loading text while waiting for the response
              ) : (
                <p className="text-xl font-bold text-green-600">
                  {message}
                </p>
              )}
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-green-500">
        <h2 className="text-xl font-bold mb-4">Available Terminal Commands</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>ls</code>: List visible files in the current directory</li>
          <li><code>ls -a</code>: List all files, including hidden ones</li>
          <li><code>cat [filename]</code>: Display the contents of a file</li>
          <li><code>cd [directory]</code>: Change to the specified directory</li>
          <li><code>cd ..</code>: Move up one directory level</li>
          <li><code>pwd</code>: Print the current working directory</li>
          <li><code>help</code>: Display available commands</li>
        </ul>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-green-500">
        <h2 className="text-xl font-bold mb-4">Ransomware Mitigation Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Regularly backup your data to secure, offline locations.</li>
          <li>Keep your operating system and software up to date.</li>
          <li>Use robust antivirus and anti-malware software.</li>
          <li>Be cautious when opening email attachments or clicking on links.</li>
          <li>Implement network segmentation to limit the spread of ransomware.</li>
        </ul>
      </div>

      <style jsx global>{`
        .glow {
          text-shadow: 0 0 5px #4ade80, 0 0 10px #4ade80;
        }
      `}</style>
    </div>
  )
}