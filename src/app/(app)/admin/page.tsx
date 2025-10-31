'use client';
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/context/auth-context"
import { UserList } from "./components/user-list";
import { users } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
    const { user } = useAuth();
    if (user?.role !== 'Admin') {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        )
    }

    return (
        <div className="pb-16 md:pb-0">
            <PageHeader
                title="Admin Panel"
                description="Manage users, advisories, and system settings."
            />

            <div className="grid gap-8">
                <UserList users={users} />
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Market Feed</CardTitle>
                            <CardDescription>Manually trigger market data ingestion.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button>Ingest Market Data</Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Seed Demo Data</CardTitle>
                            <CardDescription>Reset all demo data to the default state.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary">Seed Data</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
