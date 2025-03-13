"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserPlus, Clock, UserMinus } from "lucide-react"

export function EnrollmentConfirmation({ open, onOpenChange, actions, onConfirm, onCancel }) {
  const getActionIcon = (type) => {
    switch (type) {
      case "enroll":
        return <UserPlus className="h-4 w-4" />
      case "waitlist":
        return <Clock className="h-4 w-4" />
      case "drop":
        return <UserMinus className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActionColor = (type) => {
    switch (type) {
      case "enroll":
        return "text-green-600"
      case "waitlist":
        return "text-yellow-600"
      case "drop":
        return "text-red-600"
      default:
        return ""
    }
  }

  const getActionText = (type) => {
    switch (type) {
      case "enroll":
        return "Enroll in"
      case "waitlist":
        return "Join waitlist for"
      case "drop":
        return "Drop from"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Enrollment Changes</DialogTitle>
          <DialogDescription>Please review and confirm the following enrollment changes.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <div key={index} className={`flex items-center gap-2 ${getActionColor(action.type)}`}>
                  {getActionIcon(action.type)}
                  <span>
                    {getActionText(action.type)} <strong>{action.courseName}</strong>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No enrollment changes to confirm</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={actions.length === 0}
          >
            Confirm Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}