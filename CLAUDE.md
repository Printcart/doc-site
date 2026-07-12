# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc trong repo này.

## Tổng quan dự án

Site tài liệu cho **Printcart** (Web-to-print API), xây dựng bằng **Docusaurus 2.3.1** + **Redocusaurus** để render OpenAPI spec.

- Public API: `https://api.printcart.com/v1`
- Source OpenAPI: `api-data/printcart-api.yaml` (được render tại route `/rest-api-reference`)
- File `api-data/api.yaml` là spec mẫu cũ (Pet/store/user) — không render, không dùng.

## Commands

```bash
yarn            # install
yarn start      # dev server (hot reload)
yarn build      # static build -> build/
yarn serve      # serve build output
yarn clear      # clear docusaurus cache
yarn deploy     # deploy to gh-pages (cần GIT_USER, USE_SSH)
```

Không có test, không có linter. Node + Yarn classic (có `yarn.lock`).

## Cấu trúc thư mục

```
api-data/printcart-api.yaml   # OpenAPI spec chính (nguồn sự thật của /rest-api-reference)
api-data/api.yaml             # spec mẫu legacy, không dùng
components/CardGrid/          # shared component (dùng ngoài src/, import tương đối từ docs)
docs/
  api-reference/              # hướng dẫn API (intro, api-overview, webhooks)
  sdk-reference/              # design-tool-sdk, uploader-sdk
  users-manual/               # hướng dẫn Shop Owner (ảnh PNG đi kèm)
  dashboard/, dashboard-manual/, guides/, online-design/  # nội dung bổ sung
  welcome.md
src/
  components/HomepageFeatures.*
  css/custom.css
  pages/                      # index.md là trang chủ
static/                       # assets public (img/, ...)
blog/                         # blog Docusaurus mặc định
sidebars.js                   # khai báo sidebar user / apiReference / sdkReference
docusaurus.config.js          # config site + mount Redocusaurus cho printcart-api.yaml
backup/                       # file cũ (authentication.md) — không link vào sidebar
```

Ghi chú: `components/` nằm **ngoài** `src/`; các MDX import bằng đường dẫn tương đối (`../../components/CardGrid`). Đừng di chuyển mà không cập nhật import.

## Sidebar & routing

`sidebars.js` export 3 sidebar:
- `user` → nhóm "Shop Owner" (`users-manual/*`)
- `apiReference` → intro, api-overview, webhooks, + link tới `/rest-api-reference`
- `sdkReference` → intro, design-tool-sdk, uploader-sdk

Navbar (`docusaurus.config.js`) chỉ trỏ tới 3 doc IDs: `users-manual/get-started`, `api-reference/intro`, `sdk-reference/intro`. Thêm trang mới thì phải khai báo ở `sidebars.js` hoặc sẽ không xuất hiện.

`onBrokenLinks: "throw"` → link hỏng sẽ fail build. Khi đổi slug/filename, grep toàn repo để sửa hết cross-link trước khi commit.

## API Authentication (tóm tắt)

Spec khai báo 2 scheme:
- **BasicAuth** (HTTP basic): username + password, truy cập được toàn bộ endpoint. Dùng URL dạng `https://username:password@api.printcart.com/v1/...`.
- **UnAuthToken** (apiKey in header): header `X-PrintCart-Unauth-Token`, chỉ dùng cho endpoint public (lấy token từ Dashboard → Settings).

Rate limit: 120 req/phút. Pagination mặc định `limit=20`, max 100.

## REST API Endpoints (nguồn: `api-data/printcart-api.yaml`)

Server: `https://api.printcart.com/v1`. Liệt kê theo tag, format `METHOD path — summary`.

### Account
- `POST   /account` — Create Account
- `GET    /account` — Get Account Info *(BasicAuth)*
- `PUT    /account` — Update Account Details *(BasicAuth)*

### Store
- `POST   /stores` — Create Store
- `GET    /stores` — Get Store Info
- `PUT    /stores` — Update Store Details
- `DELETE /stores` — Delete a store
- `GET    /stores/store-details` — Get Store Details
- `PUT    /stores/token-revoke` — Renew UnAuth Token

### Product
- `POST   /products` — Create Product
- `GET    /products` — Get a list of products
- `GET    /products/{productId}` — Get Product Details
- `PUT    /products/{productId}` — Update Product Details
- `DELETE /products/{productId}` — Delete a product
- `POST   /products/batch` — Create batch products
- `PUT    /products/batch` — Update batch products
- `DELETE /products/batch` — Delete batch products
- `GET    /products/count` — Get a count of products
- `GET    /products/{productId}/designs` — Get a list of designs by product
- `GET    /products/{productId}/designs/count` — Get a count of designs by product
- `GET    /products/{productId}/sides` — Get a list of sides by product
- `GET    /products/{productId}/sides/count` — Get a count of sides by product

### Side
- `POST   /sides` — Create new product side
- `GET    /sides` — Get a list of product sides
- `GET    /sides/{sideId}` — Get product side details
- `PUT    /sides/{sideId}` — Update a product side details
- `DELETE /sides/{sideId}` — Delete a product side
- `POST   /sides/batch` — Create batch sides
- `PUT    /sides/batch` — Update batch sides
- `DELETE /sides/batch` — Delete batch sides
- `GET    /sides/{sideId}/templates` — Get a list of templates by side
- `GET    /sides/count` — Get a count of product sides

### Image
- `POST   /images` — Add new image
- `GET    /images` — Get a list of images
- `GET    /images/{imageId}` — Get image details
- `DELETE /images/{imageId}` — Delete a image
- `POST   /images/batch` — Add new batch images
- `GET    /images/count` — Get a count of images

### Clipart
- `POST   /cliparts` — Add new Clipart
- `GET    /cliparts` — Get a list of cliparts
- `GET    /cliparts/default` — Get a list of cliparts default
- `GET    /cliparts/{clipartId}` — Get clipart details
- `PUT    /cliparts/{clipartId}` — Update clipart details
- `DELETE /cliparts/{clipartId}` — Delete a clipart
- `POST   /clipart/batch` — Add new batch clipart *(lưu ý: path singular `/clipart/batch`, khác các tài nguyên khác)*
- `GET    /cliparts/count` — Get a count of cliparts
- `GET    /cliparts/default/count` — Get a count of cliparts default

### Design
- `POST   /designs` — Create new design
- `GET    /designs` — Get a list of designs
- `GET    /designs/{designId}` — Get design details
- `PUT    /designs/{designId}` — Update design details
- `DELETE /designs/{designId}` — Delete a design
- `POST   /designs/batch` — Create batch designs
- `PUT    /designs/batch` — Update batch designs
- `DELETE /designs/batch` — Delete batch designs
- `GET    /designs/{designId}/fonts` — Get list fonts layer by design
- `GET    /designs/images` — Get a list images design
- `GET    /designs/count` — Get a count of designs

### Template
- `POST   /templates` — Create new template
- `GET    /templates` — Get a list of templates
- `GET    /templates/template-default` — Get a list of templates default
- `GET    /templates/{templateId}` — Get template details
- `PUT    /templates/{templateId}` — Update template details
- `DELETE /templates/{templateId}` — Delete a template
- `POST   /templates/batch` — Create batch templates
- `PUT    /templates/batch` — Update batch templates
- `DELETE /templates/batch` — Delete batch templates
- `GET    /templates/{templateId}/fonts` — Get list fonts layer by template
- `GET    /templates/count` — Get a count of templates
- `GET    /templates/default/count` — Get a count of templates default

### Project
- `POST   /projects` — Create new project
- `GET    /projects` — Get a list of projects
- `GET    /projects/{projectId}` — Get project details
- `PUT    /projects/{projectId}` — Update project details
- `DELETE /projects/{projectId}` — Delete a project
- `POST   /projects/batch` — Create batch projects
- `PUT    /projects/batch` — Update batch projects
- `DELETE /projects/batch` — Delete batch projects
- `GET    /projects/{projectId}/designs` — Get a list of designs by project
- `GET    /projects/{projectId}/designs/count` — Get a count of designs by project
- `GET    /projects/{projectId}/products` — Get a list of products by project
- `GET    /projects/{projectId}/products/count` — Get a count of products by project
- `GET    /projects/count` — Get a count of projects

### Storage
- `POST   /storages` — Create new storage
- `GET    /storages` — Get a list of storages
- `GET    /storages/default` — Get a list of storages default
- `GET    /storages/{storageId}` — Get Storage details
- `PUT    /storages/{storageId}` — Update Storage details
- `GET    /storages/count` — Get a count of Storages

### Font
- `POST   /fonts` — Add new font
- `GET    /fonts` — Get a list of fonts
- `GET    /fonts/default` — Get a list of fonts default
- `GET    /fonts/{fontId}` — Get font details
- `PUT    /fonts/{fontId}` — Update font details
- `DELETE /fonts/{fontId}` — Delete font
- `GET    /fonts/count` — Get a count of fonts
- `GET    /fonts/default/count` — Get a count of fonts default

### Webhook
- `POST   /webhooks` — Create new webhook
- `GET    /webhooks` — Get a list of webhooks
- `GET    /webhooks/{webhookId}` — Get webhook details
- `PUT    /webhooks/{webhookId}` — Update webhook details
- `DELETE /webhooks/{webhookId}` — Delete a webhook

### Clipart Storage
- `POST   /clipart-storages` — Create new Clipart - Storage
- `GET    /clipart-storages` — Get a list of Cliparts - Storages
- `GET    /clipart-storages/default` — Get a list of Cliparts - Storages default
- `DELETE /clipart-storages/{storageId}` — Delete a Clipart - Storage
- `GET    /clipart-storages/{storageId}/cliparts` — Get a list of Cliparts by Storage
- `GET    /clipart-storages/{storageId}/cliparts-default` — Get a list of Cliparts by Storage default
- `GET    /clipart-storages/{clipartId}/storages` — Get a list of Storages by Clipart
- `GET    /clipart-storages/{clipartId}/storages-default` — Get a list of Storages by Clipart default
- `GET    /clipart-storages/{storageId}/cliparts/count` — Get a count of cliparts storages
- `GET    /clipart-storages/{storageId}/cliparts-default/count` — Get a count of cliparts storages default

### Project Folder
- `POST   /project-folder` — Create new Project Folder
- `GET    /project-folder` — Get a list of Projects Folders
- `DELETE /project-folder/{storageId}` — Delete a Project Folder
- `GET    /project-folder/{storageId}/projects` — Get a list of Projects by Folder
- `GET    /project-folder/{projectId}/folders` — Get a list of Folders by Project

### 3D Preview
- `GET    /products/{productId}/3d-config` — Get product 3D preview config *(BasicAuth hoặc UnAuthToken)*
- `POST   /products/{productId}/3d-profiles` — Create product 3D profile *(BasicAuth)*
- `PUT    /products/{productId}/3d-profiles/{profileId}` — Update product 3D profile *(BasicAuth)*
- `DELETE /products/{productId}/3d-profiles/{profileId}` — Delete product 3D profile *(BasicAuth)*
- `POST   /3d/edge-preview` — Render a 3D edge preview *(BasicAuth hoặc UnAuthToken; yêu cầu Pro plan; rate limit 10 req/phút/store; cache theo content hash, `reset: true` để render lại)*
- `POST   /designs/{designId}/generate/3d-preview` — Generate 3D preview cho design đã lưu *(BasicAuth; dùng `original_side` snapshot; yêu cầu Pro plan; rate limit 10 req/phút/store)*

## Webhook events

Định nghĩa trong `docs/api-reference/webhooks.mdx` (file rất lớn, ~260 KB — đọc theo `offset/limit`). Chữ ký xác thực: `base64_encode(sid:secret)` — lấy `sid`/`secret` khi tạo store. Topic chính: Designs, Projects, … (mỗi topic có payload JSON mẫu trong MDX).

## SDKs

- `@printcart/design-tool-sdk` — cần `token` (UnAuth) + `productId`.
- `@printcart/uploader-sdk` — cần `token` (UnAuth) + `sideId`.

## Quy ước khi sửa

- **Sửa API reference**: chỉnh `api-data/printcart-api.yaml`. Redocusaurus tự render lại khi `yarn start`. Giữ operationId ổn định — nhiều chỗ trong `docs/` deep-link tới `/rest-api-reference#tag/<Tag>/operation/<id>`.
- **Thêm trang doc**: tạo file trong `docs/<section>/`, thêm vào `sidebars.js`, đảm bảo front-matter có `title` (và `sidebar_position` nếu cần).
- **Link nội bộ**: dùng đường dẫn relative tới file `.md`/`.mdx` hoặc slug tuyệt đối; `onBrokenLinks: "throw"` sẽ chặn build nếu gãy.
- **Không chạm** `api-data/api.yaml` (spec Pet legacy, không mount).
- **Không commit** file build (`build/`, `.docusaurus/`) hay `node_modules/`.

## Branch hiện tại

Đang làm việc trên `claude/create-claude-file-api-0p5QL`. Push về chính branch này.
