'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Check, Loader2, AtSign } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const currentUser = useQuery(api.auth.current);
  const updateUsername = useMutation(api.users.updateUsername);

  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AtSign className="text-primary h-5 w-5" />
            Change Username
          </DialogTitle>
          <DialogDescription>
            Your username is how others find you. Edit your avatar and name via the Clerk profile
            button.
          </DialogDescription>
        </DialogHeader>

        <div className="border-border bg-muted/30 rounded-xl border p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
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
                <Input
                  value={usernameInput}
                  onChange={e => {
                    setUsernameInput(e.target.value.replace(/\s+/g, '').toLowerCase());
                    setError('');
                  }}
                  placeholder="username"
                  autoFocus
                />
                <Button size="icon" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
              </div>
              {error && <p className="text-xs font-medium text-red-500">{error}</p>}
            </div>
          ) : (
            <div className="text-foreground text-base font-medium">@{currentUser.username}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
