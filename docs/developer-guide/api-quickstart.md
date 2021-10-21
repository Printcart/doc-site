---
sidebar_position: 2
---

# Printcart API

Printcart API is a [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer) that can be used to interact with data from your Printcart account. The Printcart API uses predictable resource-oriented URLs, standard HTTP verbs and response codes, and accepts and returns JSON-encoded request and response bodies.

## Authentication

To keep your data on Printcart safe and secure, all integrations must authenticate when making API requests.
This guide introduces the different methods of authenticating and authorizing integration with Printcart API.

There are 2 types of authentication in Printcart API:
- Basic HTTP Authentication
- API Key

### Basic HTTP Authentication

This authentication type represents your Printcart dashboard admin privileges and can request to all Printcart API endpoints, so it is meant to use on server side only. 

:::info
To keep them secure, do not share your username and password in publicly accessible areas such as GitHub, client-side code, and so forth.
:::

To authenticate with HTTP, you may provide a username and password with the following URL format:

```
https://username:password@api.printcart.com/v1/your_desired_path
```

### API Key

Some Printcart API endpoints don't need your username and password to authenticate. Those endpoints only interact with your public data so the code can be shared publicly.

To request to those endpoints, you only need to send `API Key` in the `Authorization` header:

```
Authorization: Bearer <token>
```

In order to get your API key, please copy the `API Key` at this [link](https://dashboard.printcart.com/settings).

![Get Printcart API Key](/img/get-api-key.png)

Check our [API Reference](/rest-api-reference) for all endpoints that can be authenticated with API Key.

## Status codes

A code in the range of 2xx indicates success, a code in the range of 4xx indicates there was a problem with the arguments provided (e.g., a required field was missing) or authentication problems, and a code in the range of 5xx indicates an error occurred with Printcart's servers.

## Pagination

When you make a request to an endpoint that supports paginated results, you can set the number of results to return per page using the `limit` parameter. If you don't specify a `limit`, then the endpoint will return 20 results at maximum.

The following example request asks the product endpoint for all products, with a limit of 10 products per page of results:

**Request**
```
GET https://api.printcart.com/v1/products?limit=10
```

**Response**
<!-- TODO: fix links -->
```
{
    "data": [
        {
            "id": "c6acb889-88d5-3410-9431-d64a3719c7ac",
            ...
        },
        {
            "id": "962af342-a2c9-4665-bb5d-cb208258d958",
            ...
        },
        ...
    ],
    "links": {
        "first": null,
        "last": null,
        "prev": null,
        "next": null
    },
    "meta": {
        "path": "https://api.printcart.com/products/4419934f-8e1b-4cf0-b432-01ef9258a812",
        "per_page": 10
    },
    "message": "Retrieved successfully"
}
```

:::note
Printcart allows a maximum of 100 items per request
:::

## Query parameters

Almost all endpoints accept optional parameters which can be passed as a HTTP query string parameter, e.g. `GET /project?status=completed&sortBy=created_date`. All parameters are documented along with each endpoint.

## API limit rate

To ensure our platform remains stable and fair for everyone, all Printcart API endpoints are rate-limited. You can make 120 requests per minute in all of Printcart API endpoints.

If you reach the rate limit, you will need to wait for at least 30 seconds to request more endpoint data. Please make sure your application is aware of this limit and make requests according to it.

## API Reference

Please follow [this link](/rest-api-reference) to detailed API Reference.
