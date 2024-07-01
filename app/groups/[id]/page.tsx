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

export default function GroupEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [name, setName] = useState("");
  const [criterionField, setCriterionField] = useState("");
  const [criterionFieldType, setCriterionFieldType] = useState("");
  const [criterionValue, setCriterionValue] = useState("");
  const [criterionValueType, setCriterionValueType] = useState("");
  const [criterionRule, setCriterionRule] = useState("=");
  const [loading, setLoading] = useState(true);

  const fetchGroup = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/group?group_id=${id}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch group");
      }

      const result = await response.json();
      if (result) {
        setGroup(result);
        setName(result.name);
        setCriterionField(result.criterion_field);
        setCriterionFieldType(result.criterion_field_type);
        setCriterionValue(result.criterion_value);
        setCriterionValueType(result.criterion_value_type);
        setCriterionRule(result.criterion_rule);
      }
    } catch (error) {
      console.error("Error fetching group:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const body = {
      name,
      criterion_field: criterionField,
      criterion_field_type: criterionFieldType,
      criterion_value: criterionValue,
      criterion_value_type: criterionValueType,
      criterion_rule: criterionRule,
    };

    try {
      const response = await fetch(
        `https://bot-api.portobello.ru/group?group_id=${group?.id}`,
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
        router.push("/groups");
      }
    } catch (error) {
      console.error("Error saving group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto mt-24 flex min-h-screen max-w-[1440px] p-6">
      {group && (
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
                <Label htmlFor="groupId">ID</Label>
                <Input placeholder="ID" value={group.id} disabled />
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

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="criterionField">Критерий Поле</Label>
              <Input
                id="criterionField"
                placeholder="Введите Критерий Поле"
                value={criterionField}
                onChange={(e) => setCriterionField(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="criterionFieldType">Тип Критерия Поля</Label>
              <Input
                id="criterionFieldType"
                placeholder="Введите Тип Критерия Поля"
                value={criterionFieldType}
                onChange={(e) => setCriterionFieldType(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="criterionValue">Значение Критерия</Label>
              <Input
                id="criterionValue"
                placeholder="Введите Значение Критерия"
                value={criterionValue}
                onChange={(e) => setCriterionValue(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="criterionValueType">Тип Значения Критерия</Label>
              <Input
                id="criterionValueType"
                placeholder="Введите Тип Значения Критерия"
                value={criterionValueType}
                onChange={(e) => setCriterionValueType(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 flex w-full items-center gap-2">
            <div className="flex w-full flex-col space-y-1.5">
              <Label htmlFor="criterionRule">Правило Критерия</Label>
              <Select
                onValueChange={(value) => setCriterionRule(value)}
                defaultValue={criterionRule}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите Правило Критерия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="=">{"="}</SelectItem>
                  <SelectItem value="<">{"<"}</SelectItem>
                  <SelectItem value="<=">{"<="}</SelectItem>
                  <SelectItem value=">">{">"}</SelectItem>
                  <SelectItem value=">=">{">="}</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
