'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Send } from 'lucide-react'
import { cn } from "@/lib/utils"

// Types pour nos données
type Message = {
  email: string
  prenom: string
  content: string
  timestamp: string
}

type Group = {
  name: string
  messages: Message[]
}

export default function MessengerGroups() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [groupMessages, setGroupMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [email, setEmail] = useState<string>("fan@gmail.com") // Exemple d'email connecté

  // Charger les messages du groupe sélectionné
  useEffect(() => {
    if (!selectedGroup) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/salles?groupName=${selectedGroup}`)
        const data = await res.json()

        if (res.ok) {
          setGroupMessages(data[selectedGroup] || [])
        } else {
          console.error('Erreur:', data.message)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error)
      }
    }

    fetchData()
  }, [selectedGroup])

  // Envoyer un message
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMessageObj = {
        email,
        prenom: "Fan", // Par exemple, récupérer le prénom de l'utilisateur connecté
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      }

      // Mettre à jour les messages du groupe sélectionné
      setGroupMessages([...groupMessages, newMessageObj])
      setNewMessage("") // Réinitialiser le champ de message
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardContent className="p-0">
        <div className="grid grid-cols-[300px_1fr] h-[600px]">
          {/* Liste des groupes */}
          <div className="border-r border-gray-200 bg-gray-100">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Groupes</h2>
            </div>
            <ScrollArea className="h-[calc(600px-64px)]">
              {['Groupe1', 'Groupe2'].map((group) => (
                <div
                  key={group}
                  className={cn(
                    "flex items-center space-x-4 p-4 hover:bg-blue-50 cursor-pointer",
                    selectedGroup === group ? "bg-blue-100" : ""
                  )}
                  onClick={() => setSelectedGroup(group)}
                >
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={group} />
                    <AvatarFallback>{group.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">{group}</p>
                    <p className="text-sm text-gray-500 truncate">Dernier message...</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Affichage des messages */}
          <div className="flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold flex items-center text-blue-600">
                <Users className="mr-2" />
                {selectedGroup ? selectedGroup : "Sélectionnez un groupe"}
              </h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {groupMessages.length > 0 ? (
                  groupMessages.map((message, index) => (
                    <div key={index} className="flex flex-col bg-blue-50 rounded-lg p-3 max-w-[80%] mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-blue-700">{message.prenom}</span>
                        <span className="text-xs text-blue-400">{message.timestamp}</span>
                      </div>
                      <p className="mt-1 text-gray-700">{message.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Aucun message dans ce groupe</p>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Écrivez un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
