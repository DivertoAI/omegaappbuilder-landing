import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabaseAdmin";

function getTokenFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/sb-access-token=([^;]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);
  return null;
}

export async function getUserFromToken(token: string) {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return null;
  const email = data.user.email;
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

export async function getUserFromRequest(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return getUserFromToken(token);
}
