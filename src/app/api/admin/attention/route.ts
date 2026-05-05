import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminSession } from "@/lib/admin/auth";

const KV_TABLE = "kv_store_3fa6479f";

function getSupabaseAdmin() {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!projectId || !serviceRoleKey) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? `https://${projectId}.supabase.co`;
  return createClient(url, serviceRoleKey);
}

type StoredComment = {
  status?: "pending" | "approved" | "spam";
};

type StoredContact = {
  read?: boolean;
};

export async function GET() {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      counts: { contacts: 0, commentsPending: 0 },
      warning: "Supabase admin env vars are missing.",
    });
  }

  const contactsRowsPromise = supabase
    .from(KV_TABLE)
    .select("value")
    .like("key", "contact:%");

  const commentsRowsPromise = supabase
    .from(KV_TABLE)
    .select("value")
    .like("key", "comment:%");

  const [{ data: contactRows, error: contactsError }, { data: commentRows, error: commentsError }] = await Promise.all([
    contactsRowsPromise,
    commentsRowsPromise,
  ]);

  const contactsUnread = (contactRows ?? []).reduce((acc, row) => {
    const contact = row?.value as StoredContact | undefined;
    return contact?.read ? acc : acc + 1;
  }, 0);

  if (commentsError || contactsError) {
    return NextResponse.json({
      ok: true,
      counts: { contacts: contactsUnread, commentsPending: 0 },
      warning: "Couldn't compute one or more attention counters.",
    });
  }

  const commentsPending = (commentRows ?? []).reduce((acc, row) => {
    const comment = row?.value as StoredComment | undefined;
    const status = comment?.status ?? "pending";
    return status === "pending" ? acc + 1 : acc;
  }, 0);

  return NextResponse.json({
    ok: true,
    counts: {
      contacts: contactsUnread,
      commentsPending,
    },
  });
}
