
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SavedProject, ProjectBlueprint } from '../types';
import { Loader2, ArrowRight, Calendar, Box, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  userId: string;
  onSelectProject: (project: SavedProject) => void;
  onNewProject: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onSelectProject, onNewProject }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError('Could not load your projects. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;

    // Save previous state for rollback
    const prevProjects = [...projects];
    // Optimistic Update
    setProjects(prev => prev.filter(p => p.id !== id));

    try {
      console.log("Attempting to delete project:", id);
      const { error, status } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // If status is 204 or 200, it succeeded
      console.log("Delete response status:", status);
      
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
      
    } catch (err: any) {
      console.error("Error deleting project:", err);
      // Revert optimistic update
      setProjects(prevProjects);
      alert(`Failed to delete project: ${err.message || 'Unknown error'}. Please check your Supabase RLS policies.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full relative">
      
      {/* Toast Notification */}
      {deleteSuccess && (
          <div className="fixed top-20 right-6 z-50 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center animate-in slide-in-from-right fade-in">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Project deleted successfully.</span>
          </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Projects</h2>
          <p className="text-slate-500 mt-1">Manage your saved blueprints and architectures.</p>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
        >
          + Create New
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-500" />
          <p>Loading your library...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center justify-center border border-red-100">
           <AlertCircle className="w-5 h-5 mr-2" />
           {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16">
           <Box className="w-16 h-16 text-slate-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">No projects yet</h3>
           <p className="text-slate-500 mb-6 max-w-md mx-auto">Generate your first technical blueprint to see it here.</p>
           <button 
             onClick={onNewProject}
             className="text-teal-600 font-bold hover:text-teal-700 hover:underline"
           >
             Start Architecting &rarr;
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {projects.map((project) => (
             <motion.div 
               key={project.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:border-teal-200 relative"
               onClick={() => onSelectProject(project)}
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-teal-50 text-teal-700 p-2 rounded-lg">
                      <Box className="w-6 h-6" />
                   </div>
                   <button 
                     onClick={(e) => deleteProject(project.id, e)}
                     className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all z-10"
                     title="Delete Project"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
                
                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-teal-700 transition-colors line-clamp-1">
                    {project.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">
                    {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs text-slate-400">
                   <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      {new Date(project.created_at).toLocaleDateString()}
                   </div>
                   <div className="flex items-center text-teal-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      View Blueprint <ArrowRight className="w-3 h-3 ml-1" />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
