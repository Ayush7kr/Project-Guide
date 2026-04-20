import React, { useState, useEffect } from 'react';
import { UserInput, ProjectBlueprint, SavedProject } from './types';
import { generateBlueprint } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultsPage from './components/ResultsPage';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import { supabase } from './lib/supabaseClient';
import { Wrench, User, LogOut, LayoutDashboard, Sun, Moon, Settings } from 'lucide-react';

type ViewState = 'landing' | 'loading' | 'results' | 'dashboard';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toolwise-theme');
      return (saved as Theme) || 'light';
    }
    return 'light';
  });

  // Handle Theme Side Effects
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('toolwise-theme', theme);
    console.log('Theme switched to:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Check active session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn("Supabase auth error:", error.message);
      }
      setSession(session);
    }).catch(err => {
      console.error("Supabase connection failed:", err);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFormSubmit = async (data: UserInput) => {
    setView('loading');
    setCurrentProjectId(null); // Reset ID for new project
    try {
      const result = await generateBlueprint(data);
      setBlueprint(result);
      setView('results');
    } catch (error) {
      console.error(error);
      alert("Failed to generate blueprint. Please check your connection and try again.");
      setView('landing');
    }
  };

  const handleReset = () => {
    setBlueprint(null);
    setCurrentProjectId(null);
    setView('landing');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
    setCurrentProjectId(null);
  };

  const openProjectFromDashboard = (project: SavedProject) => {
    setBlueprint(project.blueprint_data);
    setCurrentProjectId(project.id);
    setView('results');
  };

  const handleProfileUpdate = () => {
    // Refresh session to get new avatar URL
    supabase.auth.refreshSession().then(({ data: { session } }) => {
      setSession(session);
    });
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Navigation Bar */}
      <nav className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
         <div 
           className="flex items-center space-x-2 font-bold text-xl text-slate-800 dark:text-white cursor-pointer"
           onClick={() => setView('landing')}
         >
           <div className="bg-teal-600 text-white p-1.5 rounded-lg">
             <Wrench className="w-5 h-5" />
           </div>
           <span>ToolWise</span>
         </div>
         
         <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {session ? (
              <>
                 <button 
                    onClick={() => setView(view === 'dashboard' ? 'landing' : 'dashboard')}
                    className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                 >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">{view === 'dashboard' ? 'New Project' : 'Dashboard'}</span>
                 </button>
                 
                 {/* User Profile Dropdown/Avatar */}
                 <button 
                    onClick={() => setIsProfileOpen(true)}
                    className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-600 overflow-hidden hover:border-teal-400 transition-colors"
                    title="Profile Settings"
                 >
                    {session.user.user_metadata?.avatar_url ? (
                        <img src={session.user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-xs">
                             {session.user.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                 </button>

                 <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Sign Out"
                 >
                    <LogOut className="w-4 h-4" />
                 </button>
              </>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}
         </div>
      </nav>

      {/* Main Content Area */}
      {view === 'landing' && (
        <div className="flex-grow flex flex-col items-center justify-center px-4 pb-20 pt-10">
             <div className="text-center max-w-3xl mx-auto mb-10">
               <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                 Build smarter with the <span className="text-teal-600 dark:text-teal-400">perfect stack</span>.
               </h1>
               <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                 Stop guessing which tools to use. Tell us your project idea, and our AI Architect will generate a tailored technology blueprint in seconds.
               </p>
             </div>

             <InputForm onSubmit={handleFormSubmit} isLoading={false} />

             {/* Social Proof */}
             <div className="mt-16 flex items-center space-x-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-bold text-slate-400 dark:text-slate-600">Google Gemini</span>
                <span className="font-bold text-slate-400 dark:text-slate-600">React</span>
                <span className="font-bold text-slate-400 dark:text-slate-600">Tailwind</span>
                <span className="font-bold text-slate-400 dark:text-slate-600">Supabase</span>
             </div>
        </div>
      )}

      {view === 'loading' && (
        <div className="min-h-[70vh] flex items-center justify-center">
          <LoadingScreen />
        </div>
      )}

      {view === 'dashboard' && session && (
        <Dashboard 
          userId={session.user.id} 
          onSelectProject={openProjectFromDashboard}
          onNewProject={() => setView('landing')}
        />
      )}

      {view === 'results' && blueprint && (
        <ResultsPage 
          blueprint={blueprint} 
          onReset={handleReset} 
          session={session}
          onAuthRequest={() => setIsAuthOpen(true)}
          projectId={currentProjectId}
          onBlueprintUpdate={setBlueprint}
        />
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={() => setIsAuthOpen(false)} 
      />

      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        session={session}
        onUpdate={handleProfileUpdate}
      />

    </div>
  );
};

export default App;