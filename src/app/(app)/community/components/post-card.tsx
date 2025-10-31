'use client';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, MoreHorizontal, Loader2 } from "lucide-react";
import { Post } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { useFirebase } from "@/firebase";
import { doc, updateDoc, increment, collection, query, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CommentThread } from "./comment-thread";
import { useAuth } from "@/contexts/auth-context";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const { firestore } = useFirebase();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);

  // Fetch comment count on mount
  useEffect(() => {
    if (!firestore) return;
    const getCommentCount = async () => {
        const commentsRef = collection(firestore, 'posts', post.id, 'comments');
        const q = query(commentsRef);
        const querySnapshot = await getDocs(q);
        setCommentCount(querySnapshot.size);
    };
    getCommentCount();
  }, [firestore, post.id]);


  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
  };
  
  const getRelativeTime = () => {
    if (!post.createdAt) return 'Just now';
    try {
      if (typeof post.createdAt === 'object' && 'toDate' in post.createdAt) {
        const date = (post.createdAt as any).toDate();
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return formatDistanceToNow(new Date(post.createdAt as any), { addSuffix: true });
    } catch (e) {
      return 'a while ago';
    }
  };

  const handleLike = async () => {
    if (!firestore || !user) return;
    setIsLiking(true);
    const postRef = doc(firestore, 'posts', post.id);
    
    const updateData = { upvotes: increment(1) };

    try {
        await updateDoc(postRef, updateData);
    }
    catch (error) {
        console.error("Error liking post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not like the post. Please try again."
        });
    }
    finally {
        setIsLiking(false);
    }
  };

  return (
    <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen} asChild>
      <Card className="flex flex-col transform-gpu transition-all duration-300 ease-out hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.authorName}</p>
                <p className="text-xs text-muted-foreground">{getRelativeTime()}</p>
              </div>
            </div>
              <div className="flex items-center gap-1">
                 <Badge variant="secondary">{post.language}</Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 pt-0">
          <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
          {post.image && (
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <Image src={post.image} alt="Post image" fill className="object-cover" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-around items-center border-t py-1">
            <Button variant="ghost" className="flex-1 text-muted-foreground rounded-none" onClick={handleLike} disabled={isLiking}>
                {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                <span className="ml-2">{post.upvotes}</span>
            </Button>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex-1 text-muted-foreground rounded-none">
                    <MessageCircle className="h-4 w-4" />
                    <span className="ml-2">{commentCount}</span>
                </Button>
            </CollapsibleTrigger>
        </CardFooter>
        <CollapsibleContent>
          <div className="px-6 pb-4">
              <CommentThread postId={post.id} />
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
