'use client';
import { useState } from "react";
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Filter, Loader2 } from "lucide-react"
import { PostCard } from "./components/post-card"
import { CreatePostCard } from "./components/create-post-form";
import { useLanguage } from "@/contexts/language-context";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirebase } from "@/firebase/provider";
import { collection, query, orderBy } from 'firebase/firestore';
import type { Post } from "@/lib/types";
import { useMemoFirebase } from "@/firebase";
import { WisdomWebCard } from "./components/wisdom-web-card";

export default function CommunityPage() {
    const { t } = useLanguage();
    const { firestore } = useFirebase();
    const [refreshKey, setRefreshKey] = useState(0);

    const postsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
    }, [firestore, refreshKey]);

    const { data: posts, isLoading } = useCollection<Post>(postsQuery);
    
    const handlePostCreated = () => {
        // This will trigger a re-fetch of the collection
        setRefreshKey(prev => prev + 1);
    }

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
                </div>
            </PageHeader>
            
            <div className="max-w-2xl mx-auto space-y-8">
                <CreatePostCard onPostCreated={handlePostCreated} />
                <WisdomWebCard />

                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                
                {!isLoading && posts && (
                     <div className="space-y-6">
                        {posts.map((post, index) => (
                            <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && (!posts || posts.length === 0) && (
                    <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No posts yet. Be the first to start a conversation!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
