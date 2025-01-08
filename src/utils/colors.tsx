// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getColor = (type: any) => {
    switch (type) {
      case "error":
        return "text-red-600 bg-red-100";
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-orange-600 bg-orange-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      default:
        return;
    }
  };
  
  export function getHoverColor(type: unknown) {
    switch (type) {
      case "error":
        return "hover:bg-red-200";
      case "warning":
        return "hover:bg-yellow-200";
      case "success":
        return "hover:bg-green-200";
      case "info":
        return "hover:bg-blue-200";
      default:
        return;
    }
  }
  
  export function getStatusColor(id: number) {
    switch (id) {
      case 17:
        return "bg-green-300";
      case 15:
        return "bg-blue-300";
      case 16:
        return "bg-orange-300";
      case 5:
        return "bg-yellow-200";
      case 4:
        return "bg-violet-300";
      case 3:
        return "bg-slate-300";
      default:
        return "bg-red-300";
    }
  }
  