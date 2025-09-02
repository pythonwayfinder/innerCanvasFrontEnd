// 새로 만든 재사용 달력 컴포넌트를 import 합니다.
import Calendar from '../components/calendar/Calendar';

// 이 컴포넌트는 이제 "페이지"의 역할만 담당합니다.
export default function MoodCalendarPage() {
    return (
        // 페이지로서 필요한 겉모습 스타일을 여기에 정의합니다.
        <div className="max-w-3xl mx-auto p-6 bg-[#f9f9fb] rounded-xl shadow-xl min-h-screen flex flex-col">
            {/* 실제 내용은 Calendar 컴포넌트가 모두 처리합니다. */}
            <Calendar />
        </div>
    );
}