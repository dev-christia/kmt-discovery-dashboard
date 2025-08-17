"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useContactActions } from "@/hooks/use-contacts";
import { Contact, ContactStatus } from "@/types/contact";

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

export default function ContactDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ContactStatus | "">("");

  const {
    getContactById,
    updateContactStatus,
    loading: actionLoading,
  } = useContactActions();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const contactData = await getContactById(contactId);
        if (contactData) {
          setContact(contactData);
        } else {
          setError("Contact not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    if (contactId) {
      fetchContact();
    }
  }, [contactId, getContactById]);

  const handleStatusUpdate = async () => {
    if (!contact || !selectedStatus) return;

    try {
      const updatedContact = await updateContactStatus(
        contact.id,
        selectedStatus as ContactStatus
      );
      if (updatedContact) {
        setContact(updatedContact);
        setSelectedStatus("");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleBackToContacts = () => {
    router.push("/dashboard/contacts");
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToContacts}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Button>
        </div>

        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-gray-600">
            Loading contact details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToContacts}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Contact Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested contact could not be found."}
          </p>
          <Button
            onClick={handleBackToContacts}
            className="bg-red-600 hover:bg-red-700"
          >
            Return to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToContacts}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Details
            </h1>
            <p className="text-gray-600">View and manage contact message</p>
          </div>
        </div>

        <Badge className={statusColors[contact.status]}>
          {statusIcons[contact.status]}
          <span className="ml-1">{contact.status.replace("_", " ")}</span>
        </Badge>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {contact.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Topic
                  </label>
                  <Badge variant="outline" className="text-base">
                    {contact.topic}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Date Submitted
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {new Date(contact.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-green-600" />
                Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-lg font-semibold text-gray-900">
                  {contact.subject}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg border min-h-[200px]">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {contact.message}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Status Management
              </CardTitle>
              <CardDescription>Update the contact status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Current Status
                </label>
                <Badge className={statusColors[contact.status]}>
                  {statusIcons[contact.status]}
                  <span className="ml-1">
                    {contact.status.replace("_", " ")}
                  </span>
                </Badge>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  Update Status
                </label>
                <Select
                  value={selectedStatus}
                //   @ts-ignore
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                    // @ts-ignore
                    value={ContactStatus.PENDING}>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Pending</span>
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
                    <SelectItem 
                    // @ts-ignore
                    value={ContactStatus.CLOSED}>
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4" />
                        <span>Closed</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
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

              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => window.open(`tel:${contact.email}`, "_blank")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Create Follow-up
              </Button>
            </CardContent>
          </Card>

          {/* Contact Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Contact Created
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {contact.updatedAt !== contact.createdAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Last Updated
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(contact.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
