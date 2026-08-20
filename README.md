# HUEVOKE — GitHub Pages website

A no-build static website for HUEVOKE using HTML, CSS, GSAP and the PNG visuals supplied in ChatGPT.

## What is already included

- Cinematic homepage with scroll-driven 2.5D motion
- FORM and ELEMENTS collection pages
- Product detail template
- Size selection
- Pre-filled WhatsApp enquiry/order CTA
- Studio and Bespoke pages
- Responsive mobile layout
- `CNAME` prepared for `huevoke.com`
- GitHub Pages friendly — no npm/build step required

## Run locally

The site can be opened directly, but a small local server is better.

If Python is installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Put it on GitHub Pages

1. Create a new GitHub repository, e.g. `huevoke`.
2. Upload the contents of this folder to the repository root.
3. In GitHub: **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save. GitHub will publish the site.
7. In the Pages screen, set the custom domain to `huevoke.com`.
8. Update the DNS records at the company where the domain is registered using the exact records GitHub shows for the custom domain.
9. Enable **Enforce HTTPS** after DNS propagation.

## Product images still needed

The current conversation included usable visuals for:
- Contour Flow
- Tidal Landscape
- Lotus Bloom
- collection/macro imagery

The following objects currently show a tasteful placeholder until you add their PNGs:
- Erosion
- Balance
- Eclipse

`Fluid Motion` currently uses the terracotta abstract detail supplied in the conversation.

To add/replace an image:

1. Put the PNG in `assets/images/`.
2. Open `assets/js/products.js`.
3. Set the product's `hero` value, for example:

```js
hero:"assets/images/erosion.png"
```

4. Add extra gallery images in the `gallery` array.

## WhatsApp

Current order/enquiry number:
`+91 93534 17406`

It is wired into the product page and enquiry CTAs.

## Important note about 3D

This version uses the PNG files as 2.5D/cinematic visual layers. It creates depth through perspective, scale, parallax and pinned scroll scenes.

For true free-rotation 3D later, replace selected hero scenes with `.glb`/`.gltf` models and add Three.js / React Three Fiber.
