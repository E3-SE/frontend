import { apiBaseUrl } from "../config";

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
  totalCount?: number;
  pagination?: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}

export interface AdminShop {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  pictures: string[];
  price: number;
  averageRating?: number;
  userRatingCount?: number;
}

export interface AdminReservation {
  _id: string;
  reserveDate: string;
  user:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        tel?: string;
      };
  massage:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
        province?: string;
        tel?: string;
      };
  rating?: number;
  isRated?: boolean;
  createdAt?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  tel: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface CreateShopInput {
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  price: number;
  pictures?: string[];
}

export interface RegisterAdminInput {
  name: string;
  email: string;
  password: string;
  tel: string;
}

async function safeJson(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function adminFetch<T>(
  endpoint: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const json = await safeJson(response);

  if (!response.ok) {
    const message =
      json?.message ??
      json?.error ??
      `${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return json as T;
}

export async function getAdminShops(token: string) {
  return adminFetch<ApiListResponse<AdminShop>>(`/api/massages?limit=100`, token, {
    method: "GET",
  });
}

export async function getAdminShopById(token: string, shopId: string) {
  return adminFetch<ApiItemResponse<AdminShop>>(`/api/massages/${shopId}`, token, {
    method: "GET",
  });
}

export async function createAdminShop(token: string, payload: CreateShopInput) {
  return adminFetch<{ success: boolean; data: AdminShop }>(`/api/massages`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminShop(
  token: string,
  shopId: string,
  payload: CreateShopInput,
) {
  return adminFetch<{ success: boolean; data: AdminShop }>(
    `/api/massages/${shopId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAdminShop(token: string, shopId: string) {
  return adminFetch<{ success: boolean; data: unknown }>(
    `/api/massages/${shopId}`,
    token,
    {
      method: "DELETE",
    },
  );
}

export async function getAdminReservations(token: string) {
  return adminFetch<ApiListResponse<AdminReservation>>(
    `/api/reservations?limit=100`,
    token,
    {
      method: "GET",
    },
  );
}

export async function getAdminUsers(token: string) {
  return adminFetch<ApiListResponse<AdminUser>>(`/api/users?limit=100`, token, {
    method: "GET",
  });
}

export async function updateAdminReservationDate(
  token: string,
  reservationId: string,
  reserveDate: string,
) {
  return adminFetch<{ success: boolean; data: AdminReservation }>(
    `/api/reservations/${reservationId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify({ reserveDate }),
    },
  );
}

export async function deleteAdminReservation(token: string, reservationId: string) {
  return adminFetch<{ success: boolean; data: unknown }>(
    `/api/reservations/${reservationId}`,
    token,
    {
      method: "DELETE",
    },
  );
}

export async function registerAdminUser(token: string, payload: RegisterAdminInput) {
  return adminFetch<{ success: boolean; token?: string }>(
    `/api/auth/register-admin`,
    token,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
