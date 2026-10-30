import { SupabaseClient } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types/database';

export interface AuthUserContext {
  user: {
    id: string;
    email?: string;
  };
  profile: Profile;
}

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Verifies that the caller has a valid, cryptographically verified session
 * by calling supabase.auth.getUser() (server-verified, not unverified getSession).
 */
export async function requireUser(
  client: SupabaseClient,
  jwtToken?: string
): Promise<AuthUserContext> {
  let user = null;

  if (jwtToken) {
    const { data, error } = await client.auth.getUser(jwtToken);
    if (error || !data.user) {
      throw new AuthError('प्रमाणीकरण आवश्यक आहे (Invalid or expired authentication token)', 401);
    }
    user = data.user;
  } else {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) {
      throw new AuthError('प्रमाणीकरण आवश्यक आहे (Authentication required)', 401);
    }
    user = data.user;
  }

  // Always fetch role securely from the profiles table server-side.
  // Never trust role claims from client body, headers, or unverified metadata.
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    // Least privilege fallback: default role is author, never admin
    const defaultProfile: Profile = {
      id: user.id,
      display_name: user.email?.split('@')[0] || 'Author',
      role: 'author',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { user: { id: user.id, email: user.email }, profile: defaultProfile };
  }

  return {
    user: { id: user.id, email: user.email },
    profile: profile as Profile,
  };
}

/**
 * Enforces role-based access control.
 * Throws 403 Forbidden if the authenticated user's verified role is not in allowedRoles.
 */
export async function requireRole(
  client: SupabaseClient,
  allowedRoles: UserRole[],
  jwtToken?: string
): Promise<AuthUserContext> {
  const authContext = await requireUser(client, jwtToken);
  const userRole = authContext.profile.role;

  if (!allowedRoles.includes(userRole)) {
    throw new AuthError(
      `अनधिकृत प्रवेश: या क्रियेसाठी ${allowedRoles.join(' किंवा ')} अधिकार आवश्यक आहेत. (Forbidden: Requires role in [${allowedRoles.join(', ')}])`,
      403
    );
  }

  return authContext;
}

/**
 * IDOR (Insecure Direct Object Reference) Protection:
 * Verifies whether the authenticated user has permission to view or mutate a specific object.
 * - 'admin' and 'editor' can manage all objects.
 * - 'author' can ONLY access objects they own (author_id === current user ID).
 */
export function checkObjectOwnership(
  objectAuthorId: string | undefined | null,
  currentUserId: string,
  currentUserRole: UserRole
): boolean {
  if (currentUserRole === 'admin' || currentUserRole === 'editor') {
    return true;
  }
  if (currentUserRole === 'author' && objectAuthorId === currentUserId) {
    return true;
  }
  return false;
}
