import { Contact, ContactStatus } from "@/types/contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  User,
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useContactActions } from "@/hooks/use-contacts";

interface ContactDetailsDialogProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusIcons = {
  [ContactStatus.UNREAD]: <Clock className="w-4 h-4" />,
  [ContactStatus.READ]: <Mail className="w-4 h-4" />,
  [ContactStatus.IN_PROGRESS]: <Loader2 className="w-4 h-4" />,
  [ContactStatus.RESOLVED]: <CheckCircle className="w-4 h-4" />,
};

const statusColors = {
  [ContactStatus.UNREAD]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [ContactStatus.READ]: "bg-blue-100 text-blue-800 border-blue-200",
  [ContactStatus.IN_PROGRESS]:
    "bg-orange-100 text-orange-800 border-orange-200",
  [ContactStatus.RESOLVED]: "bg-green-100 text-green-800 border-green-200",
};

export default function ContactDetailsDialog({
  contact,
  isOpen,
  onClose,
  onUpdate,
}: ContactDetailsDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<ContactStatus | "">("");
  const { updateContactStatus, loading } = useContactActions();

  if (!contact) return null;

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;

    try {
      await updateContactStatus(contact.id, selectedStatus as ContactStatus);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Contact Details</span>
          </DialogTitle>
          <DialogDescription>
            View and manage contact message details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="font-semibold">{contact.name}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  Email:
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {contact.email}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  Topic:
                </span>
                <Badge variant="outline">{contact.topic}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  Created:
                </span>
                <span>{new Date(contact.createdAt).toLocaleString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  Status:
                </span>
                <Badge className={statusColors[contact.status]}>
                  {statusIcons[contact.status]}
                  <span className="ml-1">
                    {contact.status.replace("_", " ")}
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Subject:
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="font-semibold text-gray-900">{contact.subject}</p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Message:
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[120px]">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Update Status</h4>
            <div className="flex flex-col sm:flex-row gap-3">
                
              <Select value={selectedStatus}
            //   @ts-ignore
              onValueChange={setSelectedStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select new status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContactStatus.UNREAD}>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Unread</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={ContactStatus.READ}>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Read</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={ContactStatus.IN_PROGRESS}>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4" />
                      <span>In Progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={ContactStatus.RESOLVED}>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolved</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() =>
                window.open(
                  `mailto:${contact.email}?subject=Re: ${contact.subject}`,
                  "_blank"
                )
              }
            >
              <Mail className="w-4 h-4 mr-2" />
              Reply via Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
