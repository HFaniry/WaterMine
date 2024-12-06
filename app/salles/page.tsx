import MessengerGroups from "@/components/messenger-group/messenger-groups";
import { Navbar } from "@/components/navbar/navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Navbar/>
      <MessengerGroups />
    </main>
  )
}