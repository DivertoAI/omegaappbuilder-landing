# Product Architecture Overview

**Core flow**
- Chat + spec intake
- Agent orchestration + routing
- Build execution in sandboxed runtime
- File system + preview server
- Export pipeline

**Key technical constraints**
- Secure isolation per workspace
- Scalable compute and caching
- Cost-aware routing by tier
