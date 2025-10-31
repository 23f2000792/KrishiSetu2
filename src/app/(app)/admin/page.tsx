'use client';
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/contexts/auth-context"
import { UserList } from "./components/user-list";
import { users } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.marketFeed')}</CardTitle>
                            <CardDescription>{t('admin.marketFeedDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button>{t('admin.ingestData')}</Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.seedData')}</CardTitle>
                            <CardDescription>{t('admin.seedDataDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary">{t('admin.seedData')}</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
