"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Mail,
  UserPlus,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Copy,
  Trash2,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { useInvitations } from "@/hooks/use-invitations";
import { UserRoleType } from "@/types/invitation";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
};

const roleColors = {
  [UserRoleType.ADMIN]: "bg-red-100 text-red-800",
  [UserRoleType.SUPER_ADMIN]: "bg-purple-100 text-purple-800",
  [UserRoleType.EXPERT]: "bg-blue-100 text-blue-800",
  [UserRoleType.TOURIST]: "bg-green-100 text-green-800",
  [UserRoleType.GUIDE]: "bg-orange-100 text-orange-800",
  [UserRoleType.RESEARCHER]: "bg-indigo-100 text-indigo-800",
  [UserRoleType.STUDENT]: "bg-yellow-100 text-yellow-800",
  [UserRoleType.OTHER]: "bg-gray-100 text-gray-800",
};

export default function InvitationsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showExportSummary, setShowExportSummary] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    email: "",
    role: UserRoleType.TOURIST,
  });

  const {
    invitations,
    filteredInvitations,
    allInvitations,
    loading,
    sendingInvitation,
    revokingInvitation,
    resendingInvitation,
    error,
    pagination,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    exportInvitations,
    refetch,
  } = useInvitations({
    page: 1, // We'll handle pagination on frontend
    limit: 100, // Get more data to work with
    search: searchTerm,
    status: selectedStatus === "all" ? undefined : (selectedStatus as any),
    role: selectedRole === "all" ? undefined : (selectedRole as UserRoleType),
  });

  const handleCreateInvitation = async () => {
    if (!newInvitation.email || !newInvitation.role) return;

    try {
      await sendInvitation({
        email: newInvitation.email,
        role: newInvitation.role,
      });
      setIsCreateDialogOpen(false);
      setNewInvitation({ email: "", role: UserRoleType.TOURIST });
    } catch (error) {
      console.error("Failed to create invitation:", error);
    }
  };

  const handleExportWithSummary = (
    data: any[],
    filename: string,
    format: "csv" | "json" | "pdf"
  ) => {
    const summary = {
      total: data.length,
      pending: data.filter((inv) => {
        const now = new Date();
        const expiresAt = new Date(inv.expiresAt);
        return !inv.acceptedAt && expiresAt > now;
      }).length,
      accepted: data.filter((inv) => !!inv.acceptedAt).length,
      expired: data.filter((inv) => {
        const now = new Date();
        const expiresAt = new Date(inv.expiresAt);
        return !inv.acceptedAt && expiresAt <= now;
      }).length,
    };

    // Show toast with summary before export
    toast({
      title: "Exporting Invitations",
      description: `${summary.total} invitations (${summary.pending} pending, ${summary.accepted} accepted, ${summary.expired} expired)`,
    });

    // Proceed with export
    exportInvitations(data, filename, format);
  };

  const getInvitationStatus = (invitation: any) => {
    if (invitation.acceptedAt) return "accepted";
    if (new Date(invitation.expiresAt) < new Date()) return "expired";
    return "pending";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyInvitationLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
  };

  const pendingInvitations = (invitations || []).filter(
    (inv) => getInvitationStatus(inv) === "pending"
  );
  const acceptedInvitations = (invitations || []).filter(
    (inv) => getInvitationStatus(inv) === "accepted"
  );
  const expiredInvitations = (invitations || []).filter(
    (inv) => getInvitationStatus(inv) === "expired"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Invitations</h1>
          <p className="text-gray-600 mt-1">
            Invite new users to join the KMT Discovery platform
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={refetch}
            disabled={loading}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export ({filteredInvitations?.length || 0})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Export Filtered ({filteredInvitations?.length || 0} items)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleExportWithSummary(
                    filteredInvitations,
                    "filtered_invitations",
                    "csv"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExportWithSummary(
                    filteredInvitations,
                    "filtered_invitations",
                    "json"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExportWithSummary(
                    filteredInvitations,
                    "filtered_invitations",
                    "pdf"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                Export All ({allInvitations?.length || 0} items)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleExportWithSummary(
                    allInvitations,
                    "all_invitations",
                    "csv"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export All as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExportWithSummary(
                    allInvitations,
                    "all_invitations",
                    "json"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export All as JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExportWithSummary(
                    allInvitations,
                    "all_invitations",
                    "pdf"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export All as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send New Invitation</DialogTitle>
                <DialogDescription>
                  Invite a new user to join the KMT Discovery platform. They
                  will receive an email with instructions to create their
                  account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newInvitation.email}
                    onChange={(e) =>
                      setNewInvitation({
                        ...newInvitation,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select
                    value={newInvitation.role}
                    onValueChange={(value: UserRoleType) =>
                      setNewInvitation({ ...newInvitation, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRoleType.TOURIST}>
                        Tourist
                      </SelectItem>
                      <SelectItem value={UserRoleType.EXPERT}>
                        Expert/Consultant
                      </SelectItem>
                      <SelectItem value={UserRoleType.GUIDE}>Guide</SelectItem>
                      <SelectItem value={UserRoleType.RESEARCHER}>
                        Researcher
                      </SelectItem>
                      <SelectItem value={UserRoleType.STUDENT}>
                        Student
                      </SelectItem>
                      <SelectItem value={UserRoleType.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRoleType.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvitation}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={
                    !newInvitation.email ||
                    !newInvitation.role ||
                    sendingInvitation
                  }
                >
                  {sendingInvitation ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {sendingInvitation ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Invitations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(invitations || []).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingInvitations.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {acceptedInvitations.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expiredInvitations.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search invitations by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRoleType.TOURIST}>Tourist</SelectItem>
                <SelectItem value={UserRoleType.EXPERT}>Expert</SelectItem>
                <SelectItem value={UserRoleType.GUIDE}>Guide</SelectItem>
                <SelectItem value={UserRoleType.RESEARCHER}>
                  Researcher
                </SelectItem>
                <SelectItem value={UserRoleType.STUDENT}>Student</SelectItem>
                <SelectItem value={UserRoleType.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRoleType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invitations ({(invitations || []).length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading invitations...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <XCircle className="w-6 h-6 mr-2" />
              <span>Error loading invitations: {error}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invited By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(invitations || []).map((invitation) => {
                    const status = getInvitationStatus(invitation);
                    return (
                      <TableRow
                        key={invitation.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {invitation.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">
                              {invitation.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[invitation.role]}>
                            {invitation.role.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {invitation.inviter.firstName}{" "}
                              {invitation.inviter.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {invitation.inviter.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusColors[status as keyof typeof statusColors]
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {formatDate(invitation.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {formatDate(invitation.expiresAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  copyInvitationLink(invitation.token)
                                }
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Invite Link
                              </DropdownMenuItem>
                              {getInvitationStatus(invitation) ===
                                "pending" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    resendInvitation(invitation.id)
                                  }
                                  disabled={
                                    resendingInvitation === invitation.id
                                  }
                                >
                                  {resendingInvitation === invitation.id ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Mail className="mr-2 h-4 w-4" />
                                  )}
                                  {resendingInvitation === invitation.id
                                    ? "Resending..."
                                    : "Resend Invitation"}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => revokeInvitation(invitation.id)}
                                disabled={revokingInvitation === invitation.id}
                              >
                                {revokingInvitation === invitation.id ? (
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                {revokingInvitation === invitation.id
                                  ? "Revoking..."
                                  : "Revoke Invitation"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
