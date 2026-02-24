"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Camera, Loader2, UserPlus, LogOut, Shield } from "lucide-react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./ConfirmDialog";

export function GroupSettingsModal({ 
  conversationId, 
  groupName, 
  avatarUrl, 
  memberCount,
  groupMembers,
  adminId,
  onClose,
  isOpen
}: { 
  conversationId: Id<"conversations">;
  groupName: string;
  avatarUrl?: string;
  memberCount: number;
  groupMembers: { _id?: Id<"users">; name?: string; avatarUrl?: string }[];
  adminId?: Id<"users">;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
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
      router.push("/chat");
    } catch (error) {
      console.error("Failed to delete group:", error);
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
      router.push("/chat");
    } catch (error) {
      console.error("Failed to leave group:", error);
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
      console.error("Failed to add members:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max size is 5MB.");
      return;
    }

    try {
        setIsUploading(true);
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        await updateGroupAvatar({ conversationId, storageId });
    } catch (error) {
        console.error("Failed to upload avatar", error);
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
        <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>Group Settings</DialogTitle>
            <DialogDescription>
              Manage group profile and participants.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center gap-4 py-4 px-1">
            {/* Avatar */}
            <div className="relative group cursor-pointer shrink-0 h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border shadow-sm">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : avatarUrl ? (
                <Image src={avatarUrl} alt={groupName} fill className="object-cover" />
              ) : (
                  <div className="text-3xl font-semibold text-primary/50">
                    {groupName.charAt(0).toUpperCase()}
                  </div>
              )}
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Change Photo</span>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            
            <div className="text-center w-full pb-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">{groupName}</h3>
              <p className="text-sm text-muted-foreground">{memberCount} participants</p>
            </div>

            {/* Members Section */}
            <div className="w-full flex-1 min-h-0 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Participants</h4>
                {!isAddingMode && (
                  <button 
                    onClick={() => setIsAddingMode(true)}
                    className="text-xs flex items-center gap-1 font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    <UserPlus className="h-3 w-3" />
                    Add Member
                  </button>
                )}
              </div>

              {isAddingMode && (
                <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">Select users to add:</span>
                    <button onClick={() => { setIsAddingMode(false); setSelectedUsers([]); }} className="text-[10px] text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                  {availableUsers.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-3">All platform users are already in this group.</p>
                  ) : (
                    <div className="max-h-32 overflow-y-auto flex flex-col gap-1 pr-1">
                      {availableUsers.map(user => {
                        const isSelected = selectedUsers.includes(user._id);
                        return (
                          <button
                            key={user._id}
                            onClick={() => {
                              setSelectedUsers(prev => 
                                isSelected ? prev.filter(id => id !== user._id) : [...prev, user._id]
                              )
                            }}
                            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${isSelected ? "bg-primary/20" : "hover:bg-muted"}`}
                          >
                             <div className="relative h-6 w-6 shrink-0 rounded-full bg-muted overflow-hidden">
                                {user.avatarUrl ? (
                                  <Image src={user.avatarUrl} alt={user.name || "User"} fill className="object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-[10px] font-semibold text-primary">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                             </div>
                             <span className="text-sm truncate flex-1 text-left">{user.name}</span>
                             {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {selectedUsers.length > 0 && (
                    <Button size="sm" onClick={handleAddMembers} disabled={isAdding} className="mt-2 w-full gap-2">
                      {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Group"}
                    </Button>
                  )}
                </div>
              )}
              
              <div className="max-h-40 overflow-y-auto flex flex-col gap-2">
                {groupMembers?.map(member => (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 rounded-full bg-muted overflow-hidden">
                      {member.avatarUrl ? (
                        <Image src={member.avatarUrl} alt={member.name || "Member"} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xs font-semibold text-primary">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 truncate">
                      <span className="text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                        {member.name}
                        {member._id === currentUser?._id && <span className="text-xs text-muted-foreground">(You)</span>}
                        {member._id === adminId && (
                          <Shield className="h-3 w-3 text-primary shrink-0" />
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 border-t border-border pt-4 mt-2 flex gap-2">
              {!isAdmin && (
                <Button 
                  variant="outline" 
                  className="flex-1 flex justify-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
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
                  className="flex-1 flex justify-center gap-2"
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
