"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react";


export function FilterDialog({ open, onOpenChange, filters, onFiltersChange, onSave }) {
  const handleCheckboxChange = (filterKey) => {
    onFiltersChange({
      ...filters,
      [filterKey]: !filters[filterKey],
    })
  }

  const handleClearFilters = () => {
    const resetFilters = Object.fromEntries(
      Object.entries(filters).map(([key]) => [key, false])
    );    
    onFiltersChange(resetFilters)
    console.log(filters)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Time-based filters */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="morning-classes"
                  checked={filters.morningClasses}
                  onCheckedChange={() => handleCheckboxChange("morningClasses")}
                />
                <Label htmlFor="morning-classes">
                  <div>
                    <p>Morning Classes</p>
                    <p className="text-[11px] text-gray-700">(8am-12pm)</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="afternoon-classes"
                  checked={filters.afternoonClasses}
                  onCheckedChange={() => handleCheckboxChange("afternoonClasses")}
                />
                <Label htmlFor="afternoon-classes">
                  <div>
                    <p>Afternoon Classes</p>
                    <p className="text-[11px] text-gray-700">(12pm-4pm)</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="evening-classes"
                  checked={filters.eveningClasses}
                  onCheckedChange={() => handleCheckboxChange("eveningClasses")}
                />
                <Label htmlFor="evening-classes">
                  <div>
                    <p>Evening Classes</p>
                    <p className="text-[11px] text-gray-700">(4pm-7pm)</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required-classes"
                  checked={filters.requiredClasses}
                  onCheckedChange={() => handleCheckboxChange("requiredClasses")}
                />
                <Label htmlFor="required-classes">Required Classes</Label>
              </div>
            </div>

            {/* Status-based filters */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="full-classes"
                  checked={filters.fullClasses}
                  onCheckedChange={() => handleCheckboxChange("fullClasses")}
                />
                <Label htmlFor="full-classes">Don't Show Full Classes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="waitlisted-classes"
                  checked={filters.waitlistedClasses}
                  onCheckedChange={() => handleCheckboxChange("waitlistedClasses")}
                />
                <Label htmlFor="waitlisted-classes">Don't Show Waitlist-only Classes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="online-classes"
                  checked={filters.onlineClasses}
                  onCheckedChange={() => handleCheckboxChange("onlineClasses")}
                />
                <Label htmlFor="waitlisted-classes">Web-based Instruction</Label>
              </div>
              <div className="flex items-center space-x-2">
              <Button variant="outline" className="w-full border-gray-200 rounded-md border" onClick={() => handleClearFilters()}>
              <Trash2 className="w-4 h-4" ></Trash2>
                Clear Filters
              </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Return
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
