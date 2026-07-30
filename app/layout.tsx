import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const siteTitle = "自动化基础学习台";
const siteDescription =
  "本地优先的 F28335/CCS 学习执行台，用今日问题、最多三项任务和掌握证据推进基础学习。";
const fallbackOrigin = new URL("http://localhost:3000");
const safeHostCharacters = /^[a-z0-9.:[\]-]+$/i;
const cloudflareRay = /^[a-f0-9]{16,32}(?:-[a-z]{3})?$/i;
const ipAddressCharacters = /^[a-f0-9:.]+$/i;

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function validatedHost(value: string | null) {
  const candidate = firstHeaderValue(value);
  if (
    !candidate ||
    candidate.length > 255 ||
    !safeHostCharacters.test(candidate)
  ) {
    return null;
  }

  try {
    const parsed = new URL(`http://${candidate}`);
    if (
      parsed.username ||
      parsed.password ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash
    ) {
      return null;
    }
    return parsed.host;
  } catch {
    return null;
  }
}

function isLoopbackHost(host: string) {
  try {
    const hostname = new URL(`http://${host}`).hostname.toLowerCase();
    return (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

function isTrustedSitesProxy(
  requestHeaders: Awaited<ReturnType<typeof headers>>,
) {
  const ray = firstHeaderValue(requestHeaders.get("cf-ray"));
  const clientIp = firstHeaderValue(requestHeaders.get("cf-connecting-ip"));

  return Boolean(
    ray &&
      cloudflareRay.test(ray) &&
      clientIp &&
      ipAddressCharacters.test(clientIp),
  );
}

function requestOrigin(requestHeaders: Awaited<ReturnType<typeof headers>>) {
  const directHost = validatedHost(requestHeaders.get("host"));
  const trustForwardedHeaders = isTrustedSitesProxy(requestHeaders);
  const forwardedHost = trustForwardedHeaders
    ? validatedHost(requestHeaders.get("x-forwarded-host"))
    : null;
  const host = forwardedHost ?? directHost ?? fallbackOrigin.host;
  const forwardedProtocol = trustForwardedHeaders
    ? firstHeaderValue(requestHeaders.get("x-forwarded-proto"))
    : null;
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : isLoopbackHost(host)
        ? "http"
        : "https";

  return new URL(`${protocol}://${host}`);
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const metadataBase = requestOrigin(requestHeaders);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: siteTitle,
    description: siteDescription,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: metadataBase,
      siteName: siteTitle,
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "自动化基础学习台界面预览",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
