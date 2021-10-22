---
sidebar_position: 100
---

# Authentication

To keep your data on Printcart safe and secure, all integrations must authenticate when making API requests.
This guide introduces the different methods of authenticating and authorizing integration with Printcart's platform.

## Types of authentication
- API Key
- Basic HTTP Authentication

## API Key

<!-- In order to integrate Printcart Design tool with your Printcart data, you will need to use our API Key. -->

In order to work with your Printcart data, Printcart Design Tool need to use your API Key. You can get API key at your Printcart dashboard > Settings.

Use for public request and Design tool

- Navigate to Settings
- Copy API Key

## Basic HTTP Authentication

Printcart REST API support Basic HTTP Authentication to allows you to protect the URLs on your web server so that only you can access them. 

:::info
This authentication type represent your Printcart dashboard admin privileges and can request to all Printcart REST API endpoints, so it meant to use in server side only. 
:::

To keep them secure, do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

In order to authenticate with HTTP, you may provide a username and password with the following URL format:

```
https://username:password@api.printcart.com/v1/your_desired_path
```

