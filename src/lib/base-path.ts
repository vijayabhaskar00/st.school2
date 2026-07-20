// Shared with next.config.ts so the GitHub Pages base path stays in sync
// between the build config and anything that needs to construct absolute
// asset URLs by hand (e.g. metadata icons, which don't inherit basePath).
export const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? "/st.school2";

// "/" is the documented way to opt out of a base path (see next.config.ts),
// so anything hand-building "${assetBasePath}/foo" should use this instead
// of `basePath` directly — otherwise "/" + "/foo" produces "//foo", which
// browsers parse as a protocol-relative URL (host "foo") instead of a path.
export const assetBasePath = basePath === "/" ? "" : basePath;
