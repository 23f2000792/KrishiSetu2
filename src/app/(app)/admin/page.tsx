'use client';
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/contexts/auth-context"
import { UserList } from "./components/user-list";
import { users } from "@/lib/data";
import { useLanguage } from "@/contexts/language-context";

export default function AdminPage() {
    const { user } = useAuth();
    const { t } = useLanguage();

    if (user?.role !== 'Admin') {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">{t('admin.accessDenied')}</h1>
                <p>{t('admin.noPermission')}</p>
            </div>
        )
    }

    return (
        <div className="pb-16 md:pb-0">
            <PageHeader
                title={t('admin.title')}
                description={t('admin.description')}
            />

            <div className="grid gap-8">
                <UserList users={users} />
            </div>
        </div>
    )
}
