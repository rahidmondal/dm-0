'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { X, Check, Loader2, AtSign } from 'lucide-react';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileDialog({ isOpen, onClose }: UserProfileDialogProps) {
  const currentUser = useQuery(api.auth.current);
  const updateUsername = useMutation(api.users.updateUsername);

  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleEditClick = () => {
    setUsernameInput(currentUser.username);
    setIsEditing(true);
    setError('');
  };

  const handleSave = async () => {
    const newUsername = usernameInput.trim().toLowerCase();
    if (newUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (newUsername === currentUser.username) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await updateUsername({ username: newUsername });
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update username.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background/80 animate-in fade-in fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm duration-200">
      <div className="border-border bg-card animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-xl duration-200 sm:w-96">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground absolute top-4 right-4 rounded-full p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
              <AtSign className="text-primary h-5 w-5" />
              Change Username
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Your username is how others find you. Edit your avatar and name via the Clerk profile button.
            </p>
          </div>

          <div className="border-border bg-muted/30 mt-2 rounded-xl border p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Current Username
              </label>
              {!isEditing && (
                <button onClick={handleEditClick} className="text-primary text-xs font-medium hover:underline">
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={e => {
                      setUsernameInput(e.target.value.replace(/\s+/g, '').toLowerCase());
                      setError('');
                    }}
                    className="border-border bg-background focus:border-primary focus:ring-primary flex-1 rounded-md border px-3 py-1.5 text-sm transition-all outline-none focus:ring-1"
                    placeholder="username"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground hover:bg-primary-hover flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                </div>
                {error && <p className="text-xs font-medium text-red-500">{error}</p>}
              </div>
            ) : (
              <div className="text-foreground text-base font-medium">@{currentUser.username}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
