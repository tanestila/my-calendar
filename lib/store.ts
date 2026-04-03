import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";
import { create } from "zustand";

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  completions: string[];
}

export interface Task {
  id: string
  title: string
  date?: string;
  description?: string
  completed: boolean
  createdAt: Date
}

interface AppState {
  events: Event[];
  habits: Habit[];
  tasks: Task[]
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (event: Event) => void;

  addHabit: (habit: Habit) => void;
  removeHabit: (id: string) => void;
  updateHabit: (habit: Habit) => void;
  completeHabit: (id: string, date: string) => void;

  addTask: (task: Omit<Task, 'createdAt'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, task: Partial<Task>) => void
}

export const useAppStore = create<AppState>((set) => ({
  events: [],
  habits: [],
  tasks: [],

  addEvent: (event: Event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (id: string) => set((state) => ({ events: state.events.filter((event) => event.id !== id) })),
  updateEvent: (event: Event) => set((state) => ({ events: state.events.map((e) => e.id === event.id ? event : e) })),

  addHabit: (habit: Habit) => set((state) => ({ habits: [...state.habits, habit] })),
  removeHabit: (id: string) => set((state) => ({ habits: state.habits.filter((habit) => habit.id !== id) })),
  updateHabit: (habit: Habit) => set((state) => ({ habits: state.habits.map((h) => h.id === habit.id ? habit : h) })),
  completeHabit: (id: string, date: string) => set((state) => {
    const habit = state.habits.find((h) => h.id === id)
    if (!habit) return { habits: state.habits }

    const newCompletions = habit.completions.includes(date) ? habit.completions.filter((d) => d !== date) : [...habit.completions, date]
    const newHabit = { ...habit, completions: newCompletions }

    return { habits: state.habits.map((h) => h.id === id ? newHabit : h) }

  }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, createdAt: new Date() }],
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  updateTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...task } : t
      ),
    })),
}));

/** Задачи с непустой датой (строка даты ISO или YYYY-MM-DD). */
function taskHasDate(t: Task): boolean {
  return Boolean(t.date?.trim());
}

export type CalendarFeedItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
  extendedProps: { kind: "event" } | { kind: "task"; taskId: string };
};

/** События + задачи с датой в одном списке для FullCalendar. */
export function selectCalendarFeed(events: Event[], tasks: Task[]): CalendarFeedItem[] {
  const fromEvents: CalendarFeedItem[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    allDay: e.allDay,
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
    extendedProps: { kind: "event" as const },

  }));

  const fromTasks: CalendarFeedItem[] = tasks.filter(taskHasDate).flatMap((t) => {
    const parsed = parseISO(t.date.trim());
    if (!isValid(parsed)) return [];
    const start = startOfDay(parsed);
    const end = endOfDay(parsed);
    const item: CalendarFeedItem = {
      id: `task:${t.id}`,
      title: t.title,
      start,
      end,
      allDay: true,
      backgroundColor: t.completed ? "#9ca3af" : "#10b981",
      borderColor: t.completed ? "#9ca3af" : "#10b981",
      extendedProps: { kind: "task", taskId: t.id },
    };
    return [item];
  });

  return [...fromEvents, ...fromTasks];
}