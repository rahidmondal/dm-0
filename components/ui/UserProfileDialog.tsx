"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Check, Loader2, AtSign } from "lucide-react";

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileDialog({ isOpen, onClose }: UserProfileDialogProps) {
  const currentUser = useQuery(api.auth.current);
  const updateUsername = useMutation(api.users.updateUsername);
  
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleEditClick = () => {
    setUsernameInput(currentUser.username);
    setIsEditing(true);
    setError("");
  };

  const handleSave = async () => {
    const newUsername = usernameInput.trim().toLowerCase();
    if (newUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    
    if (newUsername === currentUser.username) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError("");
    
    try {
      await updateUsername({ username: newUsername });
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update username.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl sm:w-96 animate-in zoom-in-95 duration-200 p-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-muted p-1 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AtSign className="h-5 w-5 text-primary" />
              Change Username
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your username is how others find you. Edit your avatar and name via the Clerk profile button.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Username
              </label>
              {!isEditing && (
                <button 
                  onClick={handleEditClick}
                  className="text-xs font-medium text-primary hover:underline"
                >
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
                    onChange={(e) => {
                       setUsernameInput(e.target.value.replace(/\s+/g, '').toLowerCase());
                       setError("");
                    }}
                    className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="username"
                    autoFocus
                  />
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              </div>
            ) : (
              <div className="text-base font-medium text-foreground">
                @{currentUser.username}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
