"use client";

import AddUserForm from "@/components/ui/AddUserForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AddUserPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: 420, margin: "0 auto", marginTop: 40 }}>
        <AddUserForm />
      </div>
    </DashboardLayout>
  );
}
