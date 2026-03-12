"use client";

import { useEffect, useState } from "react";
import EditUserForm from "@/components/ui/EditUserForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUserById } from "@/services/userService";
import { useParams } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const data = await getUserById(Number(id));
      setUser(data);
      setLoading(false);
    }
    if (id) fetch();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: 420, margin: "0 auto", marginTop: 40 }}>
        {loading ? <p>Loading...</p> : <EditUserForm user={user} />}
      </div>
    </DashboardLayout>
  );
}
