"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "@/api/axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/features/auth-slice";
import { useToast } from "@/hooks/use-toast"
import { loginSchema } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Login = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const navigate = useRouter();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    async function onSubmit(values: z.infer<typeof loginSchema>) {

        setLoading(true)
        const data = {
            username: values.username,
            password: values.password,
        }
        axios
            .post("/core/login", data)
            .then((res) => {
                dispatch(setAuth(res?.data));
                toast({
                    title: "Welcome back",
                    description: res?.data?.message,
                });
                console.log(res)
                navigate.push('/system')
            })
            .catch((err) => {
                toast({
                    title: "Error",
                    description: err?.response?.data?.message || "Server error",
                    variant: "destructive",
                });
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-50">Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-50">Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password" {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full pt-5">
                        <Button
                            type="submit"
                            className="w-full bg-slate-800 dark:bg-gray-50 uppercase"
                            disabled={loading}
                        >
                            {loading ? "loading..." : "Login"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Login;