'use client';

import { useState } from "react";
import { Calendar } from '@/components/ui/calendar'
import { useAppStore } from "@/lib/store";
import { FullCalendarComponent } from "@/components/Calendar/FullCalendar";
import { Button } from "@/components/ui/button";
import { EventModal } from "@/components/Calendar/EventModal";
import { TaskInbox } from "@/components/Tasks/TaskInbox";

export default function HomePage() {
  const [modalType, setModalType] = useState<'event' | 'task'>('event')

  const { addEvent, tasks, events } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [prefilledTitle, setPrefilledTitle] = useState('')

  // Обработка планирования задачи
  const handleScheduleTask = (task: { id: string; title: string }) => {
    setSelectedDate(new Date())
    setPrefilledTitle(task.title)
    setIsModalOpen(true)
    setModalType('task')
    // Здесь можно удалить задачу после планирования (опционально)
  }

  const openModalFromCalendar = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
    setModalType('event')
  }

  return (

    <div className="p-4 pb-20 md:pb-4 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📅 Календарь</h1>

        {/* Две колонки на десктопе, одна на мобильном */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Календарь (2 колонки) */}
          <div className="lg:col-span-2">
            <FullCalendarComponent
              onOpenModal={(date, title) => {
                openModalFromCalendar(date)
              }}
            />
          </div>

          {/* Inbox (1 колонка) */}
          <div className="lg:col-span-1">
            <TaskInbox onScheduleTask={handleScheduleTask} />
          </div>
        </div>
      </div>

      {/* Модальное окно для создания события */}
      <EventModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type={modalType}
        onSave={(eventData) => {
          addEvent({
            ...eventData,
          })
        }}
        selectedDate={selectedDate}
      />
    </div>
  );
}