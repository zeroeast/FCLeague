import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import LeagueLayout from './pages/LeagueLayout.jsx';
import LeagueSchedule from './pages/LeagueSchedule.jsx';
import LeagueStandings from './pages/LeagueStandings.jsx';
import TeamsLayout from './pages/TeamsLayout.jsx';
import TeamsMyTeam from './pages/TeamsMyTeam.jsx';
import TeamsAll from './pages/TeamsAll.jsx';
import Players from './pages/Players.jsx';
import Stats from './pages/Stats.jsx';
import HallOfFame from './pages/HallOfFame.jsx';
import Login from './pages/Login.jsx';
import Shop from './pages/Shop.jsx';
import Wallet from './pages/Wallet.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="league" element={<LeagueLayout />}>
          <Route index element={<Navigate to="schedule" replace />} />
          <Route path="schedule" element={<LeagueSchedule />} />
          <Route path="standings" element={<LeagueStandings />} />
        </Route>

        <Route path="teams" element={<TeamsLayout />}>
          <Route index element={<Navigate to="my" replace />} />
          <Route path="my" element={<TeamsMyTeam />} />
          <Route path="all" element={<TeamsAll />} />
        </Route>

        <Route path="players" element={<Players />} />
        <Route path="stats" element={<Stats />} />
        <Route path="hall-of-fame" element={<HallOfFame />} />
        <Route path="shop" element={<Shop />} />
        <Route path="wallet" element={<Wallet />} />

        {/* legacy redirects */}
        <Route path="traits" element={<Navigate to="/shop" replace />} />
        <Route path="gacha" element={<Navigate to="/shop" replace />} />
      </Route>
    </Routes>
  );
}
