import React, { memo, useEffect, useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ChevronLastIcon,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LIMIT } from "@/utils/params";
import { Button } from "../ui/button";

interface PaginationProps {
    pagination: {
        pageCount: number;
        page: number;
        total: number;
        start: number;
        end: number;
        limit: number;
        prevPage?: number;
        nextPage?: number;
    };
    select: (page: number) => void;
    handleChangeLimit: (newLimit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, select, handleChangeLimit }) => {
    const [disableBackArrow, setDisableBackArrow] = useState<boolean>(
        !pagination?.prevPage
    );
    const [disableNextArrow, setDisableNextArrow] = useState<boolean>(
        !pagination?.nextPage
    );
    const [pageList, setPageList] = useState<number[]>(
        Array.from({ length: pagination?.pageCount }, (_, index) => index + 1)
    );

    useEffect(() => {
        setPageList(Array.from({ length: pagination?.pageCount }, (_, index) => index + 1));
        setDisableNextArrow(!pagination?.nextPage);
        setDisableBackArrow(!pagination?.prevPage);
    }, [pagination]);

    const handleSelect = (page: number) => {
        setDisableNextArrow(!pagination?.nextPage);
        setDisableBackArrow(!pagination?.prevPage);
        select(page);
    };

    const createPagination = (): number[] => {
        let pages: number[] = [];
        if (pagination.pageCount < 8) {
            pages = pageList;
        } else {
            if (pagination.page < 5) {
                pages = pageList.slice(0, pagination.pageCount > 7 ? 7 : pagination.pageCount);
            } else if (pagination.page > pagination.pageCount - 4) {
                pages = pageList.slice(-7);
            } else {
                pages = pageList.slice(pagination.page - 3, pagination.page + 3);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 p-2 px-10">
            <p className="text-dark text-xs sm:text-sm">
                Showing <span className="text-black">{pagination?.start}</span> to{" "}
                <span className="text-black">{pagination?.end}</span> of{" "}
                <span className="text-black font-medium">{pagination?.total}</span>{" "}
                entries
            </p>

            <div className="flex items-center gap-2">
                <div className="mr-5 w-24">
                    <Select value={`${pagination.limit}`} onValueChange={(newValue) => handleChangeLimit(Number(newValue))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LIMIT.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    className="rounded-md bg-slate-200 hover:bg-slate-300 text-dark disabled:text-slate-500"
                    disabled={disableBackArrow}
                    onClick={() => handleSelect(1)}
                >
                    <ChevronDownIcon className="h-6 w-6" />
                </Button>
                <Button
                    className="rounded-md bg-slate-200 hover:bg-slate-300 text-dark disabled:text-slate-500 disabled:hover:text-slate-400"
                    disabled={disableBackArrow}
                    onClick={() => handleSelect(pagination?.page - 1)}
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </Button>

                {createPagination().map((el) => (
                    <Button
                        key={el}
                        className={`w-7 rounded-md bg-slate-200 hover:bg-slate-300 text-dark ${
                            pagination?.page === el && "bg-gray-100 text-gray-500 hover:animate-none"
                        }`}
                        onClick={() => handleSelect(el)}
                    >
                        {el}
                    </Button>
                ))}

                <Button
                    className="rounded-md bg-slate-200 hover:bg-slate-300 text-dark disabled:text-slate-500 disabled:hover:text-slate-400"
                    disabled={disableNextArrow}
                    onClick={() => handleSelect(pagination?.page + 1)}
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </Button>
                <Button
                    className="rounded-md bg-slate-200 hover:bg-slate-300 text-dark disabled:text-slate-500 disabled:hover:text-slate-400"
                    disabled={disableNextArrow}
                    onClick={() => handleSelect(pagination?.pageCount)}
                >
                    <ChevronLastIcon className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};

export default memo(Pagination);
