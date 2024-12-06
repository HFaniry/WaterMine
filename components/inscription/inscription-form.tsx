'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import bcrypt from 'bcryptjs'

export default function InscriptionForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
  })

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crypter le mot de passe
    const hashedPassword = await bcrypt.hash(formData.password, 10);
  
    // Préparer les données pour l'enregistrement
    const userData = {
      ...formData,
      password: hashedPassword,
    };
  
    // Enregistrer les données dans un fichier JSON
    try {
      const response = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        alert("Utilisateur enregistré avec succès !");
        router.push('/connexion')
      } else {
        const error = await response.json();
        alert(error.message || 'Une erreur est survenue.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Gérer l'erreur si c'est une instance d'Error
        alert('Erreur lors de l\'enregistrement : ' + error.message);
      } else {
        // Gérer les autres types d'erreurs
        alert('Erreur inconnue lors de l\'enregistrement.');
      }
    }
  };
  

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Inscription</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={imagePreview || ''} alt="Avatar" />
              <AvatarFallback>IMG</AvatarFallback>
            </Avatar>
            <Label htmlFor="picture" className="cursor-pointer text-sm text-blue-500 hover:text-blue-600">
              Choisir une image
            </Label>
            <Input 
              id="picture" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" placeholder="Votre prénom" onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" placeholder="Votre nom" onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" placeholder="••••••••" onChange={handleInputChange} />
          </div>
          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
