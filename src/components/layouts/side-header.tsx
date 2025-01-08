import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { selectAuth } from '@/features/auth-slice';
import { useSelector } from 'react-redux';

type BreadcrumbProps = {
    name: string;
    path: string; // Use "not linked" to indicate non-linkable items
};

type SideHeaderProps = {
    breadcrumbs: BreadcrumbProps[];
};

const SideHeader: React.FC<SideHeaderProps> = ({ breadcrumbs }) => {
    const auth = useSelector(selectAuth)
    return (
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <div className='flex justify-start items-center w-full'>
                 {auth?.role?.name !== "Student" && <SidebarTrigger className="-ml-1" />}
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb className='ml-5'>
                    <BreadcrumbList>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    {breadcrumb.path === "main" ? (
                                        <BreadcrumbPage>
                                            {breadcrumb.name}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={breadcrumb.path}>
                                            {breadcrumb.name}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator />
                                )}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
};

export default SideHeader;
