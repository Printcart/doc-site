# Integrations
Printcart compatible the most ecommerce platforms. This document will guide you How to setup Printcart for each other platforms.

## Shopify

**How to set up and use on Shopify:**

<iframe width="854" height="480" src="https://www.youtube.com/embed/Vbf6AfVwqOM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## WordPress
<div align="center">**Coming Soon**</div>

## Magento
### How to install & upgrade Printcart_Design

#### 1. Install via composer (recommend)

We recommend you to install Printcart_Design module via composer. It is easy to install, update and maintaince.

Run the following command in Magento 2 root folder.

**1.1 Install**

```
composer require printcart/magento-integration
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy
```

**1.2 Upgrade**

```
composer update printcart/magento-integration
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy
```

Run compile if your store in Product mode:

```
php bin/magento setup:di:compile
```

#### 2. Copy and paste

If you don't want to install via composer, you can use this way. 

- Download [the latest version here](https://github.com/Printcart/magento-integration/archive/main.zip) 
- Extract `main.zip` file to `app/code/Printcart/Design` ; You should create a folder path `app/code/Printcart/Design` if not exist.
- Go to Magento root folder and run upgrade command line to install `Printcart_Design`:

```
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy
```
### How to integrate Printcart API to Magento (Adobe Commerce) website

<iframe width="854" height="480" src="https://www.youtube.com/embed/5Q5igif_gks" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
