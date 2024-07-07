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

export default function CreateResponse() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messageOptions, setMessageOptions] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [responseType, setResponseType] = useState("");
  const [responseText, setResponseText] = useState("");

  const fetchUserOptions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(`https://bot-api.portobello.ru/user/list`, {
        method: "GET",
        headers: {
          accept: "application/json",
          token: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user options");
      }

      const result = await response.json();
      setUserOptions(result.data || []);
    } catch (error) {
      console.error("Error fetching user options:", error);
    }
  };

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
    fetchUserOptions();
    fetchMessageOptions();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const body = {
      user_id: selectedUserId,
      message_id: selectedMessageId,
      response_type_name: responseType,
      text: responseText,
    };

    setLoading(true);

    try {
      const response = await fetch(
        "https://bot-api.portobello.ru/user_response",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save response");
      }

      const result = await response.json();

      if (result) {
        router.push("/responses"); // Redirect to responses list page after successful save
      }
    } catch (error) {
      console.error("Error saving response:", error);
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
          <h3 className="text-2xl">Создание ответа</h3>
        </div>

        <div className="mb-4 mt-6 flex w-full items-center gap-2">
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="responseText">Текст ответа</Label>
            <Input
              id="responseText"
              placeholder="Введите текст ответа"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="responseType">Тип ответа</Label>
            <Input
              id="responseType"
              placeholder="Введите тип ответа"
              value={responseType}
              onChange={(e) => setResponseType(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Label htmlFor="userId">ID Пользователя</Label>
            <Select onValueChange={(value) => setSelectedUserId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите ID пользователя" />
              </SelectTrigger>
              <SelectContent>
                {userOptions.map((option: any) => (
                  <SelectItem key={option.key} value={option.id}>
                    {`${option.id} ${option.lastname} ${option.firstname}`}
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
