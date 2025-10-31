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
import { doc, updateDoc, increment } from "firebase/firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);

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
    if (!firestore) return;
    setIsLiking(true);
    const postRef = doc(firestore, 'posts', post.id);
    const updateData = { upvotes: increment(1) };

    updateDoc(postRef, updateData)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: postRef.path,
            operation: 'update',
            requestResourceData: { upvotes: 'increment(1)' }
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not like the post. Please try again."
        });
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  const handleComment = () => {
    // Commenting functionality is not yet implemented
  };

  return (
    <Card className="flex flex-col transform-gpu transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
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
      </CardHeader>
      <CardContent className="flex-grow space-y-4 pt-0">
        <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image src={post.image} alt="Post image" fill className="object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground" onClick={handleLike} disabled={isLiking}>
                {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                <span>{post.upvotes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground" onClick={handleComment}>
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments?.length || 0}</span>
            </Button>
        </div>
        <Badge variant="secondary">{post.language}</Badge>
      </CardFooter>
    </Card>
  );
}
