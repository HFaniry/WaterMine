import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Fonction pour récupérer les messages d'un groupe spécifique
export async function GET(req: Request) {
    const dataDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDirectory, 'salles.json');

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ message: 'Fichier non trouvé.' }, { status: 404 });
      }


    try {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        const users = JSON.parse(fileContents);
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la lecture du fichier.' }, { status: 500 });
    }
}
