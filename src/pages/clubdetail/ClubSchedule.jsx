import React, { useEffect, useState } from "react";
import { selectedClubScheduleDateState, schedulesState } from "../../store";
import { useRecoilState } from "recoil";
import axios from "axios";

export default function ClubSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useRecoilState(
    selectedClubScheduleDateState
  ); // [year, month, day] 리스트로 만듬
  const [schedules, setSchedule] = useRecoilState(schedulesState); // user에 맞는 정보 불러와 넣을 곳
  const [selectedStatus, setSelectedStatus] = useState(true);

  // 날짜를 클릭할 때 마다 새로운 스케줄 데이터를 불러옴.
  // 이거는 한 번 불러온거로 계속 쓸 건 지, 매번 계속 불러올 건지 선택해야한다.
  useEffect(() => {
    axios.get("/api/user/schedule").then((res) => {
      setSchedule(res.data);
    });
  }, [selectedDate]);

  // 날짜를 선택 할 때 마다 실행 되는 훅
  useEffect(() => {
    // console.log(selectedDate);
  }, [selectedDate]);

  // 달력을 구성하는 날짜 배열 생성
  const getCalendarDayts = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // month ( 0 ~ 11 범위인 것 주의!! )
    const firstDay = new Date(year, month, 1).getDay(); // 요일도 0 ~ 6 범위 주의
    const lastDay = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }

    const emptyDays = Array(firstDay).fill(null);
    const filledDays = [...emptyDays, ...days];
    const remainingDays = 42 - filledDays.length;
    const calendarDays = filledDays.concat(Array(remainingDays).fill(null));

    return calendarDays;
  };

  // 이전 달로 이동
  const goToPrevMonth = () => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(prevMonth);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(nextMonth);
  };

  return (
    <div className="w-max-md mx-auto p-4 bg-white mt-[10px] rounded-3xl">
      <div className="flex items-center justify-center mb-4 gap-[20px]">
        <span
          className="material-symbols-outlined text-midgray hover:text-darkgray cursor-pointer"
          onClick={goToPrevMonth}
        >
          chevron_left
        </span>
        <h2 className="text-h2 font-bold">
          {/* {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })} */}
          {`${currentDate.getFullYear()}.${String(
            currentDate.getMonth() + 1
          ).padStart(2, "0")}`}
        </h2>
        <span
          className="material-symbols-outlined text-midgray hover:text-darkgray cursor-pointer"
          onClick={goToNextMonth}
        >
          chevron_right
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2 min-w-[1200px]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-h7 text-midgray">
            {day}
          </div>
        ))}
        {getCalendarDayts().map((date, index) =>
          date ? (
            <div className={"relative"}>
              <div
                key={index}
                className={`text-center text-black font-bold ${
                  date
                    ? "cursor-pointer rounded-xl w-[150px] h-[150px] hover:border hover:border-main_mid hover:border-2"
                    : ""
                } rounded p-2 ${
                  currentDate.getFullYear() == selectedDate.getFullYear() &&
                  currentDate.getMonth() == selectedDate.getMonth() &&
                  date == selectedDate.getDate()
                    ? "border border-main_mid border-2"
                    : ""
                }`}
                onClick={() => {
                  setSelectedStatus(true);
                  setSelectedDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      date
                    )
                  );
                }}
              >
                {date}
              </div>
              {schedules.map((schedule, i) => {
                const startDateTime = new Date(schedule.start_datetime);
                const endDateTime = new Date(schedule.end_datetime);

                if (
                  currentDate.getFullYear() === startDateTime.getFullYear() &&
                  currentDate.getMonth() === startDateTime.getMonth() &&
                  date === startDateTime.getDate()
                ) {
                  // console.log("일정있는 날 선택");
                  return (
                    <div
                      className={`absolute top-0 left-1/2 bg-main_mid rounded-full w-[5px] h-[5px]`}
                    />
                  );
                }
              })}
            </div>
          ) : (
            <div></div>
          )
        )}
      </div>
      <div className="mt-4 text-center font-bold text-h2 text-black">
        {selectedStatus
          ? `${selectedDate.getFullYear()}년 ${
              selectedDate.getMonth() + 1
            }월 ${selectedDate.getDate()}일의 일정`
          : "None"}
      </div>
      <div className={"mt-[40px]"} />
      {/*{selectedStatus ? <SelectedDateSchedule /> : null}*/}
    </div>
  );
}
