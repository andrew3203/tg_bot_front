"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateAction() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<string>("");
  const [messageOptions, setMessageOptions] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [name, setName] = useState<string>("");

  const actionTypes = [
    "Зарегестрировать пользователя",
    "Считать количество кликов",
    "Отправить сообщение в поддержку",
    "Сохранить ответ пользователя",
  ];

  const fetchMessageOptions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/message/names/list`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch message options");
      }

      const result = await response.json();
      setMessageOptions(result || []);
    } catch (error) {
      console.error("Error fetching message options:", error);
    }
  };

  useEffect(() => {
    fetchMessageOptions();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const body = {
      message_id: selectedMessageId,
      action_type: actionType,
      params: {},
      name: name,
    };

    setLoading(true);

    try {
      const response = await fetch("https://bot-api.portobello.ru/action", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save action");
      }

      const result = await response.json();

      if (result) {
        router.push("/actions"); // Redirect to actions list page after successful save
      }
    } catch (error) {
      console.error("Error saving action:", error);
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
          <h3 className="text-2xl">Создание действия</h3>
        </div>

        <div className="mb-4 mt-6 flex w-full items-center gap-2">
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="name">Название действия</Label>
            <Input
              id="name"
              placeholder="Введите название действия"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="actionType">Тип действия</Label>
            <Select onValueChange={(value) => setActionType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип действия" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="messageId">ID Сообщения</Label>
            <Select onValueChange={(value) => setSelectedMessageId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите ID сообщения" />
              </SelectTrigger>
              <SelectContent>
                {messageOptions.map((option: any) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
