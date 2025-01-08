import React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

interface Props<TData> {
    table: Table<TData>;
    id: string;
    placeholder: string;
    className?: string;
}

export function Textfield<TData>({
    table,
    id,
    placeholder,
    className,
}: Props<TData>) {
    return (
        <div className={`mb-1 ${className || ""}`}>
            <Input
                placeholder={placeholder}
                value={(table.getColumn(id)?.getFilterValue() as string) ?? ""}
                className="bg-white"
                onChange={(event) => {
                table.getColumn(id)?.setFilterValue(event.target.value);
                }}
            />
        </div>
    );
}
