import Header from "@/components/chat/Header"
import { Sidebar } from "@/components/chat/sidebar"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function Page() {
  return (
    <div className="flex w-[1920px] h-[1080px] items-center flex-col">
      <Header />
      <div className="flex w-full ">
        <ChatInterface />
      </div>
    </div>
  )
}

