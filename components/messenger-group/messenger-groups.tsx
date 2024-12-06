'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Send } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'

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
  const router = useRouter()  // Hook de redirection
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [groups, setGroups] = useState<string[]>([])
  const [groupMessages, setGroupMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [email, setEmail] = useState<string>("")  // Exemple d'email connecté
  const [prenom, setPrenom] = useState<string>("") // Exemple de prénom de l'utilisateur

  // Vérifier si l'utilisateur est connecté en récupérant l'email depuis le localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem('user_email') // Récupère l'email du localStorage
    if (userEmail) {
      setEmail(userEmail) // Mettre à jour l'état avec l'email récupéré
      
      // Extraire le prénom à partir de l'email (partie avant le '@')
      const extractedPrenom = userEmail.split('@')[0] // Prenom est tout ce qui est avant le '@'
      setPrenom(extractedPrenom.charAt(0).toUpperCase() + extractedPrenom.slice(1)) // Capitaliser la première lettre
    } else {
      // Rediriger l'utilisateur vers la page de connexion s'il n'est pas connecté
      console.error("Aucun email trouvé dans le localStorage")
      router.push('/connexion') // Redirection vers la page de connexion
    }
  }, [])

  // Charger les messages du groupe sélectionné
  useEffect(() => {
    if (!selectedGroup) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/salles?groupName=${selectedGroup}`)
        const data = await res.json()

        if (res.ok) {
          setGroupMessages(data)
        } else {
          console.error('Erreur:', data.message)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error)
      }


      try {
        const res = await fetch(`/api/groupes`)
        const data = await res.json()
        if (res.ok) {
          setGroups(data)
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
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      // Formatage de la date et de l'heure
      const now = new Date();
      const date = now.toLocaleDateString('fr-FR', {
        weekday: 'short', // Jour abrégé (ex. "lun.")
        year: 'numeric',
        month: 'short',  // Mois abrégé (ex. "janv.")
        day: 'numeric'
      });
      const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

      // Nouveau message avec date et heure
      const newMessageObj = {
        email,
        prenom,
        content: newMessage,
        timestamp: `${time} | ${date}`, // Combine l'heure et la date
      }

      // Envoyer le message au serveur pour l'ajouter dans le groupe
      try {
        const response = await fetch('/api/salles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            groupName: selectedGroup, // Nom du groupe sélectionné
            email,
            prenom,
            content: newMessage,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Mettre à jour l'état local pour afficher le message immédiatement
          setGroupMessages([...groupMessages, newMessageObj])
          setNewMessage("") // Réinitialiser le champ de message
        } else {
          console.error('Erreur lors de l\'ajout du message:', data.message)
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error)
      }
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        {/* Liste des groupes */}
        <Card className="w-full h-[500px] bg-white overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Groupes</h2>
            </div>
            <ScrollArea className="h-[calc(100%_-_64px)]">
              {groups.map((group) => (
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
          </CardContent>
        </Card>

        {/* Affichage des messages */}
        <Card className="w-full h-[500px] bg-white overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold flex items-center text-blue-600">
                <Users className="mr-2" />
                {selectedGroup ? selectedGroup : "Sélectionnez un groupe"}
              </h2>
            </div>

            {/* ScrollArea pour les messages */}
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {groupMessages.length > 0 ? (
                  groupMessages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex flex-col p-3 max-w-[80%] mb-2 rounded-lg",
                        message.email === email
                          ? "bg-blue-100 text-white self-start" // Message de l'utilisateur connecté
                          : "bg-gray-100 text-gray-800 self-end" // Message des autres
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-blue-700">{message.prenom}</span>
                        {/* Affichage de l'heure et de la date */}
                        <span className="text-xs text-blue-400">{message.timestamp}</span>
                      </div>
                      <p className="mt-1">{message.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Aucun message dans ce groupe</p>
                )}
              </div>
            </ScrollArea>

            {/* Zone de saisie et envoi de message */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
