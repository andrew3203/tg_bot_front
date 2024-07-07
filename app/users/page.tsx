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
import { User } from "@/types/user";

const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "firstname",
    header: "Имя",
    cell: ({ row }) => <div>{row.getValue("firstname")}</div>,
  },
  {
    accessorKey: "lastname",
    header: "Фамилия",
    cell: ({ row }) => <div>{row.getValue("lastname")}</div>,
  },
  {
    accessorKey: "portobello_id",
    header: "Внутренный код",
    cell: ({ row }) => <div>{row.getValue("portobello_id")}</div>,
  },
  {
    accessorKey: "company",
    header: "Компания",
    cell: ({ row }) => <div>{row.getValue("company")}</div>,
  },
  {
    accessorKey: "rating",
    header: "Рейтинг",
    cell: ({ row }) => <div>{row.getValue("rating")}</div>,
  },
  {
    accessorKey: "turnover",
    header: "Оборот",
    cell: ({ row }) => <div>{row.getValue("turnover")}</div>,
  },
  {
    accessorKey: "orders_amount",
    header: "Количество заказов",
    cell: ({ row }) => <div>{row.getValue("orders_amount")}</div>,
  },
  // {
  //   accessorKey: "cashback_amount",
  //   header: "Сумма кэшбэка",
  //   cell: ({ row }) => <div>{row.getValue("cashback_amount")}</div>,
  // },
  // {
  //   accessorKey: "golden_tickets_amount",
  //   header: "Количество золотых билетов",
  //   cell: ({ row }) => <div>{row.getValue("golden_tickets_amount")}</div>,
  // },
  {
    accessorKey: "created_at",
    header: "Дата создания",
    cell: ({ row }) => {
      const creationDate: Date = row.getValue("created_at");
      return (
        <div className="capitalize">
          {creationDate ? dayjs(creationDate).format("DD.MM.YYYY") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Дата обновления",
    cell: ({ row }) => {
      const updateDate: Date = row.getValue("updated_at");
      return (
        <div className="capitalize">
          {updateDate ? dayjs(updateDate).format("DD.MM.YYYY") : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionMenu id={row.getValue("id")} url={`/users/${row.original.id}`} />
    ),
  },
];

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
        `https://bot-api.portobello.ru/user?user_id=${id}`,
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
      console.error("Error saving user:", error);
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

export default function Users() {
  const router = useRouter();

  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = async (pageNumber: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/user/list?page_number=${pageNumber}&page_limit=10`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();

      setData(result.data || []);
      setTotalPages(result.count <= 10 ? 1 : Math.ceil(result.count / 10));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
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
        <h3>Сообщения</h3>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Поиск"
            value={
              (table.getColumn("firstname")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("firstname")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <CirclePlus
            className="h-10 w-10 cursor-pointer"
            onClick={() => router.push("users/create")}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
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
                  No messages found
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
