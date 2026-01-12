import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@qdrant/js-client-grpc", "minio"],
};

export default nextConfig;
