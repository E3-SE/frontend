import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getAdminUsers, registerAdminUser } from "@/src/lib/admin/adminApi";
import getAdminTokenOrThrow from "@/src/lib/admin/getAdminTokenOrThrow";
import getUserProfile from "@/src/lib/auth/getUserProfile";

type SearchParams = Record<string, string | string[] | undefined>;

function readSearchParam(params: SearchParams, key: string) {
  const value = params[key];
  if (Array.isArray(value)) {
    return (value[0] ?? "").trim();
  }

  return (value ?? "").trim();
}

function getInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "--";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function getRoleBadge(role: string) {
  if (role.toLowerCase() === "admin") {
    return {
      label: "Admin",
      className:
        "inline-flex items-center rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed",
    };
  }

  return {
    label: "User",
    className:
      "inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container",
  };
}

function toReadableDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const createUserModalId = "create-user-modal";
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : (searchParams ?? {});

  const roleFilter = readSearchParam(resolvedSearchParams, "role") || "all";
  const keywordFilter = readSearchParam(resolvedSearchParams, "keyword");
  const sortBy = readSearchParam(resolvedSearchParams, "sort") || "created-desc";

  const token = await getAdminTokenOrThrow();
  const usersResponse = await getAdminUsers(token).catch(() => ({
    success: false,
    count: 0,
    totalCount: 0,
    pagination: undefined,
    data: [],
  }));

  const profile = await getUserProfile(token).catch(() => ({
    success: false,
    data: null,
  }));

  async function createAdminAction(formData: FormData) {
    "use server";

    const actionToken = await getAdminTokenOrThrow();

    await registerAdminUser(actionToken, {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? "").trim(),
      tel: String(formData.get("tel") ?? "").trim(),
    });

    revalidatePath("/admin-dashboard/users");
  }

  const filteredUsers = usersResponse.data
    .filter((user) => {
      if (roleFilter !== "all" && user.role.toLowerCase() !== roleFilter) {
        return false;
      }

      if (keywordFilter) {
        const normalizedKeyword = keywordFilter.toLowerCase();
        const haystack = `${user.name} ${user.email} ${user.tel}`.toLowerCase();
        if (!haystack.includes(normalizedKeyword)) {
          return false;
        }
      }

      return true;
    })
    .sort((first, second) => {
      if (sortBy === "name-asc") {
        return first.name.localeCompare(second.name);
      }

      if (sortBy === "name-desc") {
        return second.name.localeCompare(first.name);
      }

      const firstCreated = new Date(first.createdAt ?? 0).getTime();
      const secondCreated = new Date(second.createdAt ?? 0).getTime();

      if (sortBy === "created-asc") {
        return firstCreated - secondCreated;
      }

      return secondCreated - firstCreated;
    });

  const hasNextPage = Boolean(usersResponse.pagination?.next);

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-headline text-4xl leading-tight text-on-surface">All Users</h2>
          <p className="mt-2 max-w-lg text-on-surface-variant">
            Monitor and manage platform users and admin accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
            {filteredUsers.length} of {usersResponse.count} shown
          </div>

          <input id={createUserModalId} type="checkbox" className="peer hidden" />
          <label
            htmlFor={createUserModalId}
            className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
          >
            Create Admin User
          </label>

          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100">
            <div className="w-full max-w-xl rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="font-headline text-xl text-on-surface">Create New Admin User</h5>
                <label
                  htmlFor={createUserModalId}
                  className="cursor-pointer rounded-full border border-outline-variant/30 px-3 py-1 text-xs text-on-surface-variant"
                >
                  Close
                </label>
              </div>

              <form action={createAdminAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="name"
                  required
                  placeholder="Full name"
                  className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
                />
                <input
                  name="tel"
                  required
                  placeholder="Phone (xxx-xxx-xxxx)"
                  className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
                />
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Email"
                  className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm md:col-span-2"
                />
                <input
                  name="password"
                  required
                  type="password"
                  placeholder="Password"
                  className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm md:col-span-2"
                />
                <div className="flex justify-end gap-2 md:col-span-2">
                  <label
                    htmlFor={createUserModalId}
                    className="cursor-pointer rounded-full border border-outline-variant/30 px-5 py-2 text-sm text-on-surface-variant"
                  >
                    Cancel
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-8 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
                  >
                    Create Admin User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <form className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-surface-container-low p-4 md:grid-cols-3">
        <select
          name="role"
          defaultValue={roleFilter}
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <input
          type="text"
          name="keyword"
          defaultValue={keywordFilter}
          placeholder="Search name, email, or phone"
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
        />

        <select
          name="sort"
          defaultValue={sortBy}
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
        >
          <option value="created-desc">Created (newest)</option>
          <option value="created-asc">Created (oldest)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>

        <div className="flex items-center justify-end gap-2 md:col-span-3">
          <Link
            href="/admin-dashboard/users"
            className="rounded-full border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant"
          >
            Reset
          </Link>
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-6">
        {filteredUsers.map((user) => {
          const badge = getRoleBadge(user.role);
          if (user._id === profile.data._id) {
            badge.label += " (You)";
          }

          return (
            <div
              key={user._id}
              className="group flex flex-col gap-6 rounded-4xl border border-outline-variant/5 bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md xl:flex-row xl:items-center xl:gap-10"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-xl font-bold text-primary">
                {/* {getInitials(user.name)} */}
                	<img
									src={`https://img.rachatat.com/insecure/plain/https://api.dicebear.com/9.x/lorelei/svg%3Fseed=${user._id}`}
									alt="User avatar"
									className="h-12 w-12 rounded-full object-cover"
								/>
              </div>

              <div className="grid grow grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center xl:gap-8">
                <div className="xl:col-span-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    User
                  </p>
                  <p className="font-semibold text-on-surface">{user.name}</p>
                  <p className="text-xs text-on-surface-variant">{user.email}</p>
                </div>

                <div className="xl:col-span-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Contact
                  </p>
                  <p className="text-sm text-on-surface">{user.tel || "-"}</p>
                </div>

                <div className="xl:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Role
                  </p>
                  <span className={badge.className}>{badge.label}</span>
                </div>

                <div className="xl:col-span-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Joined
                  </p>
                  <p className="text-sm text-on-surface">{toReadableDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="mt-6 rounded-xl bg-surface p-6 text-center text-sm text-on-surface-variant">
          No users found for the selected filters.
        </div>
      )}

      {hasNextPage && (
        <div className="mt-6 rounded-xl bg-surface p-4 text-sm text-on-surface-variant">
          More users are available on the next page.
        </div>
      )}
    </main>
  );
}
