'use client'

import { useState, useEffect } from 'react'
import { GroupList } from './groupe-list'
import { MessengerGroupCard, Message } from './messenger-groups'

type Group = {
  id: string
  name: string
  messages: Message[]
}

export default function Salles() {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/salles')  // Utilisation de l'API /api/salles
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des groupes')
        }
        const data = await response.json()

        // Transformer les données JSON en une structure plus facile à manipuler
        const transformedGroups = Object.keys(data).map(key => ({
          id: key,
          name: key,  // Le nom du groupe est la clé (Groupe1, Groupe2, etc.)
          messages: data[key]  // Les messages associés à ce groupe
        }))

        setGroups(transformedGroups) // Mettre à jour l'état avec les données transformées
        setSelectedGroupId(transformedGroups[0]?.id || "") // Sélectionner le premier groupe par défaut
      } catch (error) {
        console.error('Erreur:', error)
      }
    }

    fetchGroups()
  }, [])

  // Trouver le groupe sélectionné
  const selectedGroup = groups.find(group => group.id === selectedGroupId)

  // Envoyer un message
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
