"use client"

import { useState } from 'react'
import { GroupList } from './groupe-list'
import { MessengerGroupCard, Message } from './messenger-groups'

type Group = {
  id: string
  name: string
  messages: Message[]
}

const initialGroups: Group[] = [
  {
    id: "1",
    name: "Projet Awesome",
    messages: [
      { id: 1, sender: "Alice", content: "Bonjour tout le monde !", timestamp: "10:00" },
      { id: 2, sender: "Bob", content: "Salut Alice !", timestamp: "10:01" },
      { id: 3, sender: "Charlie", content: "Hey, comment ça va ?", timestamp: "10:02" },
      { id: 4, sender: "Alice", content: "Très bien, merci !", timestamp: "10:03" },
      { id: 5, sender: "Bob", content: "Que faites-vous aujourd'hui ?", timestamp: "10:04" },
      { id: 6, sender: "Charlie", content: "Je travaille sur un projet.", timestamp: "10:05" },
      { id: 7, sender: "Alice", content: "Moi aussi, c'est un projet passionnant !", timestamp: "10:06" },
    ]
  },
  {
    id: "2",
    name: "Équipe Marketing",
    messages: [
      { id: 1, sender: "David", content: "Bonjour l'équipe !", timestamp: "09:30" },
      { id: 2, sender: "Eva", content: "Salut David, quoi de neuf ?", timestamp: "09:32" },
      { id: 3, sender: "Frank", content: "On a une réunion cet après-midi, non ?", timestamp: "09:35" },
      { id: 4, sender: "David", content: "Oui, à 14h pour discuter de la nouvelle campagne", timestamp: "09:40" },
      { id: 5, sender: "Eva", content: "Super, j'ai hâte de voir les nouvelles idées !", timestamp: "09:45" },
      { id: 6, sender: "David", content: "On se voit à la réunion de 14h", timestamp: "09:50" },
    ]
  },
  {
    id: "3",
    name: "Amis",
    messages: [
      { id: 1, sender: "Sophie", content: "Qui est partant pour un ciné ce soir ?", timestamp: "15:00" },
      { id: 2, sender: "Thomas", content: "Moi ! Quel film ?", timestamp: "15:05" },
      { id: 3, sender: "Julie", content: "Je suis partante aussi !", timestamp: "15:10" },
      { id: 4, sender: "Sophie", content: "Super ! On pourrait voir le nouveau Marvel ?", timestamp: "15:15" },
      { id: 5, sender: "Thomas", content: "Parfait pour moi !", timestamp: "15:20" },
      { id: 6, sender: "Julie", content: "D'accord, on se retrouve à quelle heure ?", timestamp: "15:25" },
    ]
  }
]

export default function Salles() {
  const [groups, setGroups] = useState(initialGroups)
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id)

  const selectedGroup = groups.find(group => group.id === selectedGroupId)

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender: "Vous",
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === selectedGroupId
          ? { ...group, messages: [...group.messages, newMessage] }
          : group
      )
    )
  }

  return (
    <div className="flex h-screen p-4 gap-4">
      <GroupList 
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
      />
      {selectedGroup && (
        <MessengerGroupCard 
          groupName={selectedGroup.name}
          messages={selectedGroup.messages}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  )
}

