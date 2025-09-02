import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import type {RootState} from '../store/store';

import recordIcon from '../assets/images/icon-record.png';
import calendarIcon from '../assets/images/icon-calendar.png';
import aiIcon from '../assets/images/icon-ai.png';

const MainPage = () => {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);

    return (
        <div className="bg-[#F8F8F8]">
            <div>
                <br/>
                <br/>
                {/*<br/>*/}
            </div>
            {/* 1. Hero Section: 메인 소개 (CSS 그라데이션 오버레이 적용) */}
            <section className="relative py-20 md:py-32 overflow-hidden">

                {/* ✨ 1. 배경 이미지 레이어 (가장 아래) - 위아래 가장자리 블러 효과 */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-artwork.jpg" // JPG 파일이라면 .jpg로 변경하세요
                        alt="배경 아트워크"
                        // 🔄 수정: 이미지 자체에는 블러를 제거하고, mask 효과를 주기 위한 스타일을 적용
                        className="w-full h-full object-cover"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5, black 95%, transparent)'
                        }}
                    />
                </div>

            {/*<section*/}
            {/*    className="relative py-20 md:py-32 bg-cover bg-center bg-no-repeat"*/}
            {/*    // 🔄 수정: 오버레이(linear-gradient) 부분을 삭제하고 배경 이미지만 남깁니다.*/}
            {/*    style={{*/}
            {/*        backgroundImage: `url('/images/hero-artwork.jpg')`*/}
            {/*    }}*/}
            {/*>*/}
                {/* ❗️ 더 이상 별도의 오버레이 div가 필요 없으므로 삭제했습니다. */}

                {/* 텍스트 컨텐츠는 z-index가 필요 없어졌지만, relative는 유지합니다. */}
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#4D4F94] to-[#7286D3] bg-clip-text text-transparent mb-4">
                        당신의 마음을 기록하고, AI와 함께 발견하세요
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-700 mb-8">
                        Inner Canvas는 사용자가 매일 자신의 감정을 간단히 기록하고,<br/> AI가 이를 가볍게 분석·정리해주는 감정 일기 서비스입니다.
                    </p>
                    <div>
                        {isAuthenticated ? (
                            <Link to="/mypage"
                                  className="bg-[#7286D3] text-white font-bold py-3 px-8 rounded-full hover:bg-[#5B6CA8] transition-all duration-300 text-lg">
                                내 기록 보러가기
                            </Link>
                        ) : (
                            <Link to="/login"
                                  className="bg-[#7286D3] text-white font-bold py-3 px-8 rounded-full hover:bg-[#5B6CA8] transition-all duration-300 text-lg">
                                지금 시작하기
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/*/!* 대표 이미지 *!/*/}
            {/*<div className="container mx-auto px-6 text-center -mt-16">*/}
            {/*    <img*/}
            {/*        src={heroImage} // 👈 주소를 import한 변수로 변경*/}
            {/*        alt="감정을 시각화한 추상적인 아트워크"*/}
            {/*        className="max-w-4xl mx-auto rounded-2xl shadow-2xl"*/}
            {/*    />*/}
            {/*</div>*/}

            {/* 2. Features Section: 핵심 기능 소개 */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800">단순하지만, 강력한 기능</h2>
                        <p className="text-slate-500 mt-2">복잡한 기능보다는 핵심에 집중합니다.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="text-center">
                            <div className="flex justify-center items-center mb-4">
                                <img
                                    src={recordIcon}
                                    alt="감정 기록 아이콘"
                                    className="h-20 w-20"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">오늘의 감정 기록</h3>
                            <p className="text-slate-500">
                                몇 번의 탭만으로 오늘의 기분과 생각을 간단하게 기록하고,<br/> 하루를 돌아볼 수 있습니다.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="text-center">
                            <div className="flex justify-center items-center mb-4">
                                <img
                                    src={calendarIcon}
                                    alt="달력 시각화 아이콘"
                                    className="h-20 w-20"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">한눈에 보는 감정 달력</h3>
                            <p className="text-slate-500">
                                기록된 감정들을 월별 달력에서 한눈에 파악하고, <br/> 내 마음의 변화를 직관적으로 확인하세요.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="text-center">
                            <div className="flex justify-center items-center mb-4">
                                <img
                                    src={aiIcon}
                                    alt="ai 피드백 아이콘"
                                    className="h-20 w-20"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI 간단 피드백</h3>
                            <p className="text-slate-500">
                                AI가 당신의 하루에 작은 위로를 건네고, <br/> 감정의 흐름을 다정하게 짚어줄 거예요.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Final CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        당신의 내면을 채울 준비가 되셨나요?
                    </h2>
                    <p className="text-slate-500 mb-8">
                        Inner Canvas와 함께 매일을 소중하게 간직하세요.
                    </p>
                    <Link to="/signup"
                          className="bg-[#6E9C7B] text-white font-bold py-3 px-8 rounded-full hover:bg-[#5A8366] transition-all duration-300 text-lg">
                        회원가입
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default MainPage;