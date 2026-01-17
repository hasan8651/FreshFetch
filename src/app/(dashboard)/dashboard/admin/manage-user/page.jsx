import RoleRoute from "@/components/Private/RoleRoute";
import ManageUsers from "../ManageUser";


export default function Page() {
  return (
    <RoleRoute allowedRoles={["admin"]}>
      <ManageUsers />
    </RoleRoute>
  );
}