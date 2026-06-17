import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/league",       icon: "🏆", label: "리그 일정",   desc: "경기 일정과 결과 확인",   color: "from-yellow-500/10" },
  { to: "/teams",        icon: "👥", label: "팀 관리",     desc: "팀 스쿼드와 정보 관리",   color: "from-blue-500/10" },
  { to: "/players",      icon: "🔍", label: "선수 검색",   desc: "강화·스탯 필터로 선수 검색", color: "from-accent/10" },
  { to: "/hall-of-fame", icon: "🏅", label: "명예의 전당", desc: "역대 시즌 우승자 기록",   color: "from-purple/10" },
];

export default function Home() {
  return (
    <div className="space-y-10">

      {/* 히어로 */}
      <section className="relative rounded-2xl overflow-hidden py-20 px-8 text-center"
        style={{ background: "linear-gradient(135deg, #080c16 0%, #0a1628 40%, #0d2010 100%)" }}>
        {/* 글로우 오브 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(0,217,126,0.12) 0%, transparent 65%)" }} />

        <div className="relative space-y-5">
          <div className="inline-block px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-bold tracking-widest uppercase mb-2">
            Season 1 · Live
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            <span className="text-gradient-green">FC온라인</span>{" "}
            <span className="text-text">리그</span>
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto">
            친구들과 함께하는 우리만의 FC온라인 리그
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/league"
              className="px-6 py-2.5 bg-accent text-bg-base font-bold rounded-lg hover:shadow-green-md transition-all hover:-translate-y-0.5"
            >
              리그 보기
            </Link>
            <Link
              to="/players"
              className="px-6 py-2.5 bg-bg-elevated border border-border text-text font-semibold rounded-lg hover:border-accent hover:text-accent transition-all"
            >
              선수 검색
            </Link>
          </div>
        </div>
      </section>

      {/* 시즌 현황 */}
      <section className="bg-bg-surface border border-border rounded-2xl p-6"
        style={{ background: "linear-gradient(135deg, #0d1526, #111e38)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted text-xs uppercase tracking-widest mb-1">현재 시즌</p>
            <h2 className="text-xl font-bold">시즌 1</h2>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
            LIVE
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[["—", "참가 팀"], ["—", "완료 경기"], ["—", "남은 경기"]].map(([val, label]) => (
            <div key={label} className="bg-bg-elevated rounded-xl py-4">
              <p className="text-3xl font-black text-gradient-green">{val}</p>
              <p className="text-muted text-xs mt-2 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 바로가기 */}
      <section>
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">바로가기</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="card-hover bg-bg-surface rounded-2xl p-5 group"
              style={{ background: "linear-gradient(135deg, #0d1526, #111e38)" }}
            >
              <span className="text-3xl">{icon}</span>
              <p className="font-bold mt-4 text-sm group-hover:text-accent transition-colors">{label}</p>
              <p className="text-muted text-xs mt-1 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 최근 경기 */}
      <section>
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">최근 경기</h2>
        <div className="bg-bg-surface border border-border rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">⚽</p>
          <p className="text-muted text-sm">아직 경기 결과가 없습니다.</p>
        </div>
      </section>

    </div>
  );
}
