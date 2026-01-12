# API Documentation

This project uses OpenAPI 3.0 specification with auto-generated documentation from Zod schemas.

## Accessing Documentation

### Swagger UI (Interactive)
```
http://localhost:3000/api/docs
```

### OpenAPI JSON
```
http://localhost:3000/api/v1/docs
```

## How It Works

### Architecture

1. **Schema Definition** (`src/lib/openapi/schemas/`)
   - Define Zod schemas for each endpoint
   - Register routes with metadata

2. **Registry** (`src/lib/openapi/registry.ts`)
   - Central registry for all API schemas
   - Generates OpenAPI document on request

3. **Documentation Endpoints**
   - `GET /api/v1/docs` - Returns OpenAPI JSON
   - `GET /api/docs` - Swagger UI interface

### Adding a New API Route

1. Define Zod schemas in `src/lib/openapi/schemas/<module>.ts`

```typescript
import { z } from "zod";

export const myRequestSchema = z.object({
    param1: z.string(),
    param2: z.number(),
});

export const myResponseSchema = z.object({
    id: z.string(),
    result: z.string(),
});
```

2. Register the route in `src/lib/openapi/schemas/routes.ts`

```typescript
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { registry } from "../registry";
import { myRequestSchema, myResponseSchema } from "./my-module";

extendZodWithOpenApi(z);

registry.registerPath({
    method: "post",
    path: "/api/v1/my-endpoint",
    summary: "My endpoint description",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: myRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: myResponseSchema,
                },
            },
        },
    },
    tags: ["MyModule"],
});
```

3. Validate requests in your API route using the same schema

```typescript
import { myRequestSchema } from "@/lib/openapi/schemas/my-module";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = myRequestSchema.parse(body);
        
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response(
                JSON.stringify({
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid request body",
                        details: String(error),
                    },
                }),
                { status: 400 }
            );
        }
    }
}
```

## Packages Used

- `@asteasolutions/zod-to-openapi` - Generate OpenAPI from Zod schemas
- `swagger-ui-react` - Interactive API documentation UI
