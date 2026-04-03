'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: { 
    title: string
    description?: string
    scheduledDate?: Date
  }) => void
  editTask?: { id: string; title: string; description?: string } | null
}

export function TaskModal({ open, onOpenChange, onSave, editTask }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [wantToSchedule, setWantToSchedule] = useState(false)

  // Сброс или заполнение при открытии
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description || '')
    } else {
      setTitle('')
      setDescription('')
    }
    setScheduledDate(undefined)
    setWantToSchedule(false)
  }, [editTask, open])

  const handleSave = () => {
    if (!title.trim()) return
    
    onSave({ 
      title, 
      description,
      scheduledDate: wantToSchedule ? scheduledDate : undefined
    })
    handleOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTitle('')
      setDescription('')
      setScheduledDate(undefined)
      setWantToSchedule(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editTask ? 'Редактировать задачу' : 'Новая задача'}</DialogTitle>
          <DialogDescription>
            {editTask ? 'Измените детали задачи' : 'Добавьте задачу в inbox или запланируйте на дату'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Название */}
          <div className="grid gap-2">
            <Label htmlFor="task-title">Название *</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Заказать подарок"
              autoFocus
            />
          </div>

          {/* Описание */}
          <div className="grid gap-2">
            <Label htmlFor="task-description">Описание</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Детали задачи..."
              rows={3}
            />
          </div>

          {/* 📅 Опция планирования */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="wantToSchedule"
              checked={wantToSchedule}
              onCheckedChange={(checked) => setWantToSchedule(checked as boolean)}
            />
            <Label htmlFor="wantToSchedule" className="cursor-pointer font-medium">
              Запланировать на дату
            </Label>
          </div>

          {/* Выбор даты (показывается только если включена опция) */}
          {wantToSchedule && (
            <div className="grid gap-2 pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <Label>Дата выполнения</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={(date) => setScheduledDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">
                При сохранении задача будет добавлена в календарь как событие
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || (wantToSchedule && !scheduledDate)}>
            {wantToSchedule ? 'Запланировать' : 'Добавить в inbox'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}