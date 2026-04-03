'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Event } from '@/lib/store'

interface EventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: Event) => void
  selectedDate?: Date
  type?: 'event' | 'task'
  prefilledTitle?: string
}

export function EventModal({ open, onOpenChange, onSave, selectedDate, type = 'event', prefilledTitle }: EventModalProps) {
  const [title, setTitle] = useState(prefilledTitle || '')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date>(selectedDate || new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [allDay, setAllDay] = useState(false)

  // Сброс формы при открытии
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTitle('')
      setDescription('')
      setStartDate(selectedDate || new Date())
      setEndDate(undefined)
      setStartTime('09:00')
      setEndTime('10:00')
      setAllDay(false)
    }
    onOpenChange(newOpen)
  }

  const handleSave = () => {
    if (!title.trim()) return

    // Объединяем дату и время
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const start = new Date(startDate)
    start.setHours(startHours, startMinutes)

    let end: Date | undefined
    if (endDate) {
      const [endHours, endMinutes] = endTime.split(':').map(Number)
      end = new Date(endDate)
      end.setHours(endHours, endMinutes)
    } else {
      // Если конец не указан, ставим +1 час
      end = new Date(start)
      end.setHours(start.getHours() + 1)
    }

    onSave({ title, start, end, description, allDay: false, id: crypto.randomUUID() })
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новое событие</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Название */}
          <div className="grid gap-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Встреча с клиентом"
              autoFocus
            />
          </div>

          {/* Дата начала */}
          <div className="grid gap-2">
            <Label>Дата начала</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP', { locale: ru }) : 'Выберите дату'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Время начала */}
          <div className="grid gap-2">
            <Label htmlFor="startTime">{type === 'event' ? 'Время начала' : 'Дата задачи'}</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* Дата окончания (опционально) */}
          {type === 'event' && (
            <div className="grid gap-2">
              <Label>Дата окончания (необязательно)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP', { locale: ru }) : 'Не указано'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          {/* Время окончания */}
          {type === 'event' && (
            <div className="grid gap-2">
              <Label htmlFor="endTime">Время окончания</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          )}

          {/* Описание */}
          <div className="grid gap-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Детали события..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}