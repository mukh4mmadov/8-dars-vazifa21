import { FC, useEffect, useState } from "react";
import leftIcon from "../assets/left-icon.svg";
import rightIcon from "../assets/right-icon.svg";

interface Event {
  date: string;
  text: string;
}

const Calendar: FC = () => {
  const [weekDays] = useState<string[]>([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentDate] = useState(new Date());
  const [dates, setDates] = useState<(null | number)[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState<string>("");

  useEffect(() => {
    const savedEvents = JSON.parse(
      localStorage.getItem("calendarEvents") || "[]"
    );
    setEvents(savedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    let dCount = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    let d = [];
    let counter = 1;
    let weekDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
    for (let i = 0; i < 42; i++) {
      if (i < weekDay || counter > dCount) {
        d.push(null);
      } else {
        d.push(counter);
        counter++;
      }
    }
    setDates(d);
  }, [currentMonth]);

  const handlePrev = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
    setSelectedDate(null);
  };

  const handleNext = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
    setSelectedDate(null);
  };

  const handleDateClick = (date: number | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddEvent = () => {
    if (selectedDate) {
      setShowModal(true);
    } else {
      alert("Iltimos, avval sanani tanlang!");
    }
  };

  const handleSaveEvent = () => {
    if (selectedDate && eventText) {
      const eventDate = `${selectedDate}-${
        currentMonth.getMonth() + 1
      }-${currentMonth.getFullYear()}`;
      const newEvent = { date: eventDate, text: eventText };
      setEvents([...events, newEvent]);
      setEventText("");
      setShowModal(false);
    }
  };

  const handleDeleteEvent = (eventDate: string, text: string) => {
    const updatedEvents = events.filter(
      (event) => !(event.date === eventDate && event.text === text)
    );
    setEvents(updatedEvents);
  };

  const handleEditEvent = (eventDate: string, text: string) => {
    setEventText(text);
    handleDeleteEvent(eventDate, text);
    setShowModal(true);
  };

  const getEventsForDate = (date: number | null) => {
    if (!date) return [];
    const eventDate = `${date}-${
      currentMonth.getMonth() + 1
    }-${currentMonth.getFullYear()}`;
    return events.filter((event) => event.date === eventDate);
  };

  return (
    <div className="mt-0">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          {currentMonth.toLocaleString("en-US", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-3">
          <span
            onClick={handlePrev}
            className="w-10 h-10 border p-3 rounded flex items-center justify-center cursor-pointer"
          >
            <img src={leftIcon} alt="Previous" />
          </span>
          <span
            onClick={handleNext}
            className="w-10 h-10 border p-3 rounded flex items-center justify-center cursor-pointer"
          >
            <img src={rightIcon} alt="Next" />
          </span>
        </div>
      </div>
      <div className="mt-5 flex justify-between flex-wrap">
        {weekDays.map((weekDay, index) => (
          <div className="font-bold text-xl text-center w-1/7" key={index}>
            <h3>{weekDay}</h3>
          </div>
        ))}
        {dates.map((date, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(date)}
            className={`font-bold text-md text-center w-1/7 min-h-20 p-2 mt-2 cursor-pointer ${
              date ? "border" : ""
            } ${
              date === selectedDate
                ? "border-blue-500 bg-blue-100"
                : currentDate.getFullYear() === currentMonth.getFullYear() &&
                  currentDate.getMonth() === currentMonth.getMonth() &&
                  currentDate.getDate() === date
                ? "bg-red-400"
                : ""
            }`}
          >
            <p>{date}</p>
            {getEventsForDate(date).map((event, i) => (
              <div
                key={i}
                className="mt-2 p-2 bg-yellow-100 border border-yellow-500 rounded relative"
              >
                <p>{event.text}</p>
                <div className="flex justify-between mt-2">
                  <button
                    className="text-sm text-blue-500 underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event.date, event.text);
                    }}
                  >
                    Tahrir
                  </button>
                  <button
                    className="text-sm text-red-500 underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.date, event.text);
                    }}
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleAddEvent}
        className="mt-5 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Zametka qo'shish
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Zametka qo'shish/tahrir</h3>
            <textarea
              className="w-full border p-2 rounded"
              rows={3}
              placeholder="Zametkani yozing..."
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400"
              >
                bekor qilish
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
