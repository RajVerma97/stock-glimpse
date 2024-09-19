import React from 'react'
import { useFormik } from 'formik'
import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { AiOutlineFrown } from 'react-icons/ai'

type StockDetail = {
  symbol: string
  companyName: string
  currentPrice: number
  marketCap: number
  industry: string
}

const columns: ColumnDef<StockDetail>[] = [
  { id: 'serialNumber', header: 'No.', accessorFn: (_, index) => index + 1 },
  { accessorKey: 'symbol', header: 'Symbol' },
  { accessorKey: 'companyName', header: 'Company Name' },
  { accessorKey: 'currentPrice', header: 'Current Price' },
  { accessorKey: 'marketCap', header: 'Market Cap' },
  { accessorKey: 'industry', header: 'Industry' },
]

interface StockTableProps {
  data: StockDetail[]
  pagination: {
    currentPage: number
    totalPages: number
    limit: number
  }
  onPageChange: (page: number) => void
}

const StockTableComponent: React.FC<StockTableProps> = ({ data, pagination, onPageChange }) => {
  const formik = useFormik({
    initialValues: {
      currentPage: pagination.currentPage,
    },
    onSubmit: (values) => {
      onPageChange(values.currentPage)
    },
  })

  const table = useReactTable({
    data,
    columns,
    pageCount: pagination.totalPages,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full overflow-hidden rounded-lg bg-gray-900 text-white shadow-md">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-center text-sm font-semibold uppercase tracking-wider text-gray-300"
                  >
                    {typeof header.column.columnDef.header === 'function'
                      ? (header.column.columnDef.header as (props: any) => React.ReactNode)({})
                      : header.column.columnDef.header}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-900">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                <div className="flex flex-col items-center">
                  <AiOutlineFrown className="mb-4 text-6xl text-gray-500" />
                  <p className="text-lg">No data available</p>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} onClick={() => {}} className="cursor-pointer hover:bg-gray-800">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-center text-sm font-medium text-gray-200">
                    {cell.getValue<string>()}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-700 bg-gray-800 px-4 py-2">
        <button
          type="button"
          onClick={() => {
            formik.setFieldValue('currentPage', pagination.currentPage - 1)
            formik.handleSubmit()
          }}
          disabled={pagination.currentPage === 1}
          className="cursor-pointer rounded-lg bg-pink-600 px-4 py-2 text-white transition hover:bg-pink-700 disabled:bg-gray-600"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          type="button"
          onClick={() => {
            formik.setFieldValue('currentPage', pagination.currentPage + 1)
            formik.handleSubmit()
          }}
          disabled={pagination.currentPage === pagination.totalPages}
          className="cursor-pointer rounded-lg bg-pink-600 px-4 py-2 text-white transition hover:bg-pink-700 disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default StockTableComponent
