import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProviderProps } from "@/lib/types/common";

export function ImageDialog({
  url,
  children,
}: { url: string } & ProviderProps) {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Image</DialogTitle>
        </DialogHeader>
        <div className="rounded overflow-clip">
          <img src={url} alt="Image" className="object-cover size-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
