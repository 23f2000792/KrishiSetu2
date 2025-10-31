import { PageHeader } from "@/components/page-header"
import { ChatLayout } from "./components/chat-layout"

export default function ChatPage() {
    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-113px)] flex flex-col">
            <PageHeader
                title="AI Copilot"
                description="Your personal agri-advisory assistant. Ask me anything!"
            />
            <ChatLayout />
        </div>
    )
}
