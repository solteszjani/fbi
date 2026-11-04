import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminUsers from "@/components/admin-users";
export default async function AdminPage(){const s=await getSession();if(!s)redirect("/login");if(!["SUPERADMIN","ADMIN"].includes(s.role))redirect("/");return <AdminUsers />}
