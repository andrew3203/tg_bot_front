"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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

interface Response {
  id: number;
  user_id: number;
  message_id: number;
  response_type_name: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export default function EditResponse() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<Response | null>(null);
  const [messageOptions, setMessageOptions] = useState<any[]>([]);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  console.log(response);

  const fetchResponse = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/user_response?user_response_id=${id}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const result = await response.json();
      setResponse(result);
    } catch (error) {
      console.error("Error fetching response:", error);
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
      const options = result.map((item: any) => ({
        value: item.key,
        label: item.value,
      }));
      setMessageOptions(options);
    } catch (error) {
      console.error("Error fetching message options:", error);
    }
  };

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

      setUserOptions(result.data);
    } catch (error) {
      console.error("Error fetching user options:", error);
    }
  };

  useEffect(() => {
    fetchResponse();
    fetchMessageOptions();
    fetchUserOptions();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const body = {
      user_id: response?.user_id,
      message_id: response?.message_id,
      response_type_name: response?.response_type_name,
      text: response?.text,
    };

    setLoading(true);

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/user_response?user_response_id=${id}`,
        {
          method: "PUT",
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
      {response && (
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
            <h3 className="text-2xl">Редактирование ответа</h3>
          </div>

          <div className="mb-4 mt-6 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="text">Текст ответа</Label>
              <Input
                id="text"
                placeholder="Введите текст"
                value={response.text}
                onChange={(e) =>
                  setResponse({ ...response, text: e.target.value })
                }
              />
            </div>
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="response_type_name">Тип ответа</Label>
              <Input
                id="response_type_name"
                placeholder="Введите тип ответа"
                value={response.response_type_name}
                onChange={(e) =>
                  setResponse({
                    ...response,
                    response_type_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="user_id">ID Пользователя</Label>
              <Select
                onValueChange={(value) =>
                  setResponse({ ...response, user_id: Number(value) })
                }
                defaultValue={`${response.user_id}`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите ID пользователя" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((option: any) => (
                    <SelectItem key={option.key} value={`${option.id}`}>
                      {`${option.id} ${option.lastname} ${option.firstname}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="message_id">ID Сообщения</Label>
              <Select
                onValueChange={(value) =>
                  setResponse({ ...response, message_id: Number(value) })
                }
                defaultValue={`${response.message_id}`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите ID сообщения" />
                </SelectTrigger>
                <SelectContent>
                  {messageOptions.map((option: any) => (
                    <SelectItem key={option.value} value={`${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex w-full items-center justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
