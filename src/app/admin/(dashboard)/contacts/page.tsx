import { getContactsForAdmin } from "@/app/actions/contact";
import { ContactsList } from "./contacts-list";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const result = await getContactsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Contacts</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Messages from the &quot;Send a message&quot; form. Also sent to your email when configured.
      </p>
      <section className="mb-8 border border-white/10 bg-white/[0.02] p-4 space-y-3 max-w-3xl">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          One-time setup checklist (booking + message)
        </h2>
        <ol className="list-decimal pl-5 space-y-2 font-mono text-xs text-white/70 leading-relaxed">
          <li>
            In `.env`, set <span className="text-white">NEXT_PUBLIC_BOOKING_URL</span> to your Calendly or Cal.com
            event link.
          </li>
          <li>
            Set <span className="text-white">CONTACT_EMAIL</span> to your inbox address.
          </li>
          <li>
            Set <span className="text-white">RESEND_API_KEY</span> with your real key from Resend.
          </li>
          <li>Keep `SUPABASE_SERVICE_ROLE_KEY` present so messages can be stored in Contacts.</li>
          <li>Redeploy on Vercel after changing production env vars.</li>
        </ol>
      </section>
      <ContactsList initial={result.contacts} initialError={result.ok ? null : result.error ?? null} />
    </div>
  );
}
