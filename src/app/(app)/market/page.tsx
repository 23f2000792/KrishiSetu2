import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { MarketTable } from "./components/market-table"
import { marketPrices } from "@/lib/data"

export default function MarketPage() {
    return (
        <div className="pb-16 md:pb-0">
            <PageHeader
                title="Mandi Prices"
                description="Latest market prices and forecasts for your crops."
            >
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </Button>
            </PageHeader>
            <MarketTable initialData={marketPrices} />
        </div>
    )
}
