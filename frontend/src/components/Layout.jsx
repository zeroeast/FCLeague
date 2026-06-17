import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',              label: '홈' },
  { to: '/league',        label: '리그' },
  { to: '/teams',         label: '팀' },
  { to: '/players',       label: '선수 검색' },
  { to: '/stats',         label: '통계' },
  { to: '/hall-of-fame',  label: '명예의 전당' },
  { to: '/gacha',         label: '선수 뽑기' },
];

export default function Layout() {
  return (
    <div className="portal-app-shell flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 portal-header">
        <div className="portal-topline">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="text-sm font-medium text-[#1f2c45]">☰ 메뉴</span>
            <span className="portal-wordmark">GAME PORTAL</span>
            <NavLink
              to="/login"
              className="h-8 min-w-[82px] rounded-full border-2 border-[#07172d] bg-white text-[#07172d] text-xs font-extrabold inline-flex items-center justify-center"
            >
              로그인
            </NavLink>
          </div>
        </div>

        <div className="portal-mainline">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-6">
            <span className="text-lg font-black tracking-tight text-[#0b1b33]">FC ONLINE LEAGUE</span>
            <nav className="portal-nav-grid flex-1">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `portal-nav-link ${isActive ? 'is-active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <span className="portal-start-chip">게임시작</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <Outlet />
      </main>

      <footer className="portal-footer border-t text-xs py-5 text-center">
        <span className="font-black">FC온라인 리그</span>
        <span className="ml-2">2025 우리들만의 리그</span>
      </footer>
    </div>
  );
}
