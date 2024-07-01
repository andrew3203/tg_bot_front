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
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

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
  PaginationEllipsis,
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

const data = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
    firstName: "Ken",
    lastName: "Williams",
    internalCode: "KV001",
    company: "Tech Solutions",
    rating: 4.7,
    turnover: 15000,
    orderCount: 10,
    creationDate: "2023-01-15",
    updateDate: "2023-06-10",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
    firstName: "Abe",
    lastName: "Johnson",
    internalCode: "AJ002",
    company: "Innovate LLC",
    rating: 4.5,
    turnover: 12000,
    orderCount: 8,
    creationDate: "2023-02-20",
    updateDate: "2023-05-18",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
    firstName: "Monserrat",
    lastName: "Garcia",
    internalCode: "MG003",
    company: "Creative Inc",
    rating: 4.9,
    turnover: 20000,
    orderCount: 15,
    creationDate: "2023-03-12",
    updateDate: "2023-06-05",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
    firstName: "Silas",
    lastName: "Brown",
    internalCode: "SB004",
    company: "Enterprise Corp",
    rating: 4.6,
    turnover: 18000,
    orderCount: 12,
    creationDate: "2023-04-01",
    updateDate: "2023-06-15",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
    firstName: "Carmella",
    lastName: "Martinez",
    internalCode: "CM005",
    company: "Retailers Ltd",
    rating: 4.2,
    turnover: 10000,
    orderCount: 6,
    creationDate: "2023-01-25",
    updateDate: "2023-05-30",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
    firstName: "Carmella",
    lastName: "Martinez",
    internalCode: "CM005",
    company: "Retailers Ltd",
    rating: 4.2,
    turnover: 10000,
    orderCount: 6,
    creationDate: "2023-01-25",
    updateDate: "2023-05-30",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
    firstName: "Carmella",
    lastName: "Martinez",
    internalCode: "CM005",
    company: "Retailers Ltd",
    rating: 4.2,
    turnover: 10000,
    orderCount: 6,
    creationDate: "2023-01-25",
    updateDate: "2023-05-30",
  },
];

const ActionMenu: React.FC<{ url: string }> = ({ url }) => {
  const router = useRouter();

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
        <DropdownMenuItem>Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
    id: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "firstName",
    header: "Имя",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("firstName")}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Фамилия",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("lastName")}</div>
    ),
  },
  {
    accessorKey: "internalCode",
    header: "Внутренний код",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("internalCode")}</div>
    ),
  },
  {
    accessorKey: "company",
    header: "Компания",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("company")}</div>
    ),
  },
  {
    accessorKey: "rating",
    header: () => <div className="text-center">Рейтинг</div>,
    cell: ({ row }) => {
      const rating: number = row.getValue("rating");

      return <div className="text-center font-medium">{rating.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "turnover",
    header: () => <div className="text-right">Оборот</div>,
    cell: ({ row }) => {
      const turnover = parseFloat(row.getValue("turnover"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(turnover);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "orderCount",
    header: () => <div className="text-center">Кол-во заказов</div>,
    cell: ({ row }) => {
      const orderCount: number = row.getValue("orderCount");

      return <div className="text-center font-medium">{orderCount}</div>;
    },
  },
  {
    accessorKey: "creationDate",
    header: "Дата создания",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("creationDate")}</div>
    ),
  },
  {
    accessorKey: "updateDate",
    header: "Дата обновления",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("updateDate")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionMenu url={`/users/${row.original.id}`} />,
  },
];

export default function Users() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  return (
    <div className="mx-auto mt-24 w-full max-w-[1440px] px-6">
      <div className="flex items-center justify-between py-4">
        <h3>Пользователи</h3>
        <Input
          placeholder="Поиск"
          value={
            (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
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
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/*<div className="flex items-center justify-end space-x-2 py-4">*/}
      {/*    <div className="flex-1 text-sm text-muted-foreground">*/}
      {/*        {table.getFilteredSelectedRowModel().rows.length} of{" "}*/}
      {/*        {table.getFilteredRowModel().rows.length} row(s) selected.*/}
      {/*    </div>*/}
      {/*    <div className="space-x-2">*/}
      {/*        <Button*/}
      {/*            variant="outline"*/}
      {/*            size="sm"*/}
      {/*            onClick={() => table.previousPage()}*/}
      {/*            disabled={!table.getCanPreviousPage()}*/}
      {/*        >*/}
      {/*            Previous*/}
      {/*        </Button>*/}
      {/*        <Button*/}
      {/*            variant="outline"*/}
      {/*            size="sm"*/}
      {/*            onClick={() => table.nextPage()}*/}
      {/*            disabled={!table.getCanNextPage()}*/}
      {/*        >*/}
      {/*            Next*/}
      {/*        </Button>*/}
      {/*    </div>*/}
      {/*</div>*/}
    </div>
  );
}
