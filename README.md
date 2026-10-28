# Laila's Kitchen Website

Static website for Laila's Kitchen (Edmondson Park, NSW). It is deployed to Cloudflare Pages by a GitHub Actions workflow on every push to the `main` branch.

## Repository layout

```
.github/workflows/deploy.yml   Deployment workflow (Cloudflare Pages via wrangler-action)
site/                          Everything in this folder is published
  index.html                   Page content and structure
  assets/css/style.css         Styles (colours are defined at the top of the file)
  assets/js/main.js            Menu, prices, pickup rules, photo slider and order builder
  assets/img/                  Logo, icons, share image and hero photos
  _headers                     Cloudflare caching and security headers
  robots.txt
```

No build step is required. Only the `site/` folder is uploaded to Cloudflare.

## One-time setup

### 1. Create the Cloudflare Pages project

Create a Direct Upload project named `lailas-kitchen`, using either method:

- **Dashboard:** Workers & Pages → Create → Pages → Upload assets. Name the project `lailas-kitchen` and upload the `site` folder once.
- **Command line:** `npx wrangler pages project create lailas-kitchen --production-branch=main`

To use a different project name, create a repository variable named `CLOUDFLARE_PROJECT_NAME` (Settings → Secrets and variables → Actions → Variables) containing that name.

### 2. Create a Cloudflare API token

Cloudflare dashboard → My Profile → API Tokens → Create Token → Custom token:

- Permission: **Account → Cloudflare Pages → Edit**
- Account resources: your account

### 3. Find the Cloudflare account ID

The account ID is shown on the Workers & Pages overview page and on any zone's Overview page under **API**.

### 4. Add the GitHub repository secrets

GitHub repository → Settings → Secrets and variables → Actions → New repository secret:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | The token from step 2 |
| `CLOUDFLARE_ACCOUNT_ID` | The account ID from step 3 |

### 5. Deploy

Push to `main`. The workflow can also be run manually from the Actions tab (Run workflow). The site is published at `https://lailas-kitchen.pages.dev` unless a different project name is used.

### 6. Custom domain (optional)

Pages project → Custom domains → Set up a custom domain. After the domain is live, change the `og:image` value in `site/index.html` to the full address (for example `https://www.example.com.au/assets/img/og-image.jpg`) so Facebook and Messenger link previews show the photo.

## Routine updates

| Change | File and location |
|---|---|
| Menu items, sizes and prices | `site/assets/js/main.js` → `MENU` (catering menu) and `PARTY_MENU` (party catering menu) |
| Minimum order, first-order discount | `MIN_ORDER`, `FIRST_ORDER_OFF` in `main.js` (also update the text in `index.html`) |
| Party catering minimum number of people | `PARTY_MIN_PEOPLE` in `main.js` (also update the text in `index.html`) |
| Pickup days offered in the order form | `PICKUP_DAYS` in `main.js` (0 = Sunday … 6 = Saturday) |
| Order notice period | `NOTICE_DAYS` in `main.js` |
| Slider speed | `SLIDE_MS` in `main.js` (milliseconds) |
| Hero photos and captions | `site/assets/img/hero-*.jpg` and the `<figure class="slide">` blocks in `index.html` |
| Phone numbers, Facebook link | `index.html` (header, order slip, How to order, Contact) |

Hero photos should be landscape JPEGs about 1400 px wide and under 300 KB. If a stock photo is replaced with an original photo, remove its photographer from the footer credit line.

## Photo credits

Photos 2–5 are from Unsplash and are used under the Unsplash License:

- Kacchi biryani platter — Shourav Sheikh
- Beef curry — rawkkim
- Chicken curry — Dr Muhammad Amer
- Biryani bowl — Mario Raj

Photo 1 and the logo belong to Laila's Kitchen.
