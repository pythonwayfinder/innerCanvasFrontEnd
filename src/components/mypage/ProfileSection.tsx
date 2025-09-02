type User = {
    username: string;
    email: string;
    age: number | null;
    role: string;
};

type ProfileSectionProps = {
    user: User;
    onEditClick: () => void;
};

const ProfileSection = ({ user, onEditClick }: ProfileSectionProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-[#4D4F94] mb-6">{user.role}</h2>

            {/* 프로필 아이콘: 헤더 배경색과 포인트 색상을 사용 */}
            <div className="w-32 h-32 rounded-full bg-[#E8EAF6] grid place-items-center text-[#7286D3] text-5xl font-bold mb-4">
                {user.username.at(0)?.toUpperCase()}
            </div>

            <h3 className="text-2xl font-semibold text-gray-800">{user.username}</h3>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <br/>

            {/*<div className="text-sm text-gray-600 mt-4 space-y-1">*/}
            {/*    /!* 라벨 색상도 헤더의 짙은 텍스트 색으로 변경 *!/*/}
            {/*    <p><span className="font-semibold text-[#4D4F94]">나이:</span> {user.age !== null ? ` ${user.age}세` : ' -'}</p>*/}
            {/*    <p><span className="font-semibold text-[#4D4F94]">역할:</span> {user.role}</p>*/}
            {/*</div>*/}

            {/* 버튼: 헤더의 회원가입 버튼과 동일한 색상 테마로 변경 */}
            <button
                onClick={onEditClick}
                className="mt-auto w-full rounded-lg bg-[#7286D3] px-4 py-2.5 text-white hover:bg-[#5B6CA8] transition font-semibold"
            >
                프로필 수정
            </button>
        </div>
    );
};

export default ProfileSection;