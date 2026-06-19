import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Pagination } from './Pagination';
import { Button } from './ui/button';

interface DataTableProps {
  data: any[];
  columns: string[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onCellChange?: (rowId: string, column: string, value: string) => void;
  onHeaderRename?: (column: string, newName: string) => boolean;
  onAddRow?: () => void;
  onDeleteRow?: (rowId: string) => void;
}

export function DataTable({
  data,
  columns,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onCellChange,
  onHeaderRename,
  onAddRow,
  onDeleteRow,
}: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');

  const startCellEdit = (rowId: string, column: string, currentValue: string) => {
    if (!onCellChange) return;
    setEditingCell({ rowId, column });
    setDraftValue(currentValue);
  };

  const commitCellEdit = () => {
    if (!editingCell || !onCellChange) {
      setEditingCell(null);
      return;
    }

    onCellChange(editingCell.rowId, editingCell.column, draftValue);
    setEditingCell(null);
    setDraftValue('');
  };

  const startHeaderEdit = (column: string) => {
    if (!onHeaderRename) return;
    setEditingHeader(column);
    setDraftValue(column);
  };

  const commitHeaderEdit = () => {
    if (!editingHeader || !onHeaderRename) {
      setEditingHeader(null);
      return;
    }

    const didRename = onHeaderRename(editingHeader, draftValue);
    if (didRename) {
      setEditingHeader(null);
      setDraftValue('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      {(onAddRow || onHeaderRename || onCellChange || onDeleteRow) && (
        <div className="px-4 py-3 border-b border-border bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Click a header to rename it. Click a cell to edit it.
          </div>
          {onAddRow && (
            <Button onClick={onAddRow} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-border">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[200px] min-w-[200px]"
                >
                  {editingHeader === column ? (
                    <input
                      autoFocus
                      value={draftValue}
                      onChange={(event) => setDraftValue(event.target.value)}
                      onBlur={commitHeaderEdit}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          commitHeaderEdit();
                        }

                        if (event.key === 'Escape') {
                          setEditingHeader(null);
                          setDraftValue('');
                        }
                      }}
                      className="w-full rounded border border-blue-300 px-2 py-1 text-xs font-medium text-gray-700 uppercase tracking-wider"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => startHeaderEdit(column)}
                      className={`truncate text-left w-full ${onHeaderRename ? 'hover:text-blue-600' : ''}`}
                      title={column}
                      disabled={!onHeaderRename}
                    >
                      {column}
                    </button>
                  )}
                </th>
              ))}
              {onDeleteRow && (
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[96px] min-w-[96px]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onDeleteRow ? 1 : 0)}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => {
                    const isEditingThisCell =
                      editingCell !== null &&
                      editingCell.rowId === row.__rowId &&
                      editingCell.column === column;

                    return (
                    <td
                      key={column}
                      className="px-6 py-4 text-sm text-gray-600 w-[200px] min-w-[200px]"
                    >
                      {isEditingThisCell ? (
                        <input
                          autoFocus
                          value={draftValue}
                          onChange={(event) => setDraftValue(event.target.value)}
                          onBlur={commitCellEdit}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              commitCellEdit();
                            }

                            if (event.key === 'Escape') {
                              setEditingCell(null);
                              setDraftValue('');
                            }
                          }}
                          className="w-full rounded border border-blue-300 px-2 py-1 text-sm text-gray-700"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => startCellEdit(String(row.__rowId ?? index), column, String(row[column] ?? ''))}
                          className={`truncate text-left w-full min-h-6 ${onCellChange ? 'hover:text-blue-600' : ''}`}
                          title={row[column]}
                          disabled={!onCellChange}
                        >
                          {String(row[column] ?? '') !== '' ? (
                            row[column]
                          ) : (
                            <span className="text-gray-300">(empty)</span>
                          )}
                        </button>
                      )}
                    </td>
                  )})}
                  {onDeleteRow && (
                    <td className="px-4 py-4 text-sm text-gray-600 w-[96px] min-w-[96px]">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteRow(String(row.__rowId ?? index))}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
