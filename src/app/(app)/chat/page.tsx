'use client';
import { PageHeader } from "@/components/page-header"
import { ChatLayout } from "./components/chat-layout"
import { useLanguage } from "@/contexts/language-context";

export default function ChatPage() {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title={t('chat.title')}
                description={t('chat.description')}
            />
            <ChatLayout />
        </div>
    )
}
