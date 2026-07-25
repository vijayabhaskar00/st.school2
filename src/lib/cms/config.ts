// Fixed repo identity — this really won't change. The target branch is
// runtime-configurable from the admin login screen instead of hardcoded:
// this session has treated `claude/stschool-website-redesign-aio5tq` as
// "live" throughout, but whoever operates the CMS long-term may eventually
// point it at `main` once this branch merges, without needing a code change
// to do so.
export const CMS_REPO_OWNER = "vijayabhaskar00";
export const CMS_REPO_NAME = "st.school2";
export const CMS_DEFAULT_BRANCH = "claude/stschool-website-redesign-aio5tq";

export const CMS_SESSION_STORAGE_KEY = "stschool-cms-session";
export const CMS_LOCAL_STORAGE_KEY = "stschool-cms-session-remember";
