import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import League from './pages/League.jsx';
import TraitsInvestment from './pages/TraitsInvestment.jsx';
import Teams from './pages/Teams.jsx';
import Players from './pages/Players.jsx';
import Stats from './pages/Stats.jsx';
import HallOfFame from './pages/HallOfFame.jsx';
import Login from './pages/Login.jsx';
import Gacha from './pages/Gacha.jsx';
import Shop from './pages/Shop.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="league" element={<League />} />
        <Route path="traits" element={<TraitsInvestment />} />
        <Route path="teams" element={<Teams />} />
        <Route path="players" element={<Players />} />
        <Route path="stats" element={<Stats />} />
        <Route path="hall-of-fame" element={<HallOfFame />} />
        <Route path="shop" element={<Shop />} />
        <Route path="gacha" element={<Gacha />} />
      </Route>
    </Routes>
  );
}
