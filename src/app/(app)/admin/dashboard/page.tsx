'use client';
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/contexts/auth-context"
import { UserList } from "../components/user-list";
import { users } from "@/lib/data";
import { useLanguage } from "@/contexts/language-context";

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { t } = useLanguage();

    if (user?.role !== 'Admin') {
        return null;
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={t('admin.title')}
                description={t('admin.description')}
            />

            <div className="grid gap-8">
                <UserList users={users.filter(u => u.id !== user.id)} />
            </div>
        </div>
    )
}
