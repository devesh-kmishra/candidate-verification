export type LinkContext =
  | { type: "CANDIDATE"; token: string }
  | { type: "VERIFIER"; token: string };

export function buildVerificationLink(context: LinkContext): string {
  const base = process.env.FRONTEND_BASE_URL;

  if (!base) {
    throw new Error("FRONTEND_BASE_URL not set");
  }

  switch (context.type) {
    case "CANDIDATE":
      return `${base}/candidate/verify/${context.token}`;
    case "VERIFIER":
      return `${base}/verify/${context.token}`;
    default:
      throw new Error("Unknown link context");
  }
}
