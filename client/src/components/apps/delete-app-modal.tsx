import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteAppModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appName: string;
  isDeleting: boolean;
}

export function DeleteAppModal({ open, onClose, onConfirm, appName, isDeleting }: DeleteAppModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <AlertDialogTitle>Delete App</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to delete <span className="font-medium text-slate-300">{appName}</span>? All data will be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive hover:bg-destructive/90" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
