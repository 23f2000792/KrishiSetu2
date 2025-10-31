'use client';
import { useState } from "react";
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { FilePlus, Filter } from "lucide-react"
import { communityPosts } from "@/lib/data"
import { PostCard } from "./components/post-card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreatePostForm } from "./components/create-post-form";
import { useLanguage } from "@/contexts/language-context";

export default function CommunityPage() {
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={t('community.title')}
                description={t('community.description')}
            >
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        {t('community.filter')}
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <FilePlus className="mr-2 h-4 w-4" />
                                {t('community.createPost')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>{t('community.newPostTitle')}</DialogTitle>
                                <DialogDescription>
                                    {t('community.newPostDescription')}
                                </DialogDescription>
                            </DialogHeader>
                            <CreatePostForm onPostCreated={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {communityPosts.map((post, index) => (
                    <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </div>
    )
}
