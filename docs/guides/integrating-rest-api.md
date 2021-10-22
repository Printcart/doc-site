---
sidebar_position: 3
---

# Integrating a online store to Printcart REST API

Import data from online to Printcart and sync

## Import via Rest API

### Authentication

### Products

`POST https://printcart.com/api/v1/products/batch`

### Customers

`POST https://printcart.com/api/v1/customers/batch`

### Note

Note about API Limit

## Import via Printcart Console

- Create customers individually
[Create customers via Printcart Console]
- Batch import customers
[Batch import customers via Printcart Console]

## Sync Printcart with online store

Utilize webhook and Rest API to sync Printcart account with online store.

## Config product to integrate Design tool

## Query designs by customer

### Authenticated Customer

`GET https://printcart.com/api/v1/customers/{customer_id}/designs`

### Unauthenticated Customer

Create `storage_id` with name equal to customer's session id. Then when customer log in, attach customer to storage

`GET https://printcart.com/api/v1/storage/{storage_id}`
