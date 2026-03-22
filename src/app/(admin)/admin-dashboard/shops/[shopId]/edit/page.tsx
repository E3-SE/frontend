import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  deleteAdminShop,
  getAdminShopById,
  updateAdminShop,
} from "@/src/lib/admin/adminApi";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import EditShopForm from "@/src/components/admin/shops/editShopForm";

type ShopActionState = {
  success: boolean;
  message: string | null;
};

type EditShopPageProps = {
  params: Promise<{
    shopId: string;
  }>;
};

export default async function EditShopPage({ params }: EditShopPageProps) {
  const { shopId } = await params;
  const { session } = await requireAdminAuth();
  const token = session?.user?.token as string;
  const shopResponse = await getAdminShopById(token, shopId).catch(() => null);

  if (!shopResponse?.data) {
    notFound();
  }

  async function updateShopAction(
    _prevState: ShopActionState,
    formData: FormData,
  ): Promise<ShopActionState> {
    "use server";

    try {
      const { session: actionSession } = await requireAdminAuth();
      const actionToken = actionSession?.user?.token as string;
      const pictures = formData
        .getAll("pictures")
        .map((value) => String(value).trim())
        .filter(Boolean);

      await updateAdminShop(actionToken, shopId, {
        name: String(formData.get("name") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        district: String(formData.get("district") ?? "").trim(),
        province: String(formData.get("province") ?? "").trim(),
        postalcode: String(formData.get("postalcode") ?? "").trim(),
        tel: String(formData.get("tel") ?? "").trim(),
        price: Number(formData.get("price") ?? 0),
        pictures,
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to update shop. Please try again.";

      return {
        success: false,
        message,
      };
    }

    revalidatePath("/admin-dashboard/shops");
    revalidatePath(`/admin-dashboard/shops/${shopId}/edit`);
    redirect("/admin-dashboard/shops");
  }

  async function deleteShopAction(
    _prevState: ShopActionState,
    _formData: FormData,
  ): Promise<ShopActionState> {
    "use server";
    void _prevState;
    void _formData;

    try {
      const { session: actionSession } = await requireAdminAuth();
      const actionToken = actionSession?.user?.token as string;
      await deleteAdminShop(actionToken, shopId);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to delete shop. Please try again.";

      return {
        success: false,
        message,
      };
    }

    revalidatePath("/admin-dashboard/shops");
    redirect("/admin-dashboard/shops");
  }

  return (
    <EditShopForm
      shop={shopResponse.data}
      updateAction={updateShopAction}
      deleteAction={deleteShopAction}
    />
  );
}