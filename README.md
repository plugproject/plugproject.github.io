# Plug landing page

A minimal, dependency-free landing page for [Plug](https://github.com/plugproject/plug).

## Preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173>. The site is static HTML, CSS, and JavaScript; no build
step, external fonts, analytics, or third-party scripts are required. The root
`index.html` and `.nojekyll` are ready for GitHub Pages.

## Contents

- A business-requirements-first introduction and an eight-second workflow
  slideshow with pause, previous/next, tabs, and keyboard controls.
- A four-step diagram from vendor endpoints and edge-level QoS to an agent-readable
  system design.
- A workspace-spec / coding-agent workflow diagram.
- Verified source setup instructions and contribution entry points.
- A self-contained workflow guide at `guide.html`; navigation does not depend on
  the source repository, which returns 404 to visitors without access.
- Responsive layouts, keyboard-operated tabs, reduced-motion support, and a copy
  button with a manual-copy fallback. The slideshow pauses on hover, keyboard
  interaction, a hidden page, or leaving the viewport. Reduced-motion preferences
  disable autoplay by default and suppress transitions.

The diagrams are explanatory illustrations, not live engine output. Copy reflects
the Plug repository at commit `81c8de5934a8578b4c5cd245e05774915eba0f44`.
No npm installation or production-readiness claim is made.

## Companion README update

The Plug engine is a separate repository. Its updated README is included at
[`companion-changes/plug.README.md`](companion-changes/plug.README.md) for review,
with an apply-ready [`plug-readme.patch`](companion-changes/plug-readme.patch).
Relative links in the companion README are intended for the Plug repository.
The patch adds three Mermaid diagrams: workflow requirements, derivation, and
agent workflow. It also updates the introduction to explain business requirements,
endpoint nodes, per-edge QoS, and MCP-based IDE context. It distinguishes generated
agent guidance from automatic skill-package installation.

From a checkout of `plugproject/plug`, apply the patch with:

```sh
git apply --check /path/to/plugproject.github.io/companion-changes/plug-readme.patch
git apply /path/to/plugproject.github.io/companion-changes/plug-readme.patch
```

The companion patch is retained here for application to the separate Plug engine
repository. Pushing this landing-page repository does not update that repository.
