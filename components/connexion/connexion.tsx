'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Envoi de la requête de connexion à l'API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Enregistrer l'email de l'utilisateur dans le localStorage
        localStorage.setItem('user_email', email)

        // Redirection vers la page d'accueil ou un autre endroit
        window.location.href = '/' // Par exemple, rediriger vers un tableau de bord
      } else {
        setError(data.message) // Afficher l'erreur si la connexion échoue
      }
    } catch (error) {
      setError('Erreur lors de la connexion')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants pour vous connecter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@domaine.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
