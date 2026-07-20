import type { NextConfig } from "next";
import { basePath } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath && basePath !== "/"
    ? { basePath, assetPrefix: basePath }
    : {}),
};

export default nextConfig;
