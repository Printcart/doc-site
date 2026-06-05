---
sidebar_position: 4
title: AI Services (Preflight & Background Removal)
---

# AI Services

Printcart offers pay-per-token AI services that you can call directly from the REST API:

- **Background Removal** — remove the background from an image with AI.
- **Preflight AI** — check a print file's quality (DPI rating, bleed, colour, fonts) before production.

These endpoints live under the `/v1/services/*` prefix and are billed from your token **wallet** — there is no fixed fee, you only pay tokens when you use them.

## Authentication & billing

All AI Services endpoints use **account-level JWT auth** (the same Bearer token as `/account`):

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

| Service | Token cost |
|---|---|
| Background Removal | **150 tokens / image** |
| Preflight — DPI score | metered (lightweight) |
| Preflight — full check | metered per check |

If your wallet balance is too low, the API responds with **HTTP 402**:

```json
{
  "error": "INSUFFICIENT_TOKENS",
  "balance": 50,
  "shortfall": 100,
  "top_up_url": "https://app.printcart.com/payment?tab=buy"
}
```

Top up tokens from **Dashboard → Wallet & Billing → Buy tokens**.

---

## Background Removal

Removes the background from an image and returns a transparent (or white) PNG.

### Create a job — `POST /v1/services/bg-remove`

Background removal runs **asynchronously** to avoid request timeouts. Submitting a job returns immediately with `status: "processing"`; you then **poll** the job until it is `completed`.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `image_url` | string (URL) | yes | Source image (JPEG / PNG / WebP) |
| `subject_type` | string | no | `auto` (default), `person`, `product`, `logo`, `text`, `hair_heavy` |
| `edge_softness` | integer | no | `0`–`10` (0 = hard cut, 10 = feathered). Default `3` |
| `high_detail_mode` | boolean | no | `true` for fine hair / fur. Default `false` |
| `output_background` | string | no | `transparent` (default) or `white` |

```bash
curl -X POST https://api.printcart.com/v1/services/bg-remove \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/photo.jpg",
    "subject_type": "product",
    "output_background": "transparent"
  }'
```

**Response — `202 Accepted`**

```json
{
  "job_id": "JgSluQxRQ_mkvwpsGIOny",
  "status": "processing",
  "output_url": null,
  "tokens_deducted": 150,
  "wallet_transaction_id": "TX-00011",
  "provider": "self_hosted",
  "created_at": "2026-06-05T04:02:44.611Z"
}
```

> Tokens are deducted when the job is created. If processing fails, the tokens are automatically **refunded** and the job status becomes `failed`.

### Get a job — `GET /v1/services/bg-remove/{jobId}`

Poll this endpoint (e.g. every 2–3 seconds) until `status` is `completed` or `failed`. The `output_url` is a presigned link **valid for 24 hours**.

```bash
curl https://api.printcart.com/v1/services/bg-remove/JgSluQxRQ_mkvwpsGIOny \
  -H "Authorization: Bearer <access_token>"
```

**Response — `200 OK`**

```json
{
  "job_id": "JgSluQxRQ_mkvwpsGIOny",
  "status": "completed",
  "subject_type": "product",
  "edge_softness": 3,
  "high_detail_mode": false,
  "output_background": "transparent",
  "output_url": "https://.../output.png?X-Amz-...",
  "tokens_deducted": 150,
  "wallet_transaction_id": "TX-00011",
  "created_at": "2026-06-05T04:02:44.611Z",
  "completed_at": "2026-06-05T04:04:00.532Z",
  "error_message": null
}
```

`status` values: `pending` → `processing` → `completed` | `failed`.

> The first request after a period of inactivity may take up to ~75s (model cold-start); subsequent requests are much faster.

---

## Preflight AI

Validates a print file and returns DPI quality plus any issues found.

### Quick DPI score — `POST /v1/services/preflight/dpi-score`

A fast, file-free rating based on pixel dimensions and the selected canvas size. Fields are **camelCase**.

| Field | Type | Required | Description |
|---|---|---|---|
| `widthPx` | integer | yes | Image width in pixels |
| `heightPx` | integer | yes | Image height in pixels |
| `canvasWidthInches` | number | yes | Selected canvas width (inches) |
| `canvasHeightInches` | number | yes | Selected canvas height (inches) |
| `productType` | string | yes | `photo_on_canvas`, `poster`, `wallpaper`, `framed_print`, `wrapping_paper`, `stock_canvas` |

```bash
curl -X POST https://api.printcart.com/v1/services/preflight/dpi-score \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "widthPx": 4000,
    "heightPx": 3000,
    "canvasWidthInches": 30,
    "canvasHeightInches": 20,
    "productType": "photo_on_canvas"
  }'
```

**Response — `200 OK`**

```json
{
  "data": {
    "stars": 4,
    "label": "Good",
    "effectivePpi": 133,
    "minPpi": 100,
    "productType": "photo_on_canvas"
  }
}
```

### Full preflight check — `POST /v1/services/preflight/checks`

Runs a complete check on a file. Fields are **camelCase**.

| Field | Type | Required | Description |
|---|---|---|---|
| `designId` | string | yes | Any identifier you use to reference the design (1–200 chars) |
| `fileUrl` | string (URL) | yes | The print file to check |
| `fileType` | string | no | `jpeg`, `png`, `tiff`, `pdf` (auto-detected if omitted) |
| `productProfile` | object | no | `{ "requiredDpi": 300, "requiredColorMode": "cmyk", "bleedMm": 3 }` |
| `canvasWidthInches` / `canvasHeightInches` | number | no | Canvas size for DPI mapping |
| `productType` | string | no | Same enum as DPI score |

```bash
curl -X POST https://api.printcart.com/v1/services/preflight/checks \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "designId": "design_12345",
    "fileUrl": "https://example.com/artwork.pdf",
    "fileType": "pdf",
    "productProfile": { "requiredDpi": 300, "requiredColorMode": "cmyk", "bleedMm": 3 }
  }'
```

**Response — `201 Created`** returns a report object containing the resolved status and a list of `issues`.

### Other preflight endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/services/preflight/checks` | List recent reports |
| `GET` | `/v1/services/preflight/checks/{reportId}` | Get a report |
| `DELETE` | `/v1/services/preflight/checks/{reportId}` | Delete a report |
| `POST` | `/v1/services/preflight/ai-jobs` | Create an AI fix job from a report |
| `GET` | `/v1/services/preflight/ai-jobs/{jobId}` | Get an AI fix job |
| `POST` | `/v1/services/preflight/ai-jobs/{jobId}/approve` | Approve AI suggestions |
| `POST` | `/v1/services/preflight/ai-jobs/{jobId}/reject` | Reject AI suggestions |

---

## Using it from the dashboard

You can try both services without writing code in **Dashboard → API Services**:

- **Background Removal** — paste an image URL, choose options, and run.
- **Preflight AI** — enter dimensions (Quick DPI) or a file URL (Full check).

Token usage and history are shown on the API Services overview and in **Wallet & Billing → Transactions**.
