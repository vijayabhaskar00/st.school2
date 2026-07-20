// Shared with next.config.ts so the GitHub Pages base path stays in sync
// between the build config and anything that needs to construct absolute
// asset URLs by hand (e.g. metadata icons, which don't inherit basePath).
export const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? "/st.school2";
