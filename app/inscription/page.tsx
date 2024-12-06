import InscriptionForm from '@/components/inscription/inscription-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-teal-400 to-blue-300 text-white">
      <InscriptionForm />
    </main>
  )
}