'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, query, orderBy } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, Send } from 'lucide-react';
import type { Comment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/firebase/firestore/use-collection';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

const commentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty.'),
});

type CommentThreadProps = {
  postId: string;
};

export function CommentThread({ postId }: CommentThreadProps) {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  }, [firestore, postId]);
  
  const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment: '' },
  });

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
  };
  
  const getRelativeTime = (timestamp: Timestamp) => {
    if (!timestamp) return 'Just now';
    try {
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
    } catch (e) {
      return 'a while ago';
    }
  };

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to comment.' });
      return;
    }

    setIsSubmitting(true);
    const commentsColRef = collection(firestore, 'posts', postId, 'comments');
    const newComment = {
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || '',
      comment: values.comment,
      createdAt: serverTimestamp(),
    };

    addDoc(commentsColRef, newComment)
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: commentsColRef.path,
          operation: 'create',
          requestResourceData: newComment,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment.id || index} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar} />
                <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-secondary rounded-lg px-3 py-2">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(comment.createdAt)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{comment.comment}</p>
              </div>
            </div>
          ))
        ) : (
          !isLoading && <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to reply!</p>
        )}
      </div>

      <Separator />

      {user && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-3">
            <Avatar className="h-9 w-9 mt-1">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="relative w-full">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Write a comment..."
                        className="pr-12 rounded-full"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
               <Button type="submit" size="icon" className="absolute top-1/2 -translate-y-1/2 right-1 h-8 w-8 rounded-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send comment</span>
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
