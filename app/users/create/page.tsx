"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [cashback, setCashback] = useState<number>(0);
  const [goldenTickets, setGoldenTickets] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState("");
  const [groupNames, setGroupNames] = useState([]);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/group/names/list`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const result = await response.json();
      setGroupNames(result || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const body = {
      group_id: group,
      firstname: name,
      lastname: surname,
      portobello_id: code,
      company,
      rating,
      turnover,
      orders_amount: orderCount,
      cashback_amount: cashback,
      golden_tickets_amount: goldenTickets,
    };

    setLoading(true);

    try {
      const response = await fetch("https://bot-api.portobello.ru/user", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      const result = await response.json();

      if (result) {
        router.push("/users");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

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

        <div className="mb-4 mt-6 flex w-full items-center gap-2">
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
          <div className="flex w-fit items-center gap-2">
            <div className="flex w-fit flex-col space-y-1.5">
              <Label htmlFor="group">Группа</Label>

              <Select onValueChange={(value) => setGroup(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите группу" />
                </SelectTrigger>
                <SelectContent>
                  {groupNames.map((group: any) => {
                    return (
                      <SelectItem key={group.key} value={group.key}>
                        {group.value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
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

        <div className="mb-4 flex w-full items-center gap-2">
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="cashback">Кэшбэк</Label>
            <Input
              id="cashback"
              placeholder="Введите Кэшбэк"
              value={cashback}
              onChange={(e) => setCashback(+e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="goldenTickets">Золотые Билеты</Label>
            <Input
              id="goldenTickets"
              placeholder="Введите Золотые Билеты"
              value={goldenTickets}
              onChange={(e) => setGoldenTickets(+e.target.value)}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Создание..." : "Создать"}
          </Button>
        </div>
      </div>
    </main>
  );
}
