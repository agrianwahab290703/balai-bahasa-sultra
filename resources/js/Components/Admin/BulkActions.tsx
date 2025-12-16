import React, { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/Components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import { ChevronDown, AlertTriangle } from 'lucide-react'

export interface BulkAction {
  key: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  confirmMessage?: string
  confirmTitle?: string
}

export interface BulkActionsProps {
  selectedIds: (number | string)[]
  actions: BulkAction[]
  onAction: (actionKey: string, ids: (number | string)[]) => void
  onClearSelection?: () => void
  className?: string
}

interface ConfirmDialogState {
  isOpen: boolean
  action: BulkAction | null
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  actions,
  onAction,
  onClearSelection,
  className,
}) => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    action: null,
  })

  const handleActionClick = useCallback(
    (action: BulkAction) => {
      if (selectedIds.length === 0) return

      if (action.confirmMessage) {
        setConfirmDialog({ isOpen: true, action })
      } else {
        onAction(action.key, selectedIds)
      }
    },
    [selectedIds, onAction]
  )

  const handleConfirm = useCallback(() => {
    if (confirmDialog.action) {
      onAction(confirmDialog.action.key, selectedIds)
    }
    setConfirmDialog({ isOpen: false, action: null })
  }, [confirmDialog.action, selectedIds, onAction])

  const handleCancel = useCallback(() => {
    setConfirmDialog({ isOpen: false, action: null })
  }, [])

  if (selectedIds.length === 0) {
    return null
  }

  return (
    <>
      <div className={cn('flex items-center gap-3', className)}>
        <span className="text-sm text-muted-foreground">
          {selectedIds.length} item dipilih
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Aksi
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {actions.map((action, index) => (
              <React.Fragment key={action.key}>
                {index > 0 && action.variant === 'destructive' && (
                  <DropdownMenuSeparator />
                )}
                <DropdownMenuItem
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer',
                    action.variant === 'destructive' && 'text-red-600 focus:text-red-600'
                  )}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {onClearSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground"
          >
            Batal pilih
          </Button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={handleCancel}
          />
          <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {confirmDialog.action.confirmTitle || 'Konfirmasi'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {confirmDialog.action.confirmMessage}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedIds.length} item akan terpengaruh.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Batal
              </Button>
              <Button
                variant={confirmDialog.action.variant || 'default'}
                onClick={handleConfirm}
              >
                {confirmDialog.action.label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Utility function to execute bulk operations
 * Returns the count of successfully processed items
 */
export function executeBulkOperation<T extends { id: number | string }>(
  items: T[],
  selectedIds: (number | string)[],
  operation: (item: T) => T
): { processedItems: T[]; processedCount: number } {
  const selectedIdSet = new Set(selectedIds)
  const processedItems: T[] = []
  let processedCount = 0

  for (const item of items) {
    if (selectedIdSet.has(item.id)) {
      processedItems.push(operation(item))
      processedCount++
    } else {
      processedItems.push(item)
    }
  }

  return { processedItems, processedCount }
}

export default BulkActions
