import { useMemo } from 'react';
import SidebarItem from './SidebarItem';
import SidebarNav from './SidebarNav';
import SidebarUser from './SidebarUser';
import { getRelativeDateLabel } from './SidebarUtils';

export default function Sidebar({ 
  showSidebar, toggleSidebar, darkMode, t = {}, chats = [], 
  activeChatId, onNewChat, onSelectChat, onDeleteChat, 
  onRenameStart, onPinChat, onToggleSettings, username 
}) {
  const currentLang = localStorage.getItem('language') || 'tr';
  
  const safeChats = Array.isArray(chats) ? chats : [];
  const pinnedChats = safeChats.filter(c => c.pinned);
  const otherChats = safeChats.filter(c => !c.pinned);

  // Sohbetleri tarihe göre gruplandırma
  const groupedChats = useMemo(() => {
    return otherChats.reduce((groups, chat) => {
      const label = getRelativeDateLabel(chat.date, currentLang);
      (groups[label] ??= []).push(chat);
      return groups;
    }, {});
  }, [otherChats, currentLang]);

  // Dil çeviri haritası
  const textMap = {
    newChat: t?.newChat || "Yeni Sohbet",
    chats: t?.chats || "Sohbetler",
    projects: t?.projects || "Projeler",
    artifacts: t?.artifacts || "Artifacts",
    pinned: t?.pinned || "Sabitlenenler",
    recents: t?.recents || "Geçmiş",
    noRecents: t?.noRecentChats || "Geçmiş sohbet yok",
    freePlan: t?.freePlan || "Ücretsiz Plan",
    confirmDelete: t?.confirmDelete || "Emin misin?",
    unpin: t?.unpin || "Sabitlemeyi Kaldır",
    pin: t?.pin || "Sabitle",
    rename: t?.rename || "Yeniden Adlandır",
    delete: t?.delete || "Sil"
  };

  const itemProps = {
    activeChatId,
    onSelect: onSelectChat,
    onDelete: onDeleteChat,
    onRenameStart,
    onPin: onPinChat,
    textMap,
    darkMode
  };

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-60 flex flex-col border-r transition-all duration-300 ease-out font-sans backdrop-blur-xl
        ${darkMode ? 'bg-[#0a0a0b] border-white/5' : 'bg-white border-zinc-200'}
        ${showSidebar ? 'translate-x-0 w-[300px]' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-none'}
        overflow-hidden
      `}>
        <div className="w-[300px] h-full flex flex-col">
          
          <SidebarNav 
            darkMode={darkMode} 
            toggleSidebar={toggleSidebar} 
            onNewChat={onNewChat} 
            textMap={textMap} 
          />

          {/* Sohbet Listesi Bölümü */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin space-y-4">
            
            {/* Sabitlenmiş Sohbetler */}
            {pinnedChats.length > 0 && (
              <div className="mb-6">
                <h3 className={`px-3 mb-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {textMap.pinned}
                </h3>
                <div className="space-y-1.5">
                  {pinnedChats.map(chat => (
                    <SidebarItem key={chat.id} chat={chat} active={activeChatId === chat.id} {...itemProps} />
                  ))}
                </div>
              </div>
            )}

            {/* Son Sohbetler  */}
            <h3 className={`text-sm font-semibold tracking-wide px-3 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {textMap.recents}
            </h3>
            
            {safeChats.length === 0 ? (
              <div className="py-6 text-center text-sm opacity-60 italic">{textMap.noRecents}</div>
            ) : (
              Object.keys(groupedChats).map(groupLabel => (
                <div key={groupLabel} className="space-y-2">
                  <div className="text-xs font-medium text-zinc-500 px-3 uppercase tracking-wider mt-4">
                    {groupLabel}
                  </div>
                  <div className="space-y-1.5">
                    {groupedChats[groupLabel].map(chat => (
                      <SidebarItem key={chat.id} chat={chat} active={activeChatId === chat.id} {...itemProps} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <SidebarUser 
            darkMode={darkMode} 
            username={username} 
            onToggleSettings={onToggleSettings} 
            textMap={textMap} 
          />

        </div>
      </aside>

  
      {showSidebar && <div className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-md cursor-pointer" onClick={toggleSidebar} />}
    </>
  );
}