import { getContactsForAdmin } from "@/app/actions/contact";
import { ContactsList } from "./contacts-list";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const contacts = await getContactsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Contacts</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Messages from the &quot;Send a message&quot; form. Also sent to your email when configured.
      </p>
      <ContactsList initial={contacts} />
    </div>
  );
}
