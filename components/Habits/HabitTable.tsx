'use client'
import { useAppStore } from '@/lib/store'
import { useState } from 'react'

// Получаем дни текущей недели
function getWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = воскресенье ... 6 = суббота
    const mondayIndex = (dayOfWeek + 6) % 7; // 0 = понедельник ... 6 = воскресенье
  
    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - mondayIndex);
  
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }

// Форматируем дату в YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Названия дней недели
const dayNames = [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function HabitTable() {
  const { habits, addHabit, completeHabit, removeHabit } = useAppStore()
  const [newHabitName, setNewHabitName] = useState('')
  const weekDays = getWeekDays()
  const today = formatDate(new Date())

  const addNewHabit = () => {
    if (!newHabitName.trim()) return
    addHabit({
      id: crypto.randomUUID(),
      title: newHabitName,
      description: '',
      completions: [],
    })
    setNewHabitName('')
  }

  const getCompletionRate = (habit: typeof habits[0]) => {
    if (habit.completions.length === 0) return 0
    const weekCompletions = habit.completions.filter(date => 
      weekDays.some(day => formatDate(day) === date)
    ).length
    return Math.round((weekCompletions / 7) * 100)
  }

  return (
    <div className="p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-4">Трекер привычек</h1>
      
      {/* Добавление новой привычки */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Название привычки..."
          onKeyPress={(e) => e.key === 'Enter' && addNewHabit()}
        />
        <button
          onClick={addNewHabit}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Добавить
        </button>
      </div>

      {/* Таблица привычек */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 text-gray-600 font-medium min-w-[150px]">
                Привычка
              </th>
              {weekDays.map((day, index) => (
                <th
                  key={index}
                  className={`p-3 text-center border-b border-gray-200 min-w-[50px] ${
                    formatDate(day) === today ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="text-sm text-gray-500">{dayNames[index]}</div>
                  <div className={`text-lg font-semibold ${
                    formatDate(day) === today ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {day.getDate()}
                  </div>
                </th>
              ))}
              <th className="p-3 text-center border-b border-gray-200 text-gray-600 font-medium min-w-[80px]">
                %
              </th>
              <th className="p-3 border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  Пока нет привычек. Добавьте первую! 🔥
                </td>
              </tr>
            ) : (
              habits.map((habit) => (
                <tr key={habit.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-800">
                    {habit.title}
                  </td>
                  {weekDays.map((day) => {
                    const dateStr = formatDate(day)
                    const isCompleted = habit.completions.includes(dateStr)
                    const isToday = dateStr === today
                    
                    return (
                      <td key={dateStr} className="p-2 border-b border-gray-100 text-center">
                        <button
                          onClick={() => completeHabit(habit.id, dateStr)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-green-500 text-white shadow-md'
                              : isToday
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {isCompleted ? '✓' : ''}
                        </button>
                      </td>
                    )
                  })}
                  <td className="p-3 border-b border-gray-100 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getCompletionRate(habit) >= 80
                        ? 'bg-green-100 text-green-700'
                        : getCompletionRate(habit) >= 50
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getCompletionRate(habit)}%
                    </span>
                  </td>
                  <td className="p-3 border-b border-gray-100 text-center">
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Статистика за неделю */}
      {habits.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📊 Статистика за неделю</h3>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm">Всего привычек</span>
              <div className="text-2xl font-bold text-blue-600">{habits.length}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm">Выполнено сегодня</span>
              <div className="text-2xl font-bold text-green-600">
                {habits.filter(h => h.completions.includes(today)).length}
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm">Средний прогресс</span>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  habits.reduce((acc, h) => acc + getCompletionRate(h), 0) / habits.length
                )}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}