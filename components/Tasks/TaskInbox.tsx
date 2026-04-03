'use client'
import { useAppStore } from '@/lib/store'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Trash2, Edit2, Plus } from 'lucide-react'
import { TaskModal } from './TaskModal'

export function TaskInbox() {
  const { tasks, addTask, addEvent, toggleTask, deleteTask, updateTask } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<{ id: string; title: string; description?: string } | null>(null)

  const handleSaveTask = (taskData: { 
    title: string
    description?: string
    scheduledDate?: Date
  }) => {
    if (editingTask) {
      // Редактирование существующей задачи
      updateTask(editingTask.id, {
        title: taskData.title,
        description: taskData.description,
      })
    } else {
      if (taskData.scheduledDate) {
        // 📅 Если дата выбрана → создаем СОБЫТИЕ в календаре
        addEvent({
          id: crypto.randomUUID(),
          title: taskData.title,
          description: taskData.description,
          start: taskData.scheduledDate,
          end: new Date(taskData.scheduledDate.getTime() + 60 * 60 * 1000), // +1 час
          allDay: true,
        })
      } else {
        // 📥 Если даты нет → создаем ЗАДАЧУ в inbox
        addTask({
          id: crypto.randomUUID(),
          title: taskData.title,
          description: taskData.description,
          completed: false,
        })
      }
    }
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleEditTask = (task: { id: string; title: string; description?: string }) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const pendingTasks = tasks.filter((t) => !t.completed)

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            📥 Inbox
            <span className="text-sm font-normal text-gray-500">({pendingTasks.length})</span>
          </h2>
          <Button
            size="sm"
            onClick={() => {
              setEditingTask(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Добавить
          </Button>
        </div>

        {/* Список задач */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {pendingTasks.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Все задачи выполнены! 🎉</p>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 truncate">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-gray-500 truncate">{task.description}</p>
                  )}
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditTask(task)}
                    title="Редактировать"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => deleteTask(task.id)}
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveTask}
        editTask={editingTask}
      />
    </>
  )
}