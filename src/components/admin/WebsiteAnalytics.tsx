// 통계 카드 UI를 위한 재사용 컴포넌트
const StatCard = ({ title, value, icon }: { title: string, value: string, icon: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mr-4 text-2xl">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default function WebsiteAnalytics() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">웹사이트 분석 대시보드</h2>

            {/* 상단 통계 카드 영역 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="총 방문자 수" value="1,234" icon="👥" />
                <StatCard title="오늘의 방문자 수" value="56" icon="👤" />
                <StatCard title="AI 응답 성공률" value="99.8%" icon="✅" />
                <StatCard title="총 회원 수" value="452" icon="🧑‍🤝‍🧑" />
            </div>

            {/* 차트 및 기타 분석 영역 (UI 틀) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">일별 방문자 추이</h3>
                    <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
                        <p className="text-gray-400">[ 막대 그래프가 여기에 표시됩니다 ]</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">AI 모델 상태</h3>
                    <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
                        <p className="text-gray-400">[ 실시간 모니터링 그래프가 여기에 표시됩니다 ]</p>
                    </div>
                </div>
            </div>
        </div>
    );
}