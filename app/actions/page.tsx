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
import dayjs from "dayjs";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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

type Action = {
  id: number;
  name: string;
  run_amount: number;
  succeded_amount: number;
  message_name: string;
  message_id: number;
  created_at: string;
  updated_at: string;
};

const columns: ColumnDef<Action>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Название",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "run_amount",
    header: "Всего запусков",
    cell: ({ row }) => <div>{row.getValue("run_amount")}</div>,
  },
  {
    accessorKey: "succeded_amount",
    header: "Успешных запусков",
    cell: ({ row }) => <div>{row.getValue("succeded_amount")}</div>,
  },
  {
    accessorKey: "message_name",
    header: "Имя сообщения",
    cell: ({ row }) => <div>{row.getValue("message_name")}</div>,
  },
  {
    accessorKey: "created_at",
    header: "Дата создания",
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("created_at");
      return (
        <div className="capitalize">
          {createdAt ? dayjs(createdAt).format("DD.MM.YYYY HH:mm:ss") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Дата обновления",
    cell: ({ row }) => {
      const updatedAt: Date = row.getValue("updated_at");
      return (
        <div className="capitalize">
          {updatedAt ? dayjs(updatedAt).format("DD.MM.YYYY HH:mm:ss") : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionMenu id={row.getValue("id")} />,
  },
];

const ActionMenu: React.FC<{ id: number }> = ({ id }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/action?action_id=${id}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete action");
      }

      location.reload();
    } catch (error) {
      console.error("Error deleting action:", error);
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
        <DropdownMenuItem onClick={() => router.push(`/actions/${id}`)}>
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Actions() {
  const router = useRouter();

  const [data, setData] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchActions = async (pageNumber: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/action/list?page_number=${pageNumber}&page_limit=10`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch actions");
      }

      const result = await response.json();

      setData(result.data || []);
      setTotalPages(result.count <= 10 ? 1 : Math.ceil(result.count / 10));
    } catch (error) {
      console.error("Error fetching actions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions(page);
  }, [page]);

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
        <h3>Действия</h3>
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
            onClick={() => router.push("actions/create")}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                <TableCell colSpan={columns.length} className="text-center">
                  Нет данных
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
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}
