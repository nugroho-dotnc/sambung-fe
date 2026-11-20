"use client";

import { useState, type ReactNode } from "react";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../hooks/use-session";
import { roleSchema, type Role } from "../schemas";
import { setDemoRole } from "@/mock/session";

export function DemoRolePanel({ children, requiredRole }: { children: ReactNode; requiredRole: Role }) {
  const { user, isPending, isDemo } = useSession();
  const queryClient = useQueryClient();
  const mutationCount = useIsMutating();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  async function switchRole(value: string) {
    setSwitching(true); setError("");
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      setDemoRole(roleSchema.parse(value));
    } catch { setError("Tidak dapat menyimpan pilihan role di browser ini."); }
    finally { setSwitching(false); }
  }
  if (!isDemo) return <p>Autentikasi belum tersedia.</p>;
  if (isPending) return <p role="status">Memuat identitas demo…</p>;
  return <>
    <aside className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border bg-muted p-4">
      <div className="mr-auto"><p className="font-medium">Identitas demo: {user?.name}</p><p className="text-sm">Data ilustrasi · bukan sesi login nyata</p></div>
      <label className="text-sm">Lihat sebagai <select className="ml-2 min-h-11 rounded border bg-background px-3" value={user?.role ?? "petani"} disabled={switching || mutationCount > 0} onChange={(event) => void switchRole(event.target.value)}><option value="petani">Petani</option><option value="pembeli">Pembeli / produsen</option><option value="admin">Admin</option></select></label>
      {error && <p role="alert">{error}</p>}
    </aside>
    {switching ? <p role="status">Mengganti identitas…</p> : user?.role === requiredRole ? <div key={user.id}>{children}</div> : <p role="status">Role {user?.role} tidak memiliki akses ke ruang Petani. Pilih Petani untuk melanjutkan. Halaman role lainnya belum tersedia.</p>}
  </>;
}
