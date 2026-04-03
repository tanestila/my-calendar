'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import { selectCalendarFeed, useAppStore } from '@/lib/store'
import { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

interface FullCalendarComponentProps {
    onOpenModal?: (date: Date, title?: string) => void
  }

export function FullCalendarComponent({onOpenModal}: FullCalendarComponentProps) {
    const [isMobile, setIsMobile] = useState(false)
    const { events, tasks } = useAppStore(
        useShallow((s) => ({ events: s.events, tasks: s.tasks })),
    )
    const calendarEvents = useMemo(
        () => selectCalendarFeed(events, tasks),
        [events, tasks],
    )
   
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])
  
    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={isMobile ? 'dayGridWeek' : 'timeGridWeek'}
                locale={ruLocale} // Русский язык
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                editable={true} // Можно перетаскивать
                selectable={true} // Можно выделять даты
                // Настройки времени
                slotMinTime="08:00:00"      // Начало дня (8 утра)
                slotMaxTime="22:00:00"      // Конец дня (10 вечера)
                slotDuration="00:30:00"     // Шаг сетки (30 минут)
                scrollTime="09:00:00"       // Прокрутка при загрузке (9 утра)
                // Настройки внешнего вида
                allDaySlot={true}           // Показывать ячейку "Весь день"
                nowIndicator={true}         // Показывать текущее время (красная линия)
                height="auto"               // Автовысота
                events={calendarEvents}
                dateClick={(info) => {
                    if(onOpenModal){
                        onOpenModal(new Date(info.dateStr))
                    } 
                    else {

                    }
                    // const title = prompt('Название события:')
                    // if (title) {
                    //     addEvent({
                    //         id: crypto.randomUUID(),
                    //         title,
                    //         start: new Date(info.dateStr),
                    //         end: new Date(info.dateStr),
                    //         description: '',
                    //         allDay: false,
                    //     })
                    // }
                }}
                eventClick={(info) => {
                    //   if (confirm('Удалить событие?')) {
                    //     removeEvent(info.event.id)
                    //   }
                }}
                // height="100%"
            />
        </div>
    )
}