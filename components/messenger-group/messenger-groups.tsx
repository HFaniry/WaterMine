"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

export type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

type MessengerGroupCardProps = {
  groupName: string
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function MessengerGroupCard({ groupName, messages, onSendMessage }: MessengerGroupCardProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleMessages(messages.slice(-6))
    scrollToBottom()
  }, [messages])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget
    if (scrollTop === 0 && visibleMessages.length < messages.length) {
      const moreMessages = messages.slice(
        Math.max(0, messages.length - visibleMessages.length - 6),
        messages.length - visibleMessages.length
      )
      setVisibleMessages(prevMessages => [...moreMessages, ...prevMessages])
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)]">
      <CardHeader>
        <CardTitle>{groupName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea 
          className="h-full px-4" 
          ref={scrollAreaRef}
          onScroll={handleScroll}
        >
          {visibleMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`} />
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{message.sender}</span>
                <span className="text-sm text-muted-foreground">{message.content}</span>
                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer le message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

