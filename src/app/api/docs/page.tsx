"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const spec = "/api/v1/docs";

  return (
    <div className="min-h-screen bg-background">
      <SwaggerUI url={spec} />
    </div>
  );
}
