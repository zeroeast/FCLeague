import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',              label: '홈' },
  { to: '/league',        label: '리그' },
  { to: '/traits',        label: '특성 투자' },
  { to: '/teams',         label: '팀' },
  { to: '/players',       label: '선수 검색' },
  { to: '/stats',         label: '통계' },
  { to: '/hall-of-fame',  label: '명예의 전당' },
  { to: '/gacha',         label: '선수 뽑기' },
];

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-bg-surface/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
          <span className="text-base font-black tracking-tight">
            <span className="text-gradient-green">FC</span>
            <span className="text-text"> 온라인 리그</span>
          </span>

          <nav className="flex gap-1 flex-1">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm px-3 py-1.5 rounded-md font-medium transition-all ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-muted hover:text-text hover:bg-bg-elevated'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/login"
            className="text-sm font-bold px-4 py-1.5 bg-accent text-bg-base rounded-md hover:shadow-green-sm transition-all"
          >
            로그인
          </NavLink>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border text-center text-muted text-xs py-5">
        <span className="text-gradient-green font-bold">FC온라인 리그</span>
        <span className="ml-2">2025 우리들만의 리그</span>
      </footer>
    </div>
  );
}
