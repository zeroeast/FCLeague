import { Outlet } from 'react-router-dom';
import SubNav from '../components/SubNav.jsx';

const LEAGUE_TABS = [
  { to: '/league/schedule', label: '경기 일정' },
  { to: '/league/standings', label: '순위표' },
];

export default function LeagueLayout() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">리그</h1>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
          시즌 1 진행 중
        </span>
      </div>

      <SubNav items={LEAGUE_TABS} />
      <Outlet />
    </div>
  );
}
