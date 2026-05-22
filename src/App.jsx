import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { IdeaCard } from './components/IdeaCard';
import { IdeaModal } from './components/IdeaModal';
import { FolderModal } from './components/FolderModal';
import { TrashModal } from './components/TrashModal';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';
import { useIdeas } from './hooks/useIdeas';
import { AuthLayout } from './components/auth/AuthLayout';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav } from './components/BottomNav';
import { auth, googleProvider } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { 
    ideas, trashedIdeas, folders, activeFolderId, setActiveFolderId, 
    addIdea, updateIdea, deleteIdea, restoreIdea, permanentDeleteIdea, emptyTrash,
    addFolder, deleteFolder, renameFolder,
    loading: ideasLoading
  } = useIdeas(user);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [toast, setToast] = useState(null);
  const [draggedIdeaId, setDraggedIdeaId] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('idea-manager-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('idea-manager-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogin = async (credentials) => {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      showToast('Bienvenido de nuevo');
    } catch (error) {
      showToast('Error al iniciar sesión', 'error');
    }
  };

  const handleRegister = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });
      showToast('Cuenta creada correctamente. ¡Ya puedes iniciar sesión!');
      await signOut(auth);
      setAuthView('login');
    } catch (error) {
      if (error.code === 'auth/operation-not-allowed') {
        showToast('Debes habilitar "Correo electrónico/Contraseña" en tu consola de Firebase.', 'error');
      } else {
        showToast('Error al crear cuenta: ' + error.message, 'error');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Bienvenido con Google');
    } catch (error) {
      showToast('Error con Google', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('Sesión cerrada', 'info');
    } catch (error) {
      showToast('Error al cerrar sesión', 'error');
    }
  };

  const filteredIdeas = useMemo(() => {
    return ideas
      .filter(idea => !activeFolderId || idea.folderId === activeFolderId)
      .filter(idea => {
        if (filter === 'completed') return idea.completed;
        if (filter === 'pending') return !idea.completed;
        return true;
      })
      .filter(idea => {
        if (!idea) return false;
        const search = searchQuery.toLowerCase();
        return (
          (idea.title?.toLowerCase().includes(search)) ||
          (idea.description?.toLowerCase().includes(search)) ||
          (idea.tags?.some(t => t.toLowerCase().includes(search)))
        );
      });
  }, [ideas, activeFolderId, filter, searchQuery]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCreateIdea = async (data) => {
    try {
      if (editingIdea) {
        await updateIdea(editingIdea.id, data);
        showToast('Idea actualizada correctamente');
      } else {
        await addIdea(data);
        showToast('Idea creada correctamente');
      }
      setEditingIdea(null);
    } catch (error) {
      const msg = error.code === 'permission-denied'
        ? '❌ Sin permisos en Firestore. Revisa las reglas de seguridad en la consola de Firebase.'
        : `❌ Error al guardar: ${error.message}`;
      showToast(msg, 'error');
      console.error('handleCreateIdea error:', error);
    }
  };

  const handleEditIdea = (idea) => {
    setEditingIdea(idea);
    setIsModalOpen(true);
  };

  const handleDeleteIdea = async (id) => {
    try {
      await deleteIdea(id);
      showToast('Idea eliminada', 'info');
    } catch (error) {
      showToast('❌ Error al eliminar la idea', 'error');
    }
  };

  const handleOpenFolderModal = (folder = null) => {
    setEditingFolder(folder);
    setIsFolderModalOpen(true);
  };

  const handleFolderSubmit = async (name) => {
    try {
      if (editingFolder) {
        await renameFolder(editingFolder.id, name);
        showToast('Carpeta renombrada correctamente');
      } else {
        await addFolder(name);
        showToast('Carpeta creada correctamente');
      }
      setEditingFolder(null);
    } catch (error) {
      showToast('❌ Error al guardar la carpeta', 'error');
    }
  };

  const handleDeleteFolder = async (id) => {
    const hasIdeas = ideas.some(i => i.folderId === id);
    if (hasIdeas) {
      showToast('⚠️ Mueve las ideas antes de eliminar esta carpeta', 'error');
      return;
    }
    try {
      await deleteFolder(id);
      showToast('Carpeta eliminada', 'info');
    } catch (error) {
      showToast('❌ Error al eliminar la carpeta', 'error');
    }
  };

  const activeFolderName = folders.find(f => f.id === activeFolderId)?.name || 'General';

  if (authLoading) {
    return (
      <div className="h-screen bg-bg-app flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {authView === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AuthLayout 
              title="¡Hola de nuevo!" 
              subtitle="Entra para gestionar tus ideas más brillantes."
            >
              <Login 
                onLogin={handleLogin} 
                onGoogleLogin={handleGoogleLogin}
                onNavigateRegister={() => setAuthView('register')} 
              />
            </AuthLayout>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AuthLayout 
              title="Crea tu cuenta" 
              subtitle="Empieza a organizar tu futuro hoy mismo."
            >
              <Register 
                onRegister={handleRegister} 
                onGoogleLogin={handleGoogleLogin}
                onNavigateLogin={() => setAuthView('login')} 
              />
            </AuthLayout>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="flex h-screen w-full bg-bg-app text-text-main transition-colors duration-300 overflow-hidden relative z-0">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-[280px]"
            >
              <Sidebar
                folders={folders}
                activeFolderId={activeFolderId}
                onSelectFolder={(id) => { setActiveFolderId(id); setIsSidebarOpen(false); }}
                onAddFolder={() => { handleOpenFolderModal(); setIsSidebarOpen(false); }}
                onSettingsOpen={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
                onNewIdea={() => { setEditingIdea(null); setIsModalOpen(true); setIsSidebarOpen(false); }}
                onDropIdea={(ideaId, destFolderId) => {
                  updateIdea(ideaId, { folderId: destFolderId });
                  showToast('Idea movida correctamente');
                }}
                onRenameFolder={(folder) => { handleOpenFolderModal(folder); setIsSidebarOpen(false); }}
                onDeleteFolder={(id) => { handleDeleteFolder(id); setIsSidebarOpen(false); }}
                onTrashOpen={() => { setIsTrashOpen(true); setIsSidebarOpen(false); }}
                trashCount={trashedIdeas.length}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex">
        <Sidebar
          folders={folders}
          activeFolderId={activeFolderId}
          onSelectFolder={setActiveFolderId}
          onAddFolder={() => handleOpenFolderModal()}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onNewIdea={() => { setEditingIdea(null); setIsModalOpen(true); }}
          onDropIdea={(ideaId, destFolderId) => {
            updateIdea(ideaId, { folderId: destFolderId });
            showToast('Idea movida correctamente');
          }}
          onRenameFolder={handleOpenFolderModal}
          onDeleteFolder={handleDeleteFolder}
          onTrashOpen={() => setIsTrashOpen(true)}
          trashCount={trashedIdeas.length}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-20 lg:pb-0">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {ideasLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-2 opacity-80">
                <div className="w-8 h-[2px] bg-primary/30 rounded-full"></div>
                {activeFolderName}
              </div>
              <h1 className="text-4xl font-extrabold text-text-main tracking-tight">
                Mis Ideas
              </h1>
            </div>
            
            <p className="text-text-muted font-medium bg-card px-4 py-2 rounded-xl border border-border shadow-sm">
              <span className="text-primary font-bold">{filteredIdeas.length}</span> {filteredIdeas.length === 1 ? 'idea' : 'ideas'} en total
            </p>
          </header>

          <AnimatePresence mode="popLayout">
            {filteredIdeas.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    folderName={activeFolderName}
                    onToggleComplete={(id) => updateIdea(id, { completed: !idea.completed })}
                    onEdit={handleEditIdea}
                    onDelete={handleDeleteIdea}
                    onDragStart={() => setDraggedIdeaId(idea.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <EmptyState 
                type={searchQuery ? 'search' : 'ideas'} 
                onAction={() => setIsModalOpen(true)}
              />
            )}
          </AnimatePresence>
            </>
          )}
        </main>
      </div>

      <BottomNav 
        activeFolderId={activeFolderId}
        onSelectFolder={setActiveFolderId}
        onNewIdea={() => { setEditingIdea(null); setIsModalOpen(true); }}
        onSidebarToggle={() => setIsSidebarOpen(true)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onTrashOpen={() => setIsTrashOpen(true)}
        trashCount={trashedIdeas.length}
      />

      <IdeaModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingIdea(null); }}
        folders={folders}
        activeFolderId={activeFolderId}
        initialIdea={editingIdea}
        onSave={handleCreateIdea}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => { setIsFolderModalOpen(false); setEditingFolder(null); }}
        onSubmit={handleFolderSubmit}
        initialFolder={editingFolder}
      />

      <TrashModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        trashedIdeas={trashedIdeas}
        folders={folders}
        onRestore={async (id) => {
          try { await restoreIdea(id); showToast('Idea restaurada ✅'); }
          catch { showToast('❌ Error al restaurar la idea', 'error'); }
        }}
        onPermanentDelete={async (id) => {
          try { await permanentDeleteIdea(id); showToast('Idea eliminada permanentemente', 'info'); }
          catch { showToast('❌ Error al eliminar', 'error'); }
        }}
        onEmptyTrash={async () => {
          try { await emptyTrash(); showToast('Papelera vaciada', 'info'); }
          catch { showToast('❌ Error al vaciar la papelera', 'error'); }
        }}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        folders={folders}
        onRenameFolder={handleOpenFolderModal}
        onDeleteFolder={handleDeleteFolder}
        onNewFolder={() => handleOpenFolderModal()}
      />

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
