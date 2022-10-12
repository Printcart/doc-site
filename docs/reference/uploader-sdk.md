---
title: Uploader SDK
---

## Installation

Using npm:

```bash
npm install @printcart/uploader-sdk
```

Using yarn:

```bash
yarn add @printcart/uploader-sdk
```

Using unpkg:

```
<script src="https://unpkg.com/@printcart/uploader-sdk@1.0.7/dist/main.js"></script>
```

## Usage

Using package:

```js
import PrintcartUploader from "@printcart/uploader-sdk";

const designer = new PrintcartUploader({
  token: "your-printcart-unauth-token",
  productId: "your-product-id",
  options: {},
});
```

Using CDN-hosted copy of the library:

```html
<script defer src="https://unpkg.com/@printcart/uploader-sdk@1.0.7/dist/main.js"></script>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const uploader = new PrintcartUploader({
      token: "your-printcart-unauth-token",
      sideId: "your-side-id",
      locale: {},
    });
  });
</script>
```

## Parameters

### `token` {#token}

- Required
- Type: `string`

Your Printcart Unauth Token. You can get your token from your [Printcart Dashboard](https://dashboard.printcart.com/settings).

### `sideId` {#sideId}

- Required
- Type: `string`

The Product Side ID that you want to assign the design uploaded to.

### `locale` {#locale}

- Optional
- Type: `object | undefined`

Key - value pairs of text to override the Uploader's default text labels. Default values:

<!-- TODO: drop target over -->

```json
{
  "heading": "Design Upload",
  "dropTarget": "Drag and Drop your design here",
  "divider": "Or",
  "button": "Browse"
}
```

## Methods

### `open`

Render and display Uploader.

**Example**

```js
const uploader = new PrintcartUploader({
  token: "your-printcart-unauth-token",
  sideId: "your-side-id",
});

const openUploaderButton = document.getElementById("your-button-id");

openUploaderButton.addEventListener("click", function () {
  uploader.open();
});
```

### `close`

Unmount and hide Uploader.

**Example**

```js
uploader.close();
```

### `locale`

Get all localization text labels.

**Example**

```js
var text = uploader.locale();

console.log(text);

// {
//   "heading": "Design Upload",
//   "dropTarget": "Drag and Drop your design here",
//   "divider": "Or",
//   "button": "Browse"
// }
```

### `on`

Subscribe to an Uploader event. See below for full list of events.

```js
uploader.on("event", actionCallback);
```

## Events

Exposed events that you can subscribe in your app:

### `open`

Fired when Uploader render finish and displayed to the screen.

**Example**

```js
uploader.on("open", function () {
  console.log("Uploader opened.");
});
```

### `onload`

Fired when Uploader render finish but before displayed to the screen.

**Example**

```js
uploader.on("onload", function () {
  console.log("Uploader rendered.");
});
```

### `upload-success`

**Parameters**:

- `response` - Printcart API Response object.
- `file` - The file object for the file whose uploaded.

Fired when all upload success.

**Example**

```js
uploader.on("upload-success", function (response, file) {
  console.log("Response:", response);
  console.log("File:", file);
});
```

### `upload-error`

**Parameters**:

- `error` - The error object from Printcart API Response.

**Example**

```js
uploader.on("upload-error", function (error) {
  console.log(error);
});
```
