'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Camera, Loader2, UserPlus, LogOut, Shield } from 'lucide-react';
import Image from 'next/image';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from './ConfirmDialog';

export function GroupSettingsModal({
  conversationId,
  groupName,
  avatarUrl,
  memberCount,
  groupMembers,
  adminId,
  onClose,
  isOpen,
}: {
  conversationId: Id<'conversations'>;
  groupName: string;
  avatarUrl?: string;
  memberCount: number;
  groupMembers: { _id?: Id<'users'>; name?: string; avatarUrl?: string }[];
  adminId?: Id<'users'>;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Id<'users'>[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const router = useRouter();

  const currentUser = useQuery(api.auth.current);
  const allUsers = useQuery(api.users.getUsers);

  const deleteGroup = useMutation(api.conversations.deleteGroup);
  const leaveGroup = useMutation(api.conversations.leaveGroup);
  const addMembers = useMutation(api.conversations.addMembers);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const updateGroupAvatar = useMutation(api.conversations.updateGroupAvatar);

  const isAdmin = currentUser?._id === adminId;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteGroup({ conversationId });
      setShowDeleteConfirm(false);
      onClose();
      router.push('/chat');
    } catch (error) {
      console.error('Failed to delete group:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLeaving(true);
      await leaveGroup({ conversationId });
      setShowLeaveConfirm(false);
      onClose();
      router.push('/chat');
    } catch (error) {
      console.error('Failed to leave group:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;
    try {
      setIsAdding(true);
      await addMembers({ conversationId, memberIds: selectedUsers });
      setSelectedUsers([]);
      setIsAddingMode(false);
    } catch (error) {
      console.error('Failed to add members:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Max size is 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await updateGroupAvatar({ conversationId, storageId });
    } catch (error) {
      console.error('Failed to upload avatar', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const memberIdSet = new Set(groupMembers?.map(m => m._id));
  const availableUsers = allUsers?.page?.filter(u => !memberIdSet.has(u._id)) || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-md">
          <DialogHeader className="shrink-0">
            <DialogTitle>Group Settings</DialogTitle>
            <DialogDescription>Manage group profile and participants.</DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-1 py-4">
            {/* Avatar */}
            <div className="group bg-muted border-border relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 shadow-sm">
              {isUploading ? (
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              ) : avatarUrl ? (
                <Image src={avatarUrl} alt={groupName} fill className="object-cover" />
              ) : (
                <div className="text-primary/50 text-3xl font-semibold">{groupName.charAt(0).toUpperCase()}</div>
              )}
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="mb-1 h-6 w-6 text-white" />
                <span className="text-[10px] font-medium text-white">Change Photo</span>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="border-border w-full border-b pb-4 text-center">
              <h3 className="text-foreground text-lg font-semibold">{groupName}</h3>
              <p className="text-muted-foreground text-sm">{memberCount} participants</p>
            </div>

            {/* Members Section */}
            <div className="flex min-h-0 w-full flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-foreground text-sm font-semibold">Participants</h4>
                {!isAddingMode && (
                  <button
                    onClick={() => setIsAddingMode(true)}
                    className="text-primary hover:text-primary-hover flex items-center gap-1 text-xs font-medium transition-colors"
                  >
                    <UserPlus className="h-3 w-3" />
                    Add Member
                  </button>
                )}
              </div>

              {isAddingMode && (
                <div className="bg-muted/30 border-border flex flex-col gap-2 rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-semibold">Select users to add:</span>
                    <button
                      onClick={() => {
                        setIsAddingMode(false);
                        setSelectedUsers([]);
                      }}
                      className="text-muted-foreground hover:text-foreground text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                  {availableUsers.length === 0 ? (
                    <p className="text-muted-foreground py-3 text-center text-xs">
                      All platform users are already in this group.
                    </p>
                  ) : (
                    <div className="flex max-h-32 flex-col gap-1 overflow-y-auto pr-1">
                      {availableUsers.map(user => {
                        const isSelected = selectedUsers.includes(user._id);
                        return (
                          <button
                            key={user._id}
                            onClick={() => {
                              setSelectedUsers(prev =>
                                isSelected ? prev.filter(id => id !== user._id) : [...prev, user._id],
                              );
                            }}
                            className={`flex items-center gap-2 rounded-md p-2 transition-colors ${isSelected ? 'bg-primary/20' : 'hover:bg-muted'}`}
                          >
                            <div className="bg-muted relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                              {user.avatarUrl ? (
                                <Image src={user.avatarUrl} alt={user.name || 'User'} fill className="object-cover" />
                              ) : (
                                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-[10px] font-semibold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="flex-1 truncate text-left text-sm">{user.name}</span>
                            {isSelected && <div className="bg-primary h-2 w-2 rounded-full" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {selectedUsers.length > 0 && (
                    <Button size="sm" onClick={handleAddMembers} disabled={isAdding} className="mt-2 w-full gap-2">
                      {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add to Group'}
                    </Button>
                  )}
                </div>
              )}

              <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                {groupMembers?.map(member => (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="bg-muted relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      {member.avatarUrl ? (
                        <Image src={member.avatarUrl} alt={member.name || 'Member'} fill className="object-cover" />
                      ) : (
                        <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-xs font-semibold">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col truncate">
                      <span className="text-foreground flex items-center gap-1.5 truncate text-sm font-medium">
                        {member.name}
                        {member._id === currentUser?._id && (
                          <span className="text-muted-foreground text-xs">(You)</span>
                        )}
                        {member._id === adminId && <Shield className="text-primary h-3 w-3 shrink-0" />}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-border mt-2 flex shrink-0 gap-2 border-t pt-4">
            {!isAdmin && (
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 flex flex-1 justify-center gap-2"
                onClick={() => setShowLeaveConfirm(true)}
                disabled={isLeaving || isDeleting}
              >
                <LogOut className="h-4 w-4" />
                Leave Group
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="destructive"
                className="flex flex-1 justify-center gap-2"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting || isLeaving}
              >
                <Trash2 className="h-4 w-4" />
                Delete Group
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Group"
        description="Are you sure you want to delete this group? All messages will be permanently lost. This cannot be undone."
        confirmLabel="Delete Group"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={showLeaveConfirm}
        onOpenChange={setShowLeaveConfirm}
        title="Leave Group"
        description="Are you sure you want to leave this group? You won't be able to see messages unless someone adds you back."
        confirmLabel="Leave Group"
        isLoading={isLeaving}
        onConfirm={handleLeave}
      />
    </>
  );
}
