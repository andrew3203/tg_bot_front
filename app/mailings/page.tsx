"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Mailing = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  planned_quantity: number;
  succeded_quantity: number;
  created_at: string;
  updated_at: string;
};

const ActionMenu: React.FC<{ id: number; url: string }> = ({ id, url }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/broadcast?broadcast_id=${id}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      location.reload();
    } catch (error) {
      console.error("Error saving mailing:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(url)}>
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const columns: ColumnDef<Mailing>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Название",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "start_date",
    header: "Дата начала",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("start_date") || "-"}</div>
    ),
  },
  {
    accessorKey: "end_date",
    header: "Дата окончания",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("end_date") || "-"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "planned_quantity",
    header: "Запланировано шт.",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("planned_quantity")}</div>
    ),
  },
  {
    accessorKey: "succeded_quantity",
    header: "Успешно шт.",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("succeded_quantity")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Дата создания",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("created_at") || "-"}</div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: "Дата обновления",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("updated_at") || "-"}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionMenu
        id={row.getValue("id")}
        url={`/mailings/${row.original.id}`}
      />
    ),
  },
];

export default function Mailings() {
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [data, setData] = React.useState<Mailing[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  React.useEffect(() => {
    fetchMailings();
  }, []);

  const fetchMailings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/broadcast/list?page_number=1&page_limit=10`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch mailings");
      }

      const result = await response.json();
      setData(result.data || []);
      setTotalPages(result.count <= 10 ? 1 : Math.ceil(result.count / 10));
    } catch (error) {
      console.error("Error fetching mailings:", error);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="mx-auto mt-24 w-full max-w-[1440px] px-6">
      <div className="flex items-center justify-between py-4">
        <h3>Рассылки</h3>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Поиск"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <CirclePlus
            className="h-10 w-10 cursor-pointer"
            onClick={() => router.push("mailings/create")}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination className="my-4">
        <PaginationContent>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) handlePageChange(page - 1);
            }}
            // disabled={page === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i + 1);
                }}
                isActive={i + 1 === page}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) handlePageChange(page + 1);
            }}
            // disabled={page === totalPages}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}
