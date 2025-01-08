'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsLogged, setAuth, logout } from "@/features/auth-slice";
import axios from "@/api/axios";
import Loading from "@/components/elements/loading";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isLogged = useSelector(selectIsLogged);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const expireDate = new Date(localStorage.getItem("expiresIn") || "");
        const expireTime = Date.parse(expireDate.toString());
        const remainedTime = expireTime - Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (remainedTime < 0) {
            dispatch(logout());
        } else if (remainedTime < fiveMinutes) {
            const refreshToken = localStorage.getItem("refreshToken");
            axios
                .post("core/refresh", { refreshToken })
                .then((response) => {
                    if (response?.data?.success) {
                        dispatch(setAuth(response?.data));
                    }
                })
                .catch((err) => {
                    console.log("Token refresh failed:", err);
                });
        }

        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (isLogged === false) {
            router.push("/login");
        }
    }, [isLogged, router]);

    if (isLoading) {
        return <div className="h-screen"><Loading width={200} height={200}/></div>;
    }

    return isLogged ? <>{children}</> : <div className="h-screen"><Loading width={200} height={200}/></div>;
};

export default ProtectedRoute;
