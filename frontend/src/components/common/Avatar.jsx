export default function Avatar({ name = 'User', src = '', online = false }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
      {src ? <img src={src} alt={name} className="h-full w-full rounded-full object-cover" /> : initials || 'U'}
      {online ? <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /> : null}
    </span>
  );
}
