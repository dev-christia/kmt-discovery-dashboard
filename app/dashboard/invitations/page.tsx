"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

interface Invitation {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  inviter: {
    firstName: string;
    lastName: string;
  };
}

function getInvitationStatus(invitation: Invitation) {
  if (invitation.acceptedAt) return "accepted";
  const now = new Date();
  const expiresAt = new Date(invitation.expiresAt);
  return expiresAt < now ? "expired" : "pending";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Accepted
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function InvitationsPage() {
  const [token, setToken] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = async () => {
    if (!token.trim()) {
      setError("Please enter a valid token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invitations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setInvitations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch invitations"
      );
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invitations</h1>
        <p className="text-gray-600 mt-2">View all platform invitations</p>
      </div>

      {/* Token Input & Fetch Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="password"
                placeholder="Enter your API token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchInvitations()}
              />
            </div>
            <Button
              onClick={fetchInvitations}
              disabled={loading || !token.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {loading ? "Loading..." : "Fetch"}
            </Button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Results */}
      {invitations.length === 0 && !loading && !error && token && (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Invitations Found
            </h3>
            <p className="text-gray-600">
              No invitations were found for this token.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Invitations List */}
      {invitations.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {invitations.length} invitation
              {invitations.length !== 1 ? "s" : ""}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInvitations}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {invitations.map((invitation) => {
              const status = getInvitationStatus(invitation);
              return (
                <Card key={invitation.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {invitation.email}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Invited by {invitation.inviter.firstName}{" "}
                          {invitation.inviter.lastName}
                        </p>
                      </div>
                      {getStatusBadge(status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <Badge variant="outline">{invitation.role}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span>
                          {new Date(invitation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium">
                          {new Date(invitation.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                      {invitation.acceptedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accepted:</span>
                          <span className="text-green-600 font-medium">
                            {new Date(
                              invitation.acceptedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
