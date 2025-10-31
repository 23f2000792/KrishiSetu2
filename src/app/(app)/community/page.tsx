'use client';
import { useState } from "react";
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { FilePlus, Filter } from "lucide-react"
import { communityPosts } from "@/lib/data"
import { PostCard } from "./components/post-card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreatePostForm } from "./components/create-post-form";

export default function CommunityPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="pb-16 md:pb-0">
            <PageHeader
                title="Community Feed"
                description="Connect with fellow farmers, share knowledge, and grow together."
            >
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
                 <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <FilePlus className="mr-2 h-4 w-4" />
                            Create Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Create a new post</DialogTitle>
                            <DialogDescription>
                                Share your thoughts, questions, or successes with the community.
                            </DialogDescription>
                        </DialogHeader>
                        <CreatePostForm onPostCreated={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {communityPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}
