import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGitHubUrl(from: string, inviteToken: string | null | undefined) {
  const rootURl = "https://github.com/login/oauth/authorize";

  const options = {
    client_id: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL as string,
    scope: "user:email",
    state: JSON.stringify({
      redirectUrl: from,
      partnerCode: 'wolf',
      inviteToken,
    }),
  };

  const qs = new URLSearchParams(options);

  return `${rootURl}?${qs.toString()}`;
}

export const getGoogleUrl = (from: string) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT as string,
    client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};

export const formatCreatedDate = (createdAt: Date | undefined) => {
  if (!createdAt) return ''
  return format(new Date(), 'dd/MM/yyyy HH:mm');
}