import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"

const Pagination = ({ 
  currentPage, 
  totalPages, 
  baseUrl,
  className 
}: {
  currentPage: number
  totalPages: number
  baseUrl: string
  className?: string
}) => {
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      for (let i = 1; i < range[0]; i++) {
        rangeWithDots.push(i)
      }
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      for (let i = range[range.length - 1] + 1; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    }

    return rangeWithDots
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.href = `${baseUrl}?page=${currentPage - 1}`}
        disabled={currentPage <= 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`dots-${index}`} className="px-3 py-1 text-sm">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => window.location.href = `${baseUrl}?page=${page}`}
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.href = `${baseUrl}?page=${currentPage + 1}`}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export { Pagination }
