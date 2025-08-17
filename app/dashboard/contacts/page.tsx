"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MessageSquare,
  Mail,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  TrendingUp,
  Users,
  MessageCircle,
  Archive,
  ArrowLeft,
  ArrowRight,
  Download,
} from "lucide-react";
import {
  useContacts,
  useContactStats,
  useContactActions,
} from "@/hooks/use-contacts";
import { ContactStatus } from "@/types/contact";
import ContactDetailsDialog from "@/components/contact-details-dialog";

const statusIcons = {
  [ContactStatus.UNREAD]: <Mail className="w-4 h-4" />,
  [ContactStatus.READ]: <Eye className="w-4 h-4" />,
  [ContactStatus.IN_PROGRESS]: <Loader2 className="w-4 h-4" />,
  [ContactStatus.RESOLVED]: <CheckCircle className="w-4 h-4" />,
};

const statusColors = {
  [ContactStatus.UNREAD]: "bg-red-100 text-red-800 border-red-200",
  [ContactStatus.READ]: "bg-blue-100 text-blue-800 border-blue-200",
  [ContactStatus.IN_PROGRESS]:
    "bg-yellow-100 text-yellow-800 border-yellow-200",
  [ContactStatus.RESOLVED]: "bg-green-100 text-green-800 border-green-200",
};

export default function ContactsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const { contacts, pagination, loading, error, refetch } = useContacts({
    page: currentPage,
    limit,
    status: statusFilter,
  });

  const {
    stats,
    loading: statsLoading,
    refetch: refetchStats,
  } = useContactStats();
  const {
    deleteContact,
    getContactById,
    loading: actionLoading,
  } = useContactActions();

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  const handleViewContact = async (contactId: string) => {
    try {
      const contact = await getContactById(contactId);
      if (contact) {
        setSelectedContact(contactId);
        setDetailsDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch contact details:", error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      refetch();
      refetchStats();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContactData = contacts.find((c) => c.id === selectedContact);

  if (loading && !contacts.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg text-gray-600">Loading contacts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Contacts
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Contact Management 📬
            </h1>
            <p className="text-lg text-gray-700">
              Manage customer inquiries and support requests
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <MessageSquare className="w-3 h-3 mr-1" />
                Customer Support Hub
              </Badge>
              <Badge
                variant="outline"
                className="border-purple-200 text-purple-800"
              >
                <Users className="w-3 h-3 mr-1" />
                Real-time Updates
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 lg:mt-0 space-y-4 lg:space-y-0 lg:space-x-3 flex flex-col lg:flex-row">
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Contacts
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Contacts
              </CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.total}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  +{stats.todayCount}
                </span>
                <span className="text-sm text-gray-500">today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Unread
              </CardTitle>
              <div className="bg-red-100 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.unread}
              </div>
              <div className="text-sm text-gray-500">New messages</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Read
              </CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.read}
              </div>
              <div className="text-sm text-gray-500">Viewed messages</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                In Progress
              </CardTitle>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Loader2 className="w-5 h-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.inProgress}
              </div>
              <div className="text-sm text-gray-500">Being handled</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Resolved
              </CardTitle>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.resolved}
              </div>
              <div className="text-sm text-gray-500">Successfully handled</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-indigo-600" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) =>
                  setStatusFilter(
                    value === "all" ? undefined : (value as ContactStatus)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value={ContactStatus.UNREAD}>Unread</SelectItem>
                  <SelectItem value={ContactStatus.READ}>Read</SelectItem>
                  <SelectItem value={ContactStatus.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={ContactStatus.RESOLVED}>
                    Resolved
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Per Page
              </label>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
              Contact Messages
            </div>
            <Badge variant="outline" className="ml-2">
              {filteredContacts.length} contacts
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage and respond to customer contact messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No contacts found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter
                  ? "Try adjusting your filters"
                  : "No contact messages yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {contact.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {contact.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p
                              className="font-medium truncate"
                              title={contact.subject}
                            >
                              {contact.subject}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contact.topic}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[contact.status]}>
                            {statusIcons[contact.status]}
                            <span className="ml-1">
                              {contact.status.replace("_", " ")}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewContact(contact.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Contact
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this contact
                                    message from {contact.name}? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteContact(contact.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, pagination.totalContacts)} of{" "}
                    {pagination.totalContacts} contacts
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Contact Details Dialog */}
      <ContactDetailsDialog
        contact={selectedContactData || null}
        isOpen={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedContact(null);
        }}
        onUpdate={() => {
          refetch();
          refetchStats();
        }}
      />
    </div>
  );
}
