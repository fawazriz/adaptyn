// src/lib/api/profiles.ts

export async function fetchProfile() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
}


export function intiialsFromProfile(profile: { full_name: string } | null): string {
  if (!profile) return ""
  return profile.full_name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
}