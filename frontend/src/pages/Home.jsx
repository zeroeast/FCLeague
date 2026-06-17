import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/league",       icon: "🏆", label: "리그 일정",   desc: "경기 일정과 결과 확인" },
  { to: "/teams",        icon: "👥", label: "팀 관리",     desc: "팀 스쿼드와 정보 관리" },
  { to: "/players",      icon: "🔍", label: "선수 검색",   desc: "강화·스탃 필터로 선수 검색" },
  { to: "/hall-of-fame", icon: "🏅", label: "명예의 전당", desc: "역대 시즉 우승자 기록" },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold">⚽ FC온라인 리그</h1>
        <p className="text-muted text-lg">친구들과 함께하는 우리만의 FC온라인 리그</p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/league" className="px-5 py-2.5 bg-accent text-bg-base font-semibold rounded-md hover:opacity-90 transition">
            리그 보기
          </Link>
          <Link to="/players" className="px-5 py-2.5 bg-bg-elevated border border-border rounded-md hover:border-accent transition">
            선수 검색
          </Link>
        </div>
      </section>

      <section className="bg-bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm mb-1">현재 시즉</p>
            <h2 className="text-xl font-bold">시즉 1 — 진행 중</h2>
          </div>
          <span className="px-3 py-1 bg-green text-white text-xs font-bold rounded-full">LIVE</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          {[["—", "참가 팀"], ["—", "완료 경기"], ["—", "남은 경기"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-muted text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">바로가기</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon, label, desc }) => (
            <Link key={to} to={to} className="bg-bg-surface border border-border rounded-xl p-5 hover:border-accent transition group">
              <span className="text-3xl">{icon}</span>
              <p className="font-semibold mt-3 group-hover:text-accent transition">{label}</p>
              <p className="text-muted text-sm mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">최근 경기</h2>
        <div className="bg-bg-surface border border-border rounded-xl p-10 text-center text-muted">
          아직 경기 결과가 없습니다.
        </div>
      </section>
    </div>
  );
}
