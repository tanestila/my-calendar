'use client';

import { HabitTable } from "@/components/Habits/HabitTable";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

export default function HabitsPage() {

    return (
    <HabitTable />
    );
}