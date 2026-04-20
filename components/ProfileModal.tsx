import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Camera, Loader2, Save, User, CheckCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  onUpdate: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, session, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  // State for previewing the image before upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize preview with current avatar when modal opens
  useEffect(() => {
    if (isOpen && session?.user?.user_metadata?.avatar_url) {
      setPreviewUrl(session.user.user_metadata.avatar_url);
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a local URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let finalAvatarUrl = previewUrl;

      // 1. If a new file was selected, upload it to Supabase
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        // Path format: userId/avatar.ext (using upsert to overwrite)
        const filePath = `${session.user.id}/avatar.${fileExt}`;

        console.log('Uploading file to path:', filePath);

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { 
             upsert: true,
             cacheControl: '3600'
          });

        if (uploadError) {
            console.error('Upload failed:', uploadError);
            throw uploadError;
        }
        console.log('Upload result:', uploadData);

        // Get public URL
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        
        // Append timestamp to force UI refresh (bust cache)
        finalAvatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
        console.log('Generated Public URL:', finalAvatarUrl);
      }

      // 2. Update User Metadata
      console.log('Updating user metadata with:', finalAvatarUrl);
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: finalAvatarUrl }
      });

      if (updateError) throw updateError;
      
      setSuccessMsg("Profile updated successfully!");
      onUpdate(); // Refresh app state
      
      // Close after a brief success message
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Full save error:', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center">
            {successMsg ? (
                <div className="flex flex-col items-center py-10 animate-in fade-in">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{successMsg}</h4>
                </div>
            ) : (
                <>
                    <div className="relative group mb-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-600 shadow-lg relative">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 border-2 border-white dark:border-slate-800">
                            <Camera className="w-4 h-4" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileSelect} 
                                className="hidden" 
                            />
                        </label>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{session.user.email}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {selectedFile ? 'New image selected. Save to apply.' : 'Upload a photo to personalize your dashboard.'}
                        </p>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;