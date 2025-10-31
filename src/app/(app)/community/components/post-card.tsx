import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Post } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
  };
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-foreground">{post.content}</p>
        {post.image && (
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image src={post.image} alt="Post image" fill className="object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
            <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                {post.upvotes}
            </Button>
            <Button variant="outline" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                {post.comments.length}
            </Button>
        </div>
        <Badge variant="secondary">{post.language}</Badge>
      </CardFooter>
    </Card>
  );
}
