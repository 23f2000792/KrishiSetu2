'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from '@/lib/types';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

export function UserList({ users }: { users: User[] }) {
    const { t } = useLanguage();
    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('admin.userManagement')}</CardTitle>
                <CardDescription>{t('admin.userListDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('admin.user')}</TableHead>
                            <TableHead>{t('admin.role')}</TableHead>
                            <TableHead>{t('admin.region')}</TableHead>
                            <TableHead>{t('admin.contact')}</TableHead>
                            <TableHead><span className="sr-only">{t('admin.actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'} className={cn(user.role === 'Admin' && 'bg-amber-600')}>{user.role}</Badge>
                                </TableCell>
                                <TableCell>{user.region}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
                                            <DropdownMenuItem>{t('admin.edit')}</DropdownMenuItem>
                                            <DropdownMenuItem>{t('admin.delete')}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
