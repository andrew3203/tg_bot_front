"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function CreateMailing() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [groupId, setGroupId] = useState<any>(null);
  const [messageId, setMessageId] = useState<any>(null);
  const [startDate, setStartDate] = useState<any>("");

  const [groupNames, setGroupNames] = useState<any[]>([]);
  const [messageNames, setMessageNames] = useState<any[]>([]);

  useEffect(() => {
    fetchGroupNames();
    fetchMessageNames();
  }, []);

  const fetchGroupNames = async () => {
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
        throw new Error("Failed to fetch group names");
      }

      const result = await response.json();
      setGroupNames(result || []);
    } catch (error) {
      console.error("Error fetching group names:", error);
    }
  };

  const fetchMessageNames = async () => {
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
        throw new Error("Failed to fetch message names");
      }

      const result = await response.json();
      setMessageNames(result || []);
    } catch (error) {
      console.error("Error fetching message names:", error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const body = {
      group_id: groupId,
      message_id: messageId,
      name: name,
      // start_date: startDate.toISOString(),
    };

    setLoading(true);

    try {
      const response = await fetch("https://bot-api.portobello.ru/broadcast", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to create mailing");
      }

      const result = await response.json();

      if (result) {
        router.push("/mailings"); // Redirect to mailings list page after successful creation
      }
    } catch (error) {
      console.error("Error creating mailing:", error);
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
          <h3 className="text-2xl">Создание рассылки</h3>
        </div>

        <div className="mb-4 mt-6 flex w-full items-center gap-2">
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="name">Название рассылки</Label>
            <Input
              id="name"
              placeholder="Введите название рассылки"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="groupId">Группа</Label>
            <Select onValueChange={(value) => setGroupId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите группу" />
              </SelectTrigger>
              <SelectContent>
                {groupNames.map((group) => (
                  <SelectItem key={group.key} value={group.key}>
                    {group.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="messageId">ID сообщения</Label>
            <Select onValueChange={(value) => setMessageId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите ID сообщения" />
              </SelectTrigger>
              <SelectContent>
                {messageNames.map((message) => (
                  <SelectItem key={message.key} value={message.key}>
                    {message.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/*<div className="flex w-full flex-col space-y-1.5">*/}
          {/*  <Label htmlFor="startDate">Дата начала</Label>*/}
          {/*  <Input*/}
          {/*    type="datetime-local"*/}
          {/*    id="startDate"*/}
          {/*    value={startDate}*/}
          {/*    onChange={(e) => setStartDate(e.target.value)}*/}
          {/*  />*/}
          {/*</div>*/}
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
