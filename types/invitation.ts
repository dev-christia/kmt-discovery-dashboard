export enum UserRoleType {
  EXPERT = "EXPERT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  TOURIST = "TOURIST",
  GUIDE = "GUIDE",
  RESEARCHER = "RESEARCHER",
  STUDENT = "STUDENT",
  OTHER = "OTHER",
}

export interface Invitation {
  id: string
  email: string
  token: string
  role: UserRoleType
  invitedBy: string
  inviter: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  expiresAt: string
  acceptedAt?: string
  createdAt: string
}

export interface InvitationResponse {
  invitations: Invitation[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateInvitationRequest {
  email: string
  role: UserRoleType
}
