"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export function GroupSettingsModal({ 
  conversationId, 
  groupName, 
  avatarUrl, 
  memberCount,
  onClose,
  isOpen
}: { 
  conversationId: Id<"conversations">;
  groupName: string;
  avatarUrl?: string;
  memberCount: number;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const deleteGroup = useMutation(api.conversations.deleteGroup);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const updateGroupAvatar = useMutation(api.conversations.updateGroupAvatar);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this group? All messages will be permanently lost.")) return;
    
    try {
      setIsDeleting(true);
      await deleteGroup({ conversationId });
      onClose();
      router.push("/chat");
    } catch (error) {
      console.error("Failed to delete group:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // basic size limit check (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max size is 5MB.");
      return;
    }

    try {
        setIsUploading(true);
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
        
        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        
        const { storageId } = await result.json();
        
        // Step 3: Save the newly allocated storage id to the group
        await updateGroupAvatar({ conversationId, storageId });
        
    } catch (error) {
        console.error("Failed to upload avatar", error);
    } finally {
        setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
          <DialogDescription>
            Manage group profile and participants.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group cursor-pointer h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border shadow-sm">
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
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{groupName}</h3>
            <p className="text-sm text-muted-foreground">{memberCount} participants</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
            <Button 
              variant="destructive" 
              className="w-full flex justify-center gap-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Group
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2 px-4">
                Deleting this group will immediately remove it for all participants. This cannot be undone.
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
