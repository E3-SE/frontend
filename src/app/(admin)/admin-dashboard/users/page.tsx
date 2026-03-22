import { revalidatePath } from "next/cache";
import { getAdminUsers, registerAdminUser } from "@/src/lib/admin/adminApi";
import formatPhoneNumber from "@/src/lib/admin/formatPhoneNumber";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import UsersListClient from "@/src/components/features/admin/usersListClient";

type CreateAdminActionState = {
  success: boolean;
  message: string | null;
};
export default async function UserManagementPage() {
  const { session, profile } = await requireAdminAuth();
  const token = session?.user?.token as string;

  const usersResponse = await getAdminUsers(token).catch(() => ({
    success: false,
    count: 0,
    totalCount: 0,
    pagination: undefined,
    data: [],
  }));

  async function createAdminAction(
    _state: CreateAdminActionState,
    formData: FormData,
  ): Promise<CreateAdminActionState> {
    "use server";

    try {
      const { session: actionSession } = await requireAdminAuth();
      const actionToken = actionSession?.user?.token as string;

      await registerAdminUser(actionToken, {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? "").trim(),
        tel: formatPhoneNumber(String(formData.get("tel") ?? "").trim()),
      });

      revalidatePath("/admin-dashboard/users");
      return {
        success: true,
        message: "Admin user created successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create admin user. Please try again.",
      };
    }
  }

  const hasNextPage = Boolean(usersResponse.pagination?.next);

  return (
    <UsersListClient
      users={usersResponse.data}
      totalCount={usersResponse.count}
      hasNextPage={hasNextPage}
      currentUserId={profile.data._id}
      createAdminAction={createAdminAction}
    />
  );
}
