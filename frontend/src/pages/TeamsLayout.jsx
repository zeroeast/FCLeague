import { Outlet } from 'react-router-dom';
import SubNav from '../components/SubNav.jsx';

const TEAM_TABS = [
  { to: '/teams/my', label: '내 팀 정보' },
  { to: '/teams/all', label: '전체 팀 정보' },
];

export default function TeamsLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">팀</h1>
        <p className="text-sm text-muted mt-1">팀 = 감독 · 1감독 1팀</p>
      </div>

      <SubNav items={TEAM_TABS} />
      <Outlet />
    </div>
  );
}
