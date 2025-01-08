"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { 
    Menu,
} from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, logout } from "@/features/auth-slice";

const menuItems = [
    {
        path: '/system',
        name: 'Your status'
    },
    {
        path: '/student/lesson',
        name: 'Lesson'
    },
];

const Header = () => {
    return(
        <div className="w-full bg-white dark:bg-slate-800 border-b h-16">
            <div className="grid grid-cols-2 lg:grid-cols-3 px-5 md:px-10 mx-auto items-center h-full">
                <div className="flex justify-start md:justify-start items-center h-full">
                    <Link href="/" className="relative text-xl uppercase text-slate-600 font-semibold"> 
                        School quiz app
                    </Link>
                </div>
                <div className="hidden lg:flex justify-center">
                    <Desktop/>
                </div>
                <div className="flex gap-x-4 justify-end items-center">
                    <UserToggle />
                    <div className="lg:hidden">
                        <Mobile/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;

const Desktop = () => {
    const pathname = usePathname();

    return (
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item, index) => (
                <NavigationMenuItem key={index} className={`${pathname === item.path ? 'border-b border-blue-400 text-blue-400 dark:text-white' : 'text-slate-600 dark:text-gray-50 font-normal'} py-3.5`}>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${pathname === item.path ? 'font-semibold hover:text-blue-500' : 'text-xs'} uppercase`} href={item.path} style={{ background: 'none' }}>
                        {item.name}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )
}

const Mobile = () => {
    const pathname = usePathname();

    return(
        <Sheet>
            <SheetTrigger><Menu className="text-slate-600 dark:text-gray-50 mt-2 ml-2"/></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-slate-600 uppercase"></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                    <div className="flex flex-col justify-center gap-y-4 h-full pb-10">
                        {menuItems.map((item, index) => (
                            <Link href={item.path} key={index} className={`${pathname === item.path ? 'text-blue-500 font-medium dark:text-white' : 'text-slate-600 dark:text-gray-50 font-normal'} py-1`}>{item.name}</Link>
                        ))}
                    </div>
            </SheetContent>
      </Sheet>
    )
}

const UserToggle = () => {
    const auth = useSelector(selectAuth);
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogout = () => {
        dispatch(logout())
        router.push('/n')
    }
    return(
        <Popover>
            <PopoverTrigger>   
                <div className="text-sm bg-gray-100 rounded-sm px-2 py-1 hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-gray-50 flex items-center">
                    <span className="hidden md:flex">Hi, {auth?.firstname} </span>
                    <span className="bg-blue-100 rounded-sm py-2 px-3 md:ml-2 text-slate-600 font-bold">И</span>
                </div>
            </PopoverTrigger>
            
            <PopoverContent className="p-0 w-80 lg:w-96 mr-5 rounded-none">
                <div className="w-full flex flex-col flex-grow">
                    <div className="bg-center flex justify-start items-center h-20 lg:h-28 text-base lg:text-lg py-10">
                        <div className="flex justify-center items-center bg-slate-300 opacity-20 h-12 w-12 lg:h-16 lg:w-16 mx-4 rounded-md">
                            <span className="text-blue-900 uppercase font-semibold text-3xl lg:text-4xl">
                                {auth?.firstname[0]}
                            </span>
                        </div>
                        <span className="dark:text-white text-slate-600">{auth?.lastname}</span>
                        <span className="dark:text-white ml-2 text-slate-600">{auth?.firstname}</span>
                    </div>

                    <div className="border-t border-1 p-2">
                    <Button
                        onClick={() => handleLogout()}
                        variant={"ghost"} 
                        className="text-sm text-slate-600 rounded-none bg-gray-100 hover:bg-blue-500 hover:text-white w-full dark:bg-slate-600 dark:text-gray-50 dark:hover:bg-slate-500">Log out</Button>
                    </div>
                </div>
            </PopoverContent>

        </Popover>
    )
}
