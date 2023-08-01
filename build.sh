set -ex
export NODE_OPTIONS="--openssl-legacy-provider"
export BROWSER=none
(cd streamlit_flow/argo_workflow/frontend && npm i --legacy-peer-deps && npm run build)

