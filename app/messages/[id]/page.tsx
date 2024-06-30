"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function MessageEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [message, setMessage] = useState<any>(null);
  const [group, setGroup] = useState("");
  const [name, setName] = useState("");
  const [alias, setAlias] = useState<string>("");
  const [parentMessages, setParentMessages] = useState<Option[]>([]);
  const [childMessages, setChildMessages] = useState<Option[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [groupNames, setGroupNames] = useState([]);
  const [messageNames, setMessageNames] = useState([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Option[]>([]);

  const fetchMessages = async () => {
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
        throw new Error("Failed to fetch messages");
      }

      const result = await response.json();

      setMessageNames(result || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchMessage = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/message?message_id=${id}`,
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
      if (result) {
        const currentPrentMessages = Object.keys(result.parents).reduce(
          (acc: any, key: any) => {
            const element = {
              label: key,
              value: result.parents[key],
            };
            acc.push(element);
            return acc;
          },
          []
        );
        const currentChildMessages = Object.keys(result.childrens).reduce(
          (acc: any, key: any) => {
            const element = {
              label: key,
              value: result.childrens[key],
            };
            acc.push(element);
            return acc;
          },
          []
        );
        setImages(result.media);
        setMessage(result);
        setGroup(result.group_id);
        setName(result.name);
        setAlias(result.tg_alias_name);
        setParentMessages(currentPrentMessages);
        setChildMessages(currentChildMessages);
        setMessageText(result.text);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchMessage();
  }, [groupNames, messageNames]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    try {
      const response = await fetch(
        "https://bot-api.portobello.ru/message/file",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            token: token,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setImages((prevImages) => [...prevImages, result]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }

    event.target.value = "";
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const body = {
      group_id: group,
      parents: parentMessages.reduce((acc: any, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {}),
      childrens: childMessages.reduce((acc: any, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {}),
      name,
      tg_alias_name: alias,
      text: messageText,
      media: images,
    };

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/message?message_id=${message?.id}`,
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
        throw new Error("Failed to save");
      }

      const result = await response.json();

      if (result) {
        router.push("/messages");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
  };

  return (
    <main className="mx-auto mt-24 flex min-h-screen max-w-[1440px] p-6">
      {message && (
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
          <div className="mb-6 flex w-full items-center justify-between border-b-4 border-blue-300 py-6">
            <h3 className="text-2xl">{name}</h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="mb-4 flex max-w-[80px] items-center gap-2">
              <div className="flex w-full flex-col space-y-1.5">
                <Label htmlFor="messageId">ID</Label>
                <Input placeholder="ID" value={group} disabled />
              </div>
            </div>
            <div className="mb-4 flex w-full items-center gap-2">
              <div className="flex w-full flex-col space-y-1.5">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Введите Название"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex w-fit items-center gap-2">
              <div className="flex w-fit flex-col space-y-1.5">
                <Label htmlFor="group">Группа</Label>

                <Select
                  onValueChange={(value) => setGroup(value)}
                  defaultValue={`${message?.group_id}`}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите группу" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupNames.map((group: any) => {
                      return (
                        <SelectItem key={group.key} value={`${group.key}`}>
                          {group.value}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full items-center gap-2">
              <div className="flex w-full flex-col space-y-1.5">
                <Label htmlFor="alias">Псевдоним</Label>
                <Input
                  placeholder="Введите Псевдоним"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="parentMessages">Родительские сообщения</Label>
              <MultipleSelector
                placeholder="Введите Родительские сообщения"
                value={parentMessages}
                onChange={(value) => setParentMessages(value)}
                options={messageNames.reduce(
                  (acc: Option[], item: Record<string, string>) => {
                    const element = {
                      label: item.value,
                      value: item.key,
                    };

                    acc.push(element);
                    return acc;
                  },
                  []
                )}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="childMessages">Дочерские сообщения</Label>
              <MultipleSelector
                placeholder="Введите Дочерские сообщения"
                value={childMessages}
                onChange={(value) => setChildMessages(value)}
                options={messageNames.reduce(
                  (acc: Option[], item: Record<string, string>) => {
                    const element = {
                      label: item.value,
                      value: item.key,
                    };

                    acc.push(element);
                    return acc;
                  },
                  []
                )}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="messageText">Текст сообщения</Label>
              <Textarea
                id="messageText"
                placeholder="Введите Текст сообщения"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="imageUpload">Загрузить изображение</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative h-24 w-24">
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="h-full w-full object-cover"
                />
                <button
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-white hover:opacity-70"
                  onClick={() => handleDeleteImage(image)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="flex w-full items-center justify-end">
            <Button disabled={loading} onClick={handleSave}>
              Сохранить
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
