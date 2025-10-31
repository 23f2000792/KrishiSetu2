'use client';
import { useState } from 'react';
import {
  CaretSortIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table"
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketPrice } from "@/lib/types"
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';


export function MarketTable({ initialData }: { initialData: MarketPrice[] }) {
    const [data] = useState<MarketPrice[]>(initialData);
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('');
    const { t } = useLanguage();

    const columns: ColumnDef<MarketPrice>[] = [
        {
            accessorKey: "crop",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    {t('market.crop')}
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("crop")}</div>,
        },
        {
            accessorKey: "region",
            header: t('market.region'),
        },
        {
            id: "priceTrend",
            header: t('market.priceTrend'),
            cell: ({ row }) => {
                const prices = row.original.prices;
                return (
                    <div className="h-12 w-32">
                        <ResponsiveContainer>
                            <LineChart data={prices}>
                                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                );
            }
        },
        {
            id: "latestPrice",
            header: t('market.latestPrice'),
            cell: ({ row }) => {
                const latestPrice = row.original.prices[row.original.prices.length - 1].price;
                return `₹${latestPrice.toLocaleString()}`;
            }
        },
        {
            accessorKey: "forecast",
            header: t('market.forecast'),
            cell: ({ row }) => {
                const forecast = row.getValue("forecast") as number;
                const isUp = forecast > 0;
                return (
                    <Badge variant={isUp ? "default" : "destructive"} className={cn(isUp ? "bg-green-500/80" : "bg-red-500/80", "text-white")}>
                       {isUp ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                       {forecast}%
                    </Badge>
                );
            }
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
          sorting,
          globalFilter,
        },
    });

    const crops = Array.from(new Set(initialData.map(d => d.crop)));
    const regions = Array.from(new Set(initialData.map(d => d.region)));
    
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div>
                        <CardTitle>{t('market.title')}</CardTitle>
                        <CardDescription>{t('market.description')}</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Input
                            placeholder={t('market.filterPlaceholder')}
                            value={globalFilter ?? ''}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="max-w-sm"
                        />
                        <Select onValueChange={(value) => table.getColumn('crop')?.setFilterValue(value === 'all' ? '' : value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('market.filterCrop')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('market.allCrops')}</SelectItem>
                                {crops.map(crop => <SelectItem key={crop} value={crop}>{crop}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => table.getColumn('region')?.setFilterValue(value === 'all' ? '' : value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('market.filterRegion')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('market.allRegions')}</SelectItem>
                                {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        {t('market.noResults')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
