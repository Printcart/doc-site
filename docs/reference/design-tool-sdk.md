---
title: Design Tool SDK
---

## Installation

Using npm:

```bash
npm install @printcart/design-tool-sdk
```

Using yarn:

```bash
yarn add @printcart/design-tool-sdk
```

Using unpkg:

```
<script src="https://unpkg.com/@printcart/design-tool-sdk"></script>
```

## Usage

Using package:

```js
import PrintcartDesigner from "@printcart/design-tool-sdk";

const designer = new PrintcartDesigner({
  token: "your-printcart-unauth-token",
  productId: "your-product-id",
  options: {},
});
```

Using CDN-hosted copy of the library:

```html
<script defer src="https://unpkg.com/@printcart/design-tool-sdk@1.4.1/dist/main.js"></script>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const designer = new PrintcartDesigner({
      token: "your-printcart-unauth-token",
      productId: "your-product-id",
      options: {},
    });
  });
</script>
```

## Options

### `token`

- Required
- Type: `string`

Your Printcart Unauth Token. You can get your token from your [Printcart Dashboard](https://dashboard.printcart.com/settings).

### `productId`

- Required
- Type: `string`

The Product ID that you want to assign the designer to.

### `options`

- Optional
- Type: `object | undefined`

Provide options to config the Designer UI and locale.

**Parameters**

- `processBtnBgColor`: _string | null_ - Change the **Process** button background color.
- `logoUrl`: _string | null_ - Add your branding logo to Designer.

## Methods

### `render`

Render and display Designer.

**Example**

```js
const designer = new PrintcartDesigner({
  token: "your-printcart-unauth-token",
  productId: "your-product-id",
});

const openDesignerButton = document.getElementById("your-button-id");

openDesignerButton.addEventListener("click", function () {
  designer.render();
});
```

### `close`

Unmount and hide Designer.

**Example**

```js
designer.close();
```

### `on`

Subscribe to a Design Tool event. See [below](#events) for full list of events.

**Example**

```js
designer.on("upload-success", callback);
```

## Events

Exposed events that you can subscribe in your app:

### `rendered`

Fired when Designer finish render and displayed to the screen.

**Example**

```js
designer.on("rendered", function () {
  console.log("Designer opened.");
});
```

### `closed`

Fired when Designer closed.

**Example**

```js
designer.on("closed", function () {
  console.log("Designer closed.");
});
```

### `render-finish`

Fired when Designer fully loaded.

**Example**

```js
designer.on("render-finish", function () {
  console.log("Designer rendered.");
});
```

### `upload-success`

**Parameters**:

- `response` - Printcart API Response object for design upload.

Fired when all upload success.

**Example**

```js
designer.on("upload-success", function (response) {
  console.log("Response:", response);
});
```

### `upload-error`

**Parameters**:

- `error` - The error object from Printcart API Response.

**Example**

```js
designer.on("upload-error", function (error) {
  console.log(error);
});
```

### `edit-success`

**Parameters**:

- `response` - Printcart API Response object for design edit.

**Example**

```js
designer.on("edit-success", function (response) {
  console.log("Response:", response);
});
```

### `edit`

Fired when Designer enter edit mode.

**Example**

```js
designer.on("edit", function () {
  console.log("Designer on edit mode");
});
```
