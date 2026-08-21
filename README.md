# HUEVOKE V6 — Scroll-Lock Storytelling Build

This is a FULL upload-ready GitHub Pages repository.

## What changed
- Removed the previous 800vh / 400vh sticky scroll canvases that caused giant blank spaces.
- FORM and Lotus Bloom are now each exactly one viewport high.
- When FORM enters the viewport, normal page scrolling is temporarily locked.
- Mouse wheel / trackpad / keyboard / swipe / drag advances the FORM objects internally.
- After all 8 FORM objects are completed, one additional forward gesture releases the page to Lotus Bloom.
- Lotus Bloom uses the same lock behaviour across its 4 wall-to-macro stages.
- Reverse scroll / swipe steps backward.
- Dragging works anywhere inside the active section.
- Cursor changes to grab/grabbing while the story is active.
- Laptop and mobile are supported.
- No intentional blank spacer blocks between hero → FORM → Lotus → CTA.

## Upload
Delete current website files in the GitHub repo root, then upload the CONTENTS of this folder to the repo root.
Keep `.nojekyll` and `CNAME` in the root.
