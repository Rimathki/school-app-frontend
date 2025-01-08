'use client'
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { XCircle, Check, TriangleAlert } from "lucide-react";
import Loading from "@/components/elements/loading";
import { useDispatch, useSelector } from "react-redux";
import {
    selectNotification,
    clearNotification,
} from "@/features/notification-slice";
import { Button } from "../ui/button";

interface Alert {
    status: "success" | "error" | "warning" | "loading";
    title: string;
    text: string;
    modal?: boolean;
    back?: boolean;
}

export default function Notification() {
    const notification = useSelector(selectNotification);

    if (!notification?.text) return null;

    if (notification?.modal) return <ModalAlert alert={notification} />;
}

function ModalAlert({ alert }: { alert: Alert }) {
    const dispatch = useDispatch();
    const navigate = useRouter();

    function submit() {
        dispatch(clearNotification());
        if (alert?.back) navigate.back();
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open}>
            <DialogContent className="bg-white rounded-2xl shadow-xl flex flex-col items-center max-w-md">
                <DialogTitle className="text-center">
                    {alert?.status === "success" && (
                        <div className="border-2 border-green-500 rounded-full w-24 h-24 flex justify-center items-center">
                            <Check className="w-20 h-20 text-green-500" />
                        </div>
                    )}
                    {alert?.status === "error" && (
                        <XCircle className="w-20 h-20 text-red-500" />
                    )}
                    {alert?.status === "warning" && (
                        <TriangleAlert className="w-20 h-20 text-orange-500" />
                    )}
                    {alert?.status === "loading" && <Loading width={50} height={50} />}
                </DialogTitle>
                <DialogDescription className="py-2 px-10 flex flex-col items-center">
                    <label className="text-sm text-slate-900">
                        {alert?.title}
                    </label>
                    <label className="pt-2 text-slate-600 text-lg">{alert?.text}</label>
                </DialogDescription>
                <Button
                    className={`bg-blue-400 hover:bg-blue-500 px-10 ${
                        alert?.status === "loading" && "hidden"
                    }`}
                    onClick={submit}
                >
                    OK
                </Button>
            </DialogContent>
        </Dialog>
    );
}
