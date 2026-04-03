'use client'

import { EventModal } from "@/components/Calendar/EventModal";
import { Calendar } from "@/components/ui/calendar"
import { Event, useAppStore } from "@/lib/store";
import { useState } from "react";

export default function EventsPage() {
  const [date, setDate] = useState(new Date());
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const { events, addEvent } = useAppStore();

  const addNewTask = (event: Event) => {
    addEvent(event)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Календарь</h1>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(d) => d && setDate(d)}
        className="rounded-md border"
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">
          События на {date.toLocaleDateString()}
        </h2>
        <EventModal onOpenChange={setIsOpenAddModal} onSave={addNewTask} open={isOpenAddModal} />
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => setIsOpenAddModal(true)}>Добавить задачу</button>
        {events.length === 0 ? (
          <p className="text-gray-500">Нет событий</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {events.map((event) => (
              <li
                key={event.id}
                className="p-3 bg-blue-50 rounded-lg"
              >
                {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}