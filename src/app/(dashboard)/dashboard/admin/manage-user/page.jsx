import RoleRoute from "@/components/Privet/RoleRoute";
import ManageUsers from "../ManageUser";


export default function Page() {
  return (
    <RoleRoute allowedRoles={["admin"]}>
      <ManageUsers />
    </RoleRoute>
  );
}