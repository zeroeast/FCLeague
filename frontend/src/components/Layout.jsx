import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',              label: '홈' },
  { to: '/league',        label: '리그' },
  { to: '/teams',         label: '팀' },
  { to: '/players',       label: '선수 검색' },
  { to: '/stats',         label: '통계' },
  { to: '/hall-of-fame',  label: '명예의 전당' },
];

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
          {/* 로고 */}
          <span className="text-base font-bold whitespace-nowrap">⚽ FC온라인 리그</span>

          {/* 네비게이션 */}
          <nav className="flex gap-6 flex-1">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm pb-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-accent border-accent'
                      : 'text-text border-transparent hover:text-accent'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* 로그인 버튼 */}
          <NavLink
            to="/login"
            className="text-sm font-semibold px-3 py-1.5 bg-green hover:bg-green-hover rounded-md transition-colors"
          >
            로그인
          </NavLink>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border text-center text-muted text-xs py-4">
        FC온라인 리그 © 2025
      </footer>
    </div>
  );
}
