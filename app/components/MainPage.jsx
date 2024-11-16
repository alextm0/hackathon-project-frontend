"use client"
import { Button } from '@/components/ui/button'
import React from 'react'

function MainPage() {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-lg text-gray-700 mb-8">Entry page for user</h1>
      <div className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded transition-colors"
            onClick={() => console.log('Create room clicked')}
          >
            Create room
          </Button>
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded transition-colors"
            onClick={() => console.log('Join room clicked')}
          >
            Join room
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MainPage