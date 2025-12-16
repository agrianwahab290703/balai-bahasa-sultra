import React, { useState, useCallback, useMemo } from 'react'
import { router } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { Button } from '@/Components/ui/button'
import GradientButton from './GradientButton'
import { Input } from '@/Components/ui/input'
import { Checkbox } from '@/Components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Loader2,
} from 'lucide-react'

export interface ColumnDef<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  className?: string
}

export interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

export interface FilterConfig {
  key: string
  label: string
  options: { value: string; label: string }[]
}

export interface BulkAction {
  key: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  confirmMessage?: string
}

export interface DataTableProps<T extends { id: number | string }> {
  data: PaginatedData<T>
  columns: ColumnDef<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  filters?: FilterConfig[]
  filterValues?: Record<string, string>
  bulkActions?: BulkAction[]
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  loading?: boolean
  emptyMessage?: string
  baseUrl?: string
  onSearch?: (query: string) => void
  onFilter?: (filters: Record<string, string>) => void
  onBulkAction?: (action: string, ids: (number | string)[]) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onPageChange?: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}


export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Cari...',
  searchValue = '',
  filters = [],
  filterValues = {},
  bulkActions = [],
  sortColumn,
  sortDirection = 'asc',
  loading = false,
  emptyMessage = 'Tidak ada data',
  baseUrl,
  onSearch,
  onFilter,
  onBulkAction,
  onSort,
  onPageChange,
  onPerPageChange,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set())
  const [localSearch, setLocalSearch] = useState(searchValue)
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(filterValues)

  const allSelected = useMemo(() => {
    return data.data.length > 0 && data.data.every((row) => selectedIds.has(row.id))
  }, [data.data, selectedIds])

  const someSelected = useMemo(() => {
    return data.data.some((row) => selectedIds.has(row.id)) && !allSelected
  }, [data.data, selectedIds, allSelected])

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(data.data.map((row) => row.id)))
    }
  }, [allSelected, data.data])

  const handleSelectRow = useCallback((id: number | string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(localSearch)
    } else if (baseUrl) {
      router.get(baseUrl, { search: localSearch, ...localFilters }, { preserveState: true })
    }
  }, [localSearch, localFilters, onSearch, baseUrl])

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const newFilters = { ...localFilters, [key]: value }
      setLocalFilters(newFilters)
      if (onFilter) {
        onFilter(newFilters)
      } else if (baseUrl) {
        router.get(baseUrl, { search: localSearch, ...newFilters }, { preserveState: true })
      }
    },
    [localFilters, localSearch, onFilter, baseUrl]
  )

  const handleSort = useCallback(
    (column: string) => {
      const newDirection =
        sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
      if (onSort) {
        onSort(column, newDirection)
      } else if (baseUrl) {
        router.get(
          baseUrl,
          { search: localSearch, ...localFilters, sort: column, direction: newDirection },
          { preserveState: true }
        )
      }
    },
    [sortColumn, sortDirection, localSearch, localFilters, onSort, baseUrl]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (onPageChange) {
        onPageChange(page)
      } else if (baseUrl) {
        router.get(
          baseUrl,
          { search: localSearch, ...localFilters, page },
          { preserveState: true }
        )
      }
    },
    [localSearch, localFilters, onPageChange, baseUrl]
  )

  const handlePerPageChange = useCallback(
    (perPage: string) => {
      if (onPerPageChange) {
        onPerPageChange(parseInt(perPage))
      } else if (baseUrl) {
        router.get(
          baseUrl,
          { search: localSearch, ...localFilters, per_page: perPage },
          { preserveState: true }
        )
      }
    },
    [localSearch, localFilters, onPerPageChange, baseUrl]
  )

  const handleBulkAction = useCallback(
    (action: BulkAction) => {
      if (selectedIds.size === 0) return

      if (action.confirmMessage) {
        if (!window.confirm(action.confirmMessage)) return
      }

      if (onBulkAction) {
        onBulkAction(action.key, Array.from(selectedIds))
        setSelectedIds(new Set())
      }
    },
    [selectedIds, onBulkAction]
  )

  const getValue = (row: T, key: string): unknown => {
    const keys = key.split('.')
    let value: unknown = row
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return undefined
      }
    }
    return value
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    )
  }


  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 bg-[var(--admin-glass-bg)] border-[var(--admin-glass-border)] backdrop-blur-[var(--admin-glass-blur)] focus:border-[var(--admin-primary-blue)] focus:ring-2 focus:ring-[var(--admin-primary-blue)]/20"
                style={{ transition: 'var(--admin-transition-fast)' }}
              />
            </div>
          )}
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={localFilters[filter.key] || '__all__'}
              onValueChange={(value) => handleFilterChange(filter.key, value === '__all__' ? '' : value)}
            >
              <SelectTrigger className="w-[180px] bg-[var(--admin-glass-bg)] border-[var(--admin-glass-border)] backdrop-blur-[var(--admin-glass-blur)] focus:border-[var(--admin-primary-blue)] focus:ring-2 focus:ring-[var(--admin-primary-blue)]/20" style={{ transition: 'var(--admin-transition-fast)' }}>
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Semua</SelectItem>
                {filter.options.filter(opt => opt.value && opt.value.trim() !== '').map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {/* Bulk Actions */}
        {bulkActions.length > 0 && selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} item dipilih
            </span>
            {bulkActions.map((action) => (
              <GradientButton
                key={action.key}
                variant={action.variant === 'destructive' ? 'accent' : 'primary'}
                size="sm"
                onClick={() => handleBulkAction(action)}
              >
                {action.icon}
                {action.label}
              </GradientButton>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                {bulkActions.length > 0 && (
                  <th className="w-12 px-4 py-4">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el) {
                          (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected
                        }
                      }}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                      column.sortable && "cursor-pointer hover:text-gray-900 hover:bg-gray-100/50 transition-colors",
                      column.className
                    )}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && getSortIcon(String(column.key))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : data.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium mb-1">Data tidak ditemukan</p>
                      <p className="text-sm text-gray-500">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.data.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-colors hover:bg-gray-50/80",
                      selectedIds.has(row.id) && "bg-blue-50/50"
                    )}
                  >
                    {bulkActions.length > 0 && (
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={() => handleSelectRow(row.id)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn("px-4 py-4 text-sm text-gray-700", column.className)}
                      >
                        {column.render
                          ? column.render(getValue(row, String(column.key)), row)
                          : String(getValue(row, String(column.key)) ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data.last_page > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--admin-black-text)]/70">
            <span>
              Menampilkan {data.from || 1} - {data.to || data.data.length} dari {data.total} data
            </span>
            <Select
              value={String(data.per_page)}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[70px] bg-[var(--admin-glass-bg)] border-[var(--admin-glass-border)] backdrop-blur-[var(--admin-glass-blur)] focus:border-[var(--admin-primary-blue)] focus:ring-2 focus:ring-[var(--admin-primary-blue)]/20" style={{ transition: 'var(--admin-transition-fast)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>per halaman</span>
          </div>

          <div className="flex items-center gap-1">
            <GradientButton
              variant="secondary"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={data.current_page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </GradientButton>
            <GradientButton
              variant="secondary"
              size="icon"
              onClick={() => handlePageChange(data.current_page - 1)}
              disabled={data.current_page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </GradientButton>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, data.last_page) }, (_, i) => {
              let pageNum: number
              if (data.last_page <= 5) {
                pageNum = i + 1
              } else if (data.current_page <= 3) {
                pageNum = i + 1
              } else if (data.current_page >= data.last_page - 2) {
                pageNum = data.last_page - 4 + i
              } else {
                pageNum = data.current_page - 2 + i
              }
              return (
                <GradientButton
                  key={pageNum}
                  variant={data.current_page === pageNum ? 'primary' : 'secondary'}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </GradientButton>
              )
            })}

            <GradientButton
              variant="secondary"
              size="icon"
              onClick={() => handlePageChange(data.current_page + 1)}
              disabled={data.current_page === data.last_page}
            >
              <ChevronRight className="h-4 w-4" />
            </GradientButton>
            <GradientButton
              variant="secondary"
              size="icon"
              onClick={() => handlePageChange(data.last_page)}
              disabled={data.current_page === data.last_page}
            >
              <ChevronsRight className="h-4 w-4" />
            </GradientButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
