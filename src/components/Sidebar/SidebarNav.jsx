import { Plus, MessageSquare, Grid, Code, PanelLeft, Eye } from 'lucide-react';

const NavItem = ({ icon: Icon, text, active, darkMode }) => (
  <button className={`
    w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer
    ${active 
      ? darkMode ? 'bg-white/10 text-white' : 'bg-zinc-100 text-black'
      : darkMode ? 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-50'
    }
  `}>
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </button>
);

export default function SidebarNav({ darkMode, toggleSidebar, onNewChat, textMap }) {
  const staticLinks = [
    { icon: MessageSquare, text: textMap.chats, active: true },
    { icon: Grid, text: textMap.projects, active: false },
    { icon: Code, text: textMap.artifacts, active: false },
  ];

  return (
    <>
      {/* Logo ve Kapat Butonu */}
      <div className="px-4 pt-6 pb-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer select-none">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden opacity-90 text-orange-400 rounded-xl">
            <Eye className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <span className={`font-serif text-xl tracking-tight font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            MyAI
          </span>
        </div>
        <button onClick={toggleSidebar} className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'}`}>
          <PanelLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Yeni Sohbet Butonu */}
      <div className="px-4 mt-4 mb-4">
        <button onClick={onNewChat} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${darkMode ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
          <div className="bg-white/20 p-1 rounded-full shrink-0">
            <Plus className="w-4 h-4 stroke-2" />
          </div>
          <span className="text-sm font-semibold">{textMap.newChat}</span>
        </button>
      </div>

      {/* Ana Navigasyon */}
      <div className="px-4 py-2 mb-4">
        {staticLinks.map((link, idx) => (
          <NavItem key={idx} icon={link.icon} text={link.text} active={link.active} darkMode={darkMode} />
        ))}
      </div>
    </>
  );
}