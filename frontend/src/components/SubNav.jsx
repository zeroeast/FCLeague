import { NavLink } from 'react-router-dom';

export default function SubNav({ items }) {
  return (
    <div className="flex gap-2 border-b border-border pb-0">
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-5 py-2.5 text-sm font-bold transition-all rounded-t-lg ${
              isActive ? 'text-accent' : 'text-muted hover:text-text'
            }`
          }
          style={({ isActive }) => ({
            background: isActive ? '#0d1526' : 'transparent',
            borderBottom: isActive ? '2px solid #00d97e' : '2px solid transparent',
          })}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
