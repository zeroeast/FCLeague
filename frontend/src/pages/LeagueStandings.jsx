import { STANDINGS } from '../constants/leagueData.js';

const RANK_COLOR = (rank) => {
  if (rank === 1) return '#FFD700';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return null;
};

export default function LeagueStandings() {
  return (
    <div
      className="rounded-2xl border border-border overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1526, #111e38)' }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs uppercase tracking-wide border-b border-border">
            <th className="px-4 py-3 text-left w-8">#</th>
            <th className="px-4 py-3 text-left">감독 (팀)</th>
            <th className="px-3 py-3 text-center">경기</th>
            <th className="px-3 py-3 text-center">승</th>
            <th className="px-3 py-3 text-center">무</th>
            <th className="px-3 py-3 text-center">패</th>
            <th className="px-3 py-3 text-center">득점</th>
            <th className="px-3 py-3 text-center">실점</th>
            <th className="px-3 py-3 text-center">득실</th>
            <th className="px-3 py-3 text-center font-bold text-text">승점</th>
          </tr>
        </thead>
        <tbody>
          {STANDINGS.map((s) => {
            const gd = s.gf - s.ga;
            const rankColor = RANK_COLOR(s.rank);
            return (
              <tr
                key={s.rank}
                className="border-b border-border/40 hover:bg-bg-elevated/40 transition-colors"
                style={{ borderLeft: rankColor ? `3px solid ${rankColor}` : '3px solid transparent' }}
              >
                <td className="px-4 py-3 font-black text-muted">{s.rank}</td>
                <td className="px-4 py-3 font-bold" style={{ color: rankColor || '#e2eaf5' }}>{s.name}</td>
                <td className="px-3 py-3 text-center text-muted">{s.w + s.d + s.l}</td>
                <td className="px-3 py-3 text-center text-accent font-bold">{s.w}</td>
                <td className="px-3 py-3 text-center text-muted">{s.d}</td>
                <td className="px-3 py-3 text-center text-red-400">{s.l}</td>
                <td className="px-3 py-3 text-center text-muted">{s.gf}</td>
                <td className="px-3 py-3 text-center text-muted">{s.ga}</td>
                <td className="px-3 py-3 text-center text-muted">{gd > 0 ? '+' : ''}{gd}</td>
                <td className="px-3 py-3 text-center font-black text-xl text-text">{s.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
