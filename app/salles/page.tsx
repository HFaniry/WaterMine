import MessengerGroups from "@/components/messenger-group/messenger-groups";
import Salles from "@/components/messenger-group/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <MessengerGroups />
    </main>
  )
}