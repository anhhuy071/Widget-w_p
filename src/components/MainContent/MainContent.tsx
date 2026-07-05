import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import AddToDoForm from "../Widgets/Todo/TodoForm";
import TodoList from "../Widgets/Todo/TodoList";
import Clock from "../Widgets/Pomodoro/Clock";
import WeatherWidget from "../Widgets/Weather/Weather";
import StartupModal from "../StartupModal/StartupModal";
import useProfileStore from "../../stores/profileStore";
import useWeatherStore from "../../stores/weatherStore";
import { getGreeting } from "../../utils/greeting";


const getGreetingForNow = () => getGreeting();

const formatDate = (date: Date) =>
  date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function MainContent() {
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const [dateStr, setDateStr] = useState(formatDate(new Date()));
  const [greeting, setGreeting] = useState<string>(getGreetingForNow);
  const { name, city } = useProfileStore();
  const { weather, fetchWeatherByCity } = useWeatherStore();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString());
      setDateStr(formatDate(now));
      setGreeting(getGreetingForNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch cached weather centrally
  useEffect(() => {
    fetchWeatherByCity(city);
  }, [city, fetchWeatherByCity]);



  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
    }),
  };

  return (
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-5 auto-rows-min lg:grid-cols-12 2xl:gap-8">
        <section className="lg:col-span-12 grid grid-cols-12 gap-6 2xl:gap-8">
          <motion.article custom={0} variants={cardVariants} initial="hidden" animate="visible"
            className="col-span-12 flex min-h-36 flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-300 hover:-translate-y-1 md:col-span-4 lg:p-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-[var(--text-muted)]">
                Greeting
              </p>
              <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--text-heading)] sm:text-3xl">
                {greeting}{name ? `, ${name}` : ""}
              </h1>
            </div>
          </motion.article>

          <motion.article custom={1} variants={cardVariants} initial="hidden" animate="visible"
            className="col-span-12 flex min-h-36 flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-300 hover:-translate-y-1 md:col-span-4 lg:p-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-[var(--text-muted)]">
                Local Time
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-heading)]">
                {clock}
              </h2>
            </div>
          </motion.article>

          <motion.article custom={2} variants={cardVariants} initial="hidden" animate="visible"
            className="col-span-12 flex min-h-36 flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-300 hover:-translate-y-1 md:col-span-4 lg:p-8">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-[var(--text-muted)]">
                Ngày tháng
              </p>
              <h2 className="break-words text-xl font-semibold tracking-tight text-[var(--text-heading)] sm:text-2xl">
                {dateStr}
              </h2>
            </div>
          </motion.article>
        </section>

        <section className="lg:col-span-12 xl:col-span-6 flex flex-col gap-6 2xl:gap-8">
          <article className="flex flex-1 flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-soft)] lg:p-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-[var(--text-muted)]">
                Daily focus
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-heading)]">
                Todo List
              </h1>
            </div>
            <div className="mb-6">
              <AddToDoForm />
            </div>
            <div className="flex-1 min-h-[200px]">
              <TodoList />
            </div>
          </article>
        </section>

        <section className="lg:col-span-12 xl:col-span-6 flex flex-col gap-6 2xl:gap-8">
          <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-300 hover:-translate-y-1 lg:p-8">
            <WeatherWidget />
          </article>

          <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-300 hover:-translate-y-1 lg:p-8">
            <Clock />
          </article>
        </section>

        <div className="clipping-container">
          <StartupModal />
        </div>
      </div>
    
      
  );
}
