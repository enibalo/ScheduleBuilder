"use client"

import { ChevronLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

/**
 * Saved Schedules Component
 * @param {Object} props
 * @param {Array} props.savedSchedules - Array of saved schedules
 * @param {Function} props.onRemoveSchedule - Function to remove a saved schedule
 * @param {Function} props.onLoadSchedule - Function to load a saved schedule
 * @param {Function} props.onCollapse - Function to collapse the panel
 * @param {boolean} props.isCollapsed - Whether the panel is collapsed
 */
export function SavedSchedules({
  savedSchedules = [],
  onRemoveSchedule,
  onLoadSchedule,
  onCollapse,
  isCollapsed = false,
}) {
  return (
    <div
      className={`fixed top-20 right-0 bottom-4 z-40 transition-all duration-300 ${
        isCollapsed ? "translate-x-[280px]" : "translate-x-0"
      }`}
    >
      <div className="flex h-full">
        {/* Toggle Button */}
        <Button variant="outline" size="icon" className="h-12 w-8 rounded-r-none shadow-md" onClick={onCollapse}>
          <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </Button>

        <div className="w-[280px] bg-white rounded-l-lg border shadow-sm h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Saved Schedules</h2>
          </div>

          {/* Saved Schedules List */}
          <ScrollArea className="flex-1 p-4">
            {savedSchedules.length > 0 ? (
              <div className="space-y-4">
                {savedSchedules.map((schedule) => (
                  <Card key={schedule.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{schedule.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {schedule.courses.length} courses • {new Date(schedule.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => onLoadSchedule(schedule.id)}>
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onRemoveSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved schedules</p>
                <p className="text-sm">Save your current schedule to see it here</p>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground">Schedules are saved in your browser's local storage</p>
          </div>
        </div>
      </div>
    </div>
  )
}