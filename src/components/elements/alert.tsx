import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    TriangleAlert
} from 'lucide-react'

type Props = {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const AlerDialog = ({ description, isOpen, title, onClose, onConfirm }: Props) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center w-full"><TriangleAlert className="h-16 w-16 text-red-400"/></DialogTitle>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-center w-full items-center gap-x-3 mt-5">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button className="bg-red-400 hover:bg-red-500" onClick={onConfirm}>Yes, delete it</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AlerDialog;
