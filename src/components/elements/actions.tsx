import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

type Action = {
    label: React.ReactNode;
    onClick: () => void;
    className: string;
    isDrop?: boolean;
    tooltip?: string
};

type Props = {
    actions: Action[];
};
  
const Actions = ({ actions }: Props) => {
    const dropdownActions = actions.filter(action => action.isDrop);
    const regularActions = actions.filter(action => !action.isDrop);
  
    return (
        <div className="flex gap-x-2">
            {regularActions.map((action, index) => (
                <TooltipProvider key={index} delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger
                            onClick={action.onClick}
                            className={`${action.className}`}
                        >
                            {action.label}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{action.tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
    
            {dropdownActions.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-1">
                            <Ellipsis className="h-5 w-5 text-slate-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto">
                        {dropdownActions.map((action, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={action.onClick}
                                className={action.className}
                            >
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};
  
export default Actions;  