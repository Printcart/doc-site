---
sidebar_position: 5
title: Studio AI (Face Crop, Bulk QR & Face Matching)
---

# Studio AI

Printcart Studio brings the **Auto-Headshot** engine into the dashboard as pay-per-token services, for both print-on-demand merchants and school / corporate / sports photography studios:

- **Face Crop** — detect a face and crop it to an ICP preset, with optional AI sharpening (Real-ESRGAN).
- **Bulk QR** — generate a printable PDF of QR cards from a subject roster.
- **AI Face Matching** — match a batch of photos to known subjects using face embeddings.

These endpoints live under the `/v1/services/studio/*` prefix and are billed from your token **wallet** — the same wallet used by Background Removal and Preflight.

## Authentication & billing

All Studio endpoints use **account-level JWT auth** (the same Bearer token as `/account`):

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Token cost per operation:

| Action | Token cost |
|---|---|
| Face Crop (no enhance) | **2 tokens / image** |
| Face Crop + sharpen (Real-ESRGAN) | **6 tokens / image** |
| Bulk QR | **1 token / subject** |
| AI Face Matching | **6 tokens / file** (failed files are refunded) |
| Reference embeddings (Matching step 1) | free |
| Job polling | free |

If your wallet balance is too low, the API responds with **HTTP 402**:

```json
{
  "error": "INSUFFICIENT_TOKENS",
  "balance": 4,
  "shortfall": 2,
  "top_up_url": "https://app.printcart.com/payment?tab=buy"
}
```

Tokens are deducted **before** the request is forwarded to the engine. If the engine call fails, the tokens are automatically **refunded**.

:::note Internal credential (`X-API-Key`)
API consumers authenticate with the normal Printcart Bearer token — you do **not** send an `X-API-Key`. That key is an **internal** credential the Printcart backend uses to reach the Headshot engine. Operators configure it once on the server with `php artisan service:set-outbound headshot <base_url> <X-API-Key>`. The key itself is issued by the Headshot service (`REQUIRE_API_KEY`); when Headshot runs with `REQUIRE_API_KEY=false`, any value works and requests run under its `DEFAULT_USER_ID`.
:::

---

## Face Crop

Detects a face, crops it to the chosen ICP preset, and (optionally) sharpens it. `icp_type` ∈ `school | corporate | sports | childcare`.

### From image URL(s) — `POST /v1/services/studio/face-crop`

| Field | Type | Required | Description |
|---|---|---|---|
| `image_url` | string (URL) | one of | Single source image |
| `image_urls` | string[] | one of | Multiple source images |
| `icp_type` | string | yes | `school`, `corporate`, `sports`, `childcare` |
| `enhance` | boolean | no | `true` to sharpen with Real-ESRGAN (6 tokens/image) |

```bash
curl -X POST https://api.printcart.com/v1/services/studio/face-crop \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "image_urls": ["https://example.com/student.jpg"],
    "icp_type": "school",
    "enhance": false
  }'
```

**Response — `200 OK`**

```json
{
  "results": [
    {
      "filename": "student.jpg",
      "icp_type": "school",
      "face_box": { "x": 120, "y": 80, "w": 300, "h": 300 },
      "output_urls": {
        "original": "https://.../student_orig.jpg",
        "medium": "https://.../student_md.jpg"
      }
    }
  ],
  "tokens_deducted": 2,
  "wallet_transaction_id": "TX-00021"
}
```

### From file upload — `POST /v1/services/studio/face-crop/upload`

Multipart form. Send one or more `file[]` fields plus `icp_type` and optional `enhance`. Large batches are processed **asynchronously** and return `202` with a `task_id`.

```bash
curl -X POST https://api.printcart.com/v1/services/studio/face-crop/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "file[]=@photo1.jpg" \
  -F "file[]=@photo2.jpg" \
  -F "icp_type=school" \
  -F "enhance=false"
```

**Response (async batch) — `202 Accepted`**

```json
{ "task_id": "c1a2b3d4-...", "status": "queued", "total_files": 120, "tokens_deducted": 240, "wallet_transaction_id": "TX-00022" }
```

### Poll a batch job — `GET /v1/services/studio/jobs/{taskId}`

```json
{ "status": "running", "progress": { "current": 42, "total": 120, "percentage": 35.0 } }
```

`status`: `queued` → `running` → `completed` (with `results`) | `failed`.

---

## Bulk QR

Generates a printable PDF of QR cards from a roster and uploads it to storage. `layout` ∈ `4up` (basic) | `single` | `9up` (Premium). Cost: **1 token / subject**.

### `POST /v1/services/studio/qr/generate`

| Field | Type | Required | Description |
|---|---|---|---|
| `job_id` | string | yes | Your job reference |
| `school_name` | string | no | Printed on the cards |
| `layout` | string | no | `4up` (default), `single`, `9up` |
| `logo_url` | string (URL) | no | Custom logo (Premium) |
| `subjects` | array | yes | 1–2000 items: `{ student_id, name, class_name? }` |

```bash
curl -X POST https://api.printcart.com/v1/services/studio/qr/generate \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "JOB-2026-001",
    "school_name": "Springfield Elementary",
    "layout": "4up",
    "subjects": [
      { "student_id": "STU-001", "name": "An Nguyen", "class_name": "5A" },
      { "student_id": "STU-002", "name": "Binh Tran", "class_name": "5A" }
    ]
  }'
```

**Response — `200 OK`**

```json
{
  "job_id": "JOB-2026-001",
  "total_subjects": 2,
  "pdf_url": "https://.../qr_cards_JOB-2026-001_4up.pdf",
  "tokens_deducted": 2,
  "wallet_transaction_id": "TX-00023"
}
```

> `single` / `9up` layouts and `logo_url` require a Premium plan (otherwise `402`).

---

## AI Face Matching

Matches a batch of photos against reference faces. Two steps: build reference embeddings (free), then run a match job (6 tokens/file).

### 1. Build references — `POST /v1/services/studio/matching/references`

Creates embeddings for the agency's subjects that have a `reference_photo_url`. Free of tokens. ≥ 20 subjects runs asynchronously.

```bash
curl -X POST https://api.printcart.com/v1/services/studio/matching/references \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "agency_id": 1 }'
```

```json
{ "status": "completed", "agency_id": 1, "embeddings_created": 12 }
```

### 2. Run a match job — `POST /v1/services/studio/matching/match-job`

Provide `job_id` **or** `file_ids`. Tokens are deducted for every file (`6 × total_files`); failed files are refunded by the engine.

| Field | Type | Required | Description |
|---|---|---|---|
| `agency_id` | integer | yes | Agency that owns the references |
| `job_id` | integer | one of | Match all files in this job |
| `file_ids` | integer[] | one of | Match specific files |
| `threshold` | number | no | `0.50`–`0.99`, default `0.85` |

```bash
curl -X POST https://api.printcart.com/v1/services/studio/matching/match-job \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "agency_id": 1, "job_id": 10, "threshold": 0.85 }'
```

**Response — `200 OK`**

```json
{
  "match_job_id": 7,
  "task_id": "def-456",
  "total_files": 120,
  "tokens_deducted": 720,
  "wallet_transaction_id": "TX-00024"
}
```

> A match job needs reference embeddings first (`400` otherwise). Missing both `job_id` and `file_ids` → `422`.

### 3. Job status — `GET /v1/services/studio/matching/jobs/{matchJobId}`

```json
{ "id": 7, "status": "completed", "total_files": 120, "matched": 102, "needs_review": 12, "unmatched": 6 }
```

### Pickers — list & create agencies / jobs (free)

Agencies and jobs are **scoped to your account** (the gateway passes your Printcart user id). Use these to populate dropdowns and to create entities directly from the dashboard:

| Method | Path | Body / Returns |
|---|---|---|
| `GET` | `/v1/services/studio/agencies` | → `{ "agencies": [ { "id": 1, "name": "...", "agency_type": "school" } ] }` |
| `POST` | `/v1/services/studio/agencies` | `{ "name": "...", "agency_type": "school\|sports\|corporate\|yearbook\|childcare\|designer" }` |
| `GET` | `/v1/services/studio/agencies/{agencyId}/jobs` | → `{ "jobs": [ { "id": 10, "name": "...", "status": "draft" } ] }` |
| `POST` | `/v1/services/studio/agencies/{agencyId}/jobs` | `{ "name": "...", "icp_type": "school\|corporate\|sports\|childcare", "status?": "draft" }` |

---

## Using it from the dashboard

Try every Studio service without writing code in **Dashboard → API Services**:

- **Face Crop** — upload images or paste URLs, pick an ICP, toggle sharpening, and run.
- **Bulk QR** — paste a roster, choose a layout, and download the QR PDF.
- **AI Face Matching** — build references for an agency, then run a match job and review results.

Token usage and history appear in **Wallet & Billing → Transactions**.
