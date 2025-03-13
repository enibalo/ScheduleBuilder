"use client"

import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function SuccessDialog({ open, onOpenChange, actions }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actions Completed Successfully</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
                <p className="text-sm">
                  {action.type === "enroll" && `You have successfully enrolled in ${action.courseName}`}
                  {action.type === "waitlist" && `You have been waitlisted in ${action.courseName}`}
                  {action.type === "drop" && `You have successfully dropped ${action.courseName}`}
                </p>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}