import React, { memo } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import { AiOutlineFrown } from "react-icons/ai";
import { useRouter } from "next/navigation";

type StockDetail = {
  symbol: string;
  companyName: string;
  currentPrice: number;
  marketCap: number;
  industry: string;
};

const columns: ColumnDef<StockDetail>[] = [
  { id: "serialNumber", header: "No.", accessorFn: (_, index) => index + 1 },
  { accessorKey: "symbol", header: "Symbol" },
  { accessorKey: "companyName", header: "Company Name" },
  { accessorKey: "currentPrice", header: "Current Price" },
  { accessorKey: "marketCap", header: "Market Cap" },
  { accessorKey: "industry", header: "Industry" },
];

interface StockTableProps {
  data: StockDetail[];
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  onPageChange: (page: number) => void;
}

const StockTableComponent: React.FC<StockTableProps> = ({
  data,
  pagination,
  onPageChange,
}) => {
  const router = useRouter();

  const handleRowClick = (symbol: string) => {
    router.refresh();
    router.push(`/stock-detail/${symbol}`);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pagination.totalPages,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-gray-900 text-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider"
                  >
                    {typeof header.column.columnDef.header === "function"
                      ? (
                          header.column.columnDef.header as (
                            props: any
                          ) => React.ReactNode
                        )({})
                      : header.column.columnDef.header}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-400"
              >
                <div className="flex flex-col items-center">
                  <AiOutlineFrown className="text-6xl text-gray-500 mb-4" />
                  <p className="text-lg">No data available</p>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.original.symbol)}
                className="cursor-pointer hover:bg-gray-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 text-sm font-medium text-gray-200 text-center"
                  >
                    {cell.getValue<string>()}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center px-4 py-2 bg-gray-800 border-t border-gray-700">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-600 transition cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-600 transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Memoize the component to avoid unnecessary re-renders
const StockTable = memo(StockTableComponent);

export default StockTable;
