import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { 
    useReactTable, 
    getCoreRowModel, 
    getSortedRowModel, 
    getFilteredRowModel, 
    SortingState, 
    ColumnDef, 
    flexRender, 
    ColumnFiltersState
} from '@tanstack/react-table';
import { Textfield } from './field';
import Loading from '@/components/elements/loading';

interface PaginationProps {
    start: number;
    pageSize: number;
}

interface DatatableProps<TData> {
    tableData: TData[];
    columns: ColumnDef<TData, unknown>[];
    children?: React.ReactNode;
    isLoading?: boolean;
    error?: boolean;
    pagination?: PaginationProps;
}

const Datatable = <TData,>({ 
    tableData, 
    columns, 
    children, 
    isLoading, 
    error,
    pagination
}: DatatableProps<TData>) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: pagination?.start as number,
                pageSize: pagination?.pageSize as number
            },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        debugTable: false
    });

    return (
        <div className="rounded-lg bg-white dark:bg-slate-900 h-full flex flex-col overflow-hidden">
            <div className="flex items-center py-4 w-full">
                {children}
            </div>
            <div className="flex-grow overflow-y-auto border rounded-sm">
                <Table>
                    <TableHeader className='bg-gray-100 dark:bg-slate-900 sticky top-0 z-10'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className={`${header.column.columnDef.meta?.className} border`} style={{ width: header.getSize() }}>
                                        <div className="flex flex-col gap-y-2 text-slate-600 uppercase mt-1">
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanFilter() && (
                                                <Textfield
                                                    table={table}
                                                    id={header.column.id}
                                                    placeholder={`${typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header.toLowerCase() : header.column.id.toLowerCase()} хайх`}
                                                />
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    <Loading width={100} height={100}/>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-red-500">
                                    Алдаа гарлаа
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className={`${cell.column.columnDef.meta?.className} border`}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Дата олдсонгүй
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Datatable;