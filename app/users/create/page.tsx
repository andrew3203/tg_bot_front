"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiple-selector";

export default function UserCreate() {
  const params = useParams();
  const router = useRouter();

  const [value, setValue] = useState<Option[]>([]);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [patronymic, setPatronymic] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [turnover, setTurnover] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);

  return (
    <main className="mx-auto mt-24 flex min-h-screen max-w-[1440px] p-6">
      <div className="flex w-full flex-col">
        <div className="flex h-fit w-full items-center">
          <span
            className="flex cursor-pointer items-center gap-2"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </span>
        </div>
        <div className="flex w-full items-center justify-between border-b-4 border-blue-300 py-6">
          <h3 className="text-2xl">
            {surname} {name} {patronymic}
          </h3>
          <div className="flex items-center gap-2">
            <span className="flex cursor-pointer items-center gap-2 rounded-[6px] border border-gray-300 bg-white px-3 py-[2px] text-[12px] font-semibold">
              Кол-во кликов: 0
            </span>
            <span className="flex cursor-pointer items-center gap-2 rounded-[6px] border border-gray-300 bg-white px-3 py-[2px] text-[12px] font-semibold">
              Уникальниых кликов: 0
            </span>
          </div>
        </div>

        <div className="mb-4 flex w-full items-center gap-2">
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              placeholder="Введите Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="surname">Фамилия</Label>
            <Input
              id="surname"
              placeholder="Введите Фамилию"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="patronymic">Отчество</Label>
            <Input
              id="patronymic"
              placeholder="Введите Отчество"
              value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 flex w-full items-center gap-2">
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="code">Внутренний код</Label>
            <Input
              id="code"
              placeholder="Введите Внутренний код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="company">Компания</Label>
            <Input
              id="company"
              placeholder="Введите Компанию"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 flex w-full items-center gap-2">
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="rating">Рейтинг</Label>
            <Input
              id="rating"
              placeholder="Введите Рейтинг"
              value={rating}
              onChange={(e) => setRating(+e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="turnover">Оборот</Label>
            <Input
              id="turnover"
              placeholder="Введите Оборот"
              value={turnover}
              onChange={(e) => setTurnover(+e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="orderCount">Кол-во заказов</Label>
            <Input
              id="orderCount"
              placeholder="Введите Кол-во заказов"
              value={orderCount}
              onChange={(e) => setOrderCount(+e.target.value)}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-end">
          <Button>Сохранить</Button>
        </div>
      </div>
    </main>
  );
}
