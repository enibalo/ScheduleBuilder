import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";

  import { Button } from "@/components/ui/button";
  
  export function RequirementsDialog({course, open, onConfirm, onCancel}) {
    return (
      <Dialog open={open} onOpenChange={onCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{course.code} does not fulfill any degree requirements for Computer Science - would you like to proceed ?</DialogTitle>
            <DialogDescription>
              Please check your <a className="underline" href="https://example.com/">Academic Requirements Page</a> for more details about your required courses. 
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-10">
                <div className="flex justify-end gap-2">
                <Button variant="outline" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>
                Confirm
              </Button>
                </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  