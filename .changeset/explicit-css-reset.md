---
"@microfronts/ui": minor
---

Move Preflight and global base rules out of automatic component CSS into the explicit @microfronts/ui/reset.css export. Page owners must import reset.css once; federated components must not import it.
