---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - product-brief-writer-2026-01-06.md
  - prd.md
  - architecture.md
  - project-context.md
project_name: Writer
user_name: User
date: 2026-01-06
---

# UX Design Specification - Writer

**Author:** User
**Date:** 2026-01-06

---

## Executive Summary

### Project Vision

Writer is a Content Intelligence Engine that eliminates tool juggling and information fragmentation by combining RAG (internal docs), iterative web search, proactive monitoring (veille), and adaptive content generation into a single, continuous experience. The vision is to replace the Google + ChatGPT workflow with one intelligent tool where users can chat, research, monitor, and generate content without ever leaving the conversation.

**Core Promise:** Everything works at once, ideally on one screen. Chat → Answer → Action.

**Unique Position:** The only tool occupying the "RAG internal + Proactive veille" quadrant - a blue ocean where the tool learns and monitors while users sleep.

### Target Users

**Primary Users (Equal Priority):**

1. **Lucas - Developer Advocate**
   - Context: Startup SaaS, juggles code and content, overwhelmed
   - Pain: 1 hour/day on HackerNews and Twitter to stay current, manual compilation
   - Aha Moment: First automated trend report generated in <2 minutes on his own docs
   - Tech Level: High - wants slash commands and power features

2. **Camille - Tech Lead**
   - Context: Scale-up, must document architecture and onboard devs
   - Pain: Complex questions require asking 3 colleagues, interrupted constantly
   - Aha Moment: Getting answers to impossible questions (GraphRAG relationships)
   - Tech Level: High - needs precise, technical responses

3. **Théo - Content Manager**
   - Context: B2B company, non-technical background
   - Pain: 4 hours per article (research + synthesis + writing)
   - Aha Moment: Trend Report → Ready-to-publish article in 1 click
   - Tech Level: Low - needs simple interface, no jargon

4. **Sarah - VP Engineering (Decision Maker)**
   - Context: Budget owner, must justify ROI to board
   - Need: Metrics, adoption rates, compliance (GDPR/SOC2)
   - Aha Moment: Team adopts massively and can't live without it
   - Tech Level: Medium - needs proof-of-value, not complexity

5. **Marc - Admin**
   - Context: IT Admin configuring Writer for the team
   - Need: Workspace management, permissions, source monitoring
   - Aha Moment: Resolving sync issues in 2 minutes via clear status dashboard
   - Tech Level: High - needs control and observability

**Key User Need Across All Personas:**
- Single-screen experience - no tool juggling, no information loss, no interrupting colleagues
- Speed + Quality + Continuity - stay in one tool, get complete answers fast

### Key Design Challenges

1. **Single-Screen Complexity Management**
   - Keep everything on one screen without overwhelming users
   - Balance chat simplicity + contextual actions + sources + suggestions
   - Approach: Progressive disclosure - show what matters, hide the rest until needed

2. **Role-Based Adaptation**
   - Théo (non-tech) needs simplicity, Camille (tech lead) needs power features
   - Risk: Over-simplifying for power users OR overwhelming novices
   - Approach: Smart defaults per role + optional user customization

3. **Desktop-First, Mobile-Second (PWA)**
   - Rich desktop experience must gracefully degrade to mobile
   - Smart Bar with suggestions/commands needs mobile-friendly version
   - Approach: Responsive components, mobile command menu, PWA for offline capability

4. **Streaming UX for Iterative Search**
   - `/deep` can take up to 15 seconds with multiple search iterations
   - Users need to see progress, not just a spinner
   - Approach: Real-time progress indicators showing each search step

### Design Opportunities

1. **Zero Context-Switching**
   - Make every action available from the chat context
   - Competitive advantage: Users never leave the conversation to configure/export/generate
   - Pattern: Contextual action chips after every response

2. **Intelligent Defaults**
   - Use role + conversation context to suggest the RIGHT next action
   - Competitive advantage: Users don't have to think "what do I do now?"
   - Pattern: Max 2 high-confidence suggestions only

3. **Transparent AI**
   - Show reliability scores + cited sources inline
   - Competitive advantage: Trust through transparency (vs black-box competitors)
   - Pattern: Expandable source cards with scores

4. **Progressive Web App (Mobile)**
   - Desktop-quality experience that works offline on mobile
   - Competitive advantage: One codebase, native-like mobile experience
   - Pattern: Service workers for offline access, mobile-optimized command palette

---

## Core User Experience

### Defining Experience

**Primary User Action:**
The core experience of Writer centers on **asking questions and generating actionable content** for various platforms (Discord, Twitter, stakeholder reports, documentation). Users don't just seek answers—they seek **outputs they can immediately use**.

**Critical Interaction Flow:**
1. **User asks a question** (natural language, no commands required)
2. **System detects intent** and automatically engages appropriate capabilities:
   - Simple question → Quick answer from RAG or web
   - Complex request ("Make me a document about X") → Automatic RAG + web search + document generation
   - Explicit command (`/deep`) → User-controlled deep research
3. **Answer with contextual actions** → System suggests next steps (Generate report? Set up veille? Export?)
4. **User takes action** → Seamless follow-through without leaving the conversation

**Core Experience Loop:**
Chat → Answer → Action Recommendations → Output

### Intent Detection Confidence Strategy

**Three-Tier Approach:**

The system uses LLM-based intent classification with confidence thresholds to balance automation and user control:

**Tier 1: High Confidence (>85%) - Auto-Execute**
- System is highly confident about user intent
- Executes appropriate action automatically without confirmation
- Example: "What is GraphQL?" → 95% confident (simple question) → RAG search only
- No interruption, immediate response

**Tier 2: Medium Confidence (50-85%) - Contextual Choice**
- System detects ambiguity in user intent
- Presents visual choice with time trade-offs
- Example: "Tell me about microservices architecture" → 70% confident
- UX: Show `[⚡ Quick Answer (2s)]` vs `[🔍 Deep Research (15s)]`
- User makes informed decision with clear expectations

**Tier 3: Low Confidence (<50%) - Safe Default + Upgrade Offer**
- System cannot reliably classify intent
- Defaults to simple answer (safe, fast)
- Offers upgrade as actionable suggestion after response
- UX: Display `💡 [🔍 Deep Research Available]` as suggestion chip
- No wasted resources, user retains upgrade path

**Power User Override:**
- Explicit commands (`/deep`, `/watch`, `/image`) bypass intent detection entirely
- Instant execution for users who know exactly what they want
- No ambiguity, maximum control

**Personalization & Learning:**
- System tracks user choices to learn individual preferences
- Adaptive thresholds: Camille's 70% confidence might auto-execute, Théo's might still confirm
- Behavior-based tuning per user over time
- Example: If user always chooses "Deep Research" at 70% confidence, system learns to auto-execute at that threshold

**Error Handling:**
- **False Positive** (Auto deep search when user wanted quick answer): Show "Stop" button during streaming operations
- **False Negative** (Simple answer when user wanted deep): Easy upgrade via suggestion chip
- Track and tune based on user feedback (thumbs up/down)

**Success Metrics:**
- Confirmation rate <30% (indicates sufficient model confidence)
- Track upgrade-after-simple rate (detects overly conservative defaults)
- Correlation between detection accuracy and user satisfaction (thumbs up/down)

### Platform Strategy

**Primary Platform: Desktop Web Application**
- Rich, full-featured experience optimized for productivity
- Keyboard shortcuts and power-user features
- Multi-monitor support for workspace/chat split views
- Primary interaction: Mouse + Keyboard

**Secondary Platform: Mobile via Progressive Web App (PWA)**
- Core value on-the-go: Veille alerts, quick searches, content review
- Touch-optimized interface with mobile command palette
- Offline capability via service workers
- Responsive design that gracefully degrades from desktop

**Offline Capability (PWA):**
- Cached veille alerts available offline
- Recent conversation history accessible without connection
- Cached RAG results for frequently accessed internal docs
- Graceful degradation: Show cached data with "Offline" indicator
- Auto-sync when connection restored

**Platform Priorities:**
1. Desktop-first development and optimization
2. Mobile as PWA for accessibility and offline capability
3. No native mobile apps (MVP scope)

### Effortless Interactions

**1. Intent-Based Automation**
- System detects user intent and activates features automatically (see Intent Detection Strategy)
- Example: "Write a blog post about microservices" → Triggers RAG search + web research + content generation without explicit commands
- Confidence-based execution ensures smart defaults without sacrificing control
- Power users retain override control with explicit commands

**2. Zero Context-Switching**
- All actions available within the chat interface
- Configure veille, generate content, export files—all from conversation context
- No navigation away from primary interaction
- Contextual action chips appear after every response (1-3 suggestions ranked by confidence)

**3. Intelligent Suggestions**
- System recommends 1-3 next actions ranked by confidence (not a hard cap of 2)
- Based on conversation context, user role, and historical behavior
- High-confidence suggestions only (avoid decision fatigue)
- Examples: "Deep research available", "Generate LinkedIn post?", "Set up veille on this topic?"

**4. Real-Time Progress Visibility**
- Streaming responses for all LLM interactions (first token < 500ms)
- Progress indicators for multi-step operations like `/deep`:
  ```
  🔍 Deep Research in progress...
  ├─ ✅ Internal documents (3 sources)
  ├─ ✅ Web search #1 (5 results)
  ├─ 🔄 Web search #2 (refining)
  └─ ⏳ Synthesizing findings...
  ```
- "Stop" button available during long operations (handles false positive intent detection)
- No black-box waiting—users see what's happening

### Critical Success Moments

**1. First Answer Quality (Trust Establishment)**
- User asks first question → Receives complete, sourced answer in < 2 seconds
- Sources displayed with reliability scores
- If first answer succeeds → Trust established, user continues
- If first answer fails → User abandons product

**2. Automatic Intent Detection (Effortless Power)**
- User says "Write me a blog post about GraphQL"
- System automatically: Searches internal docs → Web search → Generates draft
- User didn't need to know about `/deep` or `/generate`
- Intent detection feels invisible and accurate (high confidence auto-execution)
- Success = User feels the tool "just works"

**3. Intent Detection Transparency (Control + Trust)**
- When system is uncertain (medium confidence), user sees clear choice
- Visual time trade-offs help informed decision-making
- When wrong, easy recovery (Stop button or upgrade path)
- Success = User trusts the system AND feels in control

**4. Action Follow-Through (Continuous Flow)**
- User receives answer → Sees contextual suggestions → Takes action (generate/watch/export)
- Flow must be continuous with no dead ends
- Every response leads to clear next steps
- Success = User never asks "what do I do now?"

**5. Veille Value Realization (Proactive Intelligence)**
- User configures veille on "serverless trends"
- Next day: Receives relevant alert about new AWS Lambda feature
- Clicks alert → Sees contextualized summary tied to internal docs
- **Quality Feedback Loop:** User can rate alerts (thumbs up/down) to tune relevance threshold
- **Learning System:** Low-rated alerts increase future filtering threshold
- Success = Alert is valuable, not noise

**6. Multi-Platform Content Generation (Output Quality)**
- User requests "Generate a Twitter thread about our new feature"
- System produces platform-optimized content (character limits, tone, hashtags)
- Content quality is high enough to publish with minimal editing
- Success = User actually publishes the generated content

### Experience Principles

**Guiding principles that inform all UX design decisions:**

1. **Intent-Driven Intelligence**
   - Detect what users need and act automatically with confidence thresholds
   - Simple questions → Simple answers
   - Complex requests → Full capabilities (RAG + web + generation)
   - Medium confidence → User choice with clear trade-offs
   - Power users can override with explicit commands
   - *Make the common case effortless, the complex case explicit, the ambiguous case transparent*

2. **Continuous Flow, Zero Context-Switching**
   - Every interaction within the chat context
   - Never force users to leave the conversation
   - Question → Answer → Suggestions → Action flows naturally
   - *One screen, one conversation, everything flows*

3. **Transparent & Trustworthy**
   - Show sources with reliability scores inline
   - Display real-time progress for long operations
   - Make AI decisions visible and understandable
   - Expose confidence levels when asking for user input
   - Provide recovery mechanisms (Stop, upgrade, feedback)
   - *Build trust through transparency, not black boxes*

4. **Progressive Disclosure for All Skill Levels**
   - Non-technical users (Théo) see simple interface, no jargon
   - Technical users (Camille) discover power features organically
   - Role-based defaults with user customization available
   - System learns individual preferences over time
   - *Start simple, reveal complexity on demand, adapt to each user*

5. **Desktop-First, Mobile-Graceful**
   - Rich desktop experience optimized for deep work
   - Mobile PWA provides core value on-the-go
   - Offline capability for resilience (cached alerts, recent history, frequent docs)
   - *Design for depth on desktop, essentials on mobile*

---

## Desired Emotional Response

### Primary Emotional Goals

**Core Emotional Experience:**
Writer is designed to evoke a powerful combination of **gratitude, pride, magic, control, productivity, and fun**. Users should feel that the tool exists to serve them, that they are the creators (not passive consumers of AI output), and that the experience is both efficient and enjoyable.

**Primary Emotions:**

1. **Gratitude** - "Thank god this exists, my life is so much easier"
   - Users feel genuine appreciation for the tool's existence
   - Relief from previous painful workflows (12 tabs, manual compilation, interrupting colleagues)
   
2. **Pride** - "I created this, it's MINE"
   - Users take ownership of outputs despite AI assistance
   - Sense of authorship: "It's thanks to ME that this works"
   - Accomplishment when results arrive
   
3. **Magic** - "How did it know exactly what I needed?"
   - Intent detection feels invisible and accurate
   - System anticipates needs without explicit commands
   - Progressive discovery of 2-3 delightful features
   
4. **Control** - "The AI works for ME, I decide"
   - User always has agency despite automation
   - Capable of fixing issues easily with tool guidance
   - Override options available for power users
   
5. **Productivity** - "10 minutes instead of 2 hours"
   - Tangible time savings felt immediately
   - Efficiency without friction
   - Fast, smooth interactions
   
6. **Fun** - "This is actually enjoyable to use"
   - Experience is pleasant, not just utilitarian
   - Discovering features feels rewarding
   - Using the tool doesn't feel like work

**Emotional Balance:**
The product balances **magic** (AI doing heavy lifting) with **control** (user owns the outcome) - the sweet spot where automation feels empowering, not replacive.

### Emotional Journey Mapping

**Stage 1: First Discovery / Onboarding**

**Target Emotion: Immediate Clarity + Relief**
- User should NOT feel confusion or "where do I start?"
- User immediately thinks: "Ah! This is going to solve all my problems and improve my productivity"
- Everything is available directly, product intention is obvious
- Core value is instant, with 2-3 magical discoveries available for progressive delight

**Design Implications:**
- Clear, simple landing directly in chat interface
- Obvious value proposition visible immediately
- No complex setup wizard - straight to value
- Example questions/use cases shown on first screen

**Stage 2: Core Experience (Chat → Answer → Action)**

**Target Emotions: Efficiency + Confidence + Trust**
- User feels **efficient** - things happen fast, no wasted time
- User has **confidence** in the product and in their own intentions
- User **trusts** the product understands what they want

**Design Implications:**
- Fast responses (first token < 500ms streaming)
- Intent detection feels accurate and aligned with goals
- Transparent: User sees WHY system made a choice
- Real-time progress visibility (no black-box waiting)

**Stage 3: Result Delivery (Content Generated, Answer Found)**

**Target Emotions: Pride + Accomplishment**
- User says: "It's THANKS TO ME that this works" (not just "AI did it")
- Sense of **pride** - "I created this"
- Sense of **accomplishment** - "Mission complete"

**Design Implications:**
- Language emphasizes user agency: "You created..." not "AI generated..."
- User's input/guidance highlighted in the process
- Export options show user as author
- Success moments celebrate user achievement

**Stage 4: Error Recovery (Intent Detection Fails, Wrong Result)**

**Target Emotions: Control + Capability (NOT Frustration)**
- User feels **in control** - "I can fix this"
- User sees they're **capable of easily solving it** with tool's help
- System shows: "Here's how to fix this" (guidance, not abandonment)

**Design Implications:**
- Clear recovery paths (Stop button, upgrade options, feedback)
- Error states show solutions: "You can fix this by..." (not just "Error")
- System adapts based on user corrections (learning)
- Always a path forward, never a dead end

**Stage 5: Veille Alert Discovery**

**Target Emotions: Empowerment + Gratitude**
- "I'm ahead of the curve" (competitive advantage)
- "This tool is working for me while I sleep" (proactive value)
- "I have an unfair advantage" (empowerment)

**Design Implications:**
- Alerts feel timely and relevant (not noise)
- Contextualized to user's internal docs
- Quality feedback loop (thumbs up/down) to improve relevance
- Notifications emphasize value: "Found something relevant for you..."

### Micro-Emotions

**Critical Micro-Emotional States:**

1. **Clarity vs. Confusion → Clarity WINS**
   - Immediate understanding of product intention
   - Interface is self-explanatory
   - No learning curve for basic use
   
2. **Confidence vs. Doubt → Confidence WINS**
   - Trust in system decisions
   - Trust in own ability to use the tool
   - Reliability scores build confidence in sources
   
3. **Pride vs. Dependence → Pride WINS**
   - "I did this" not "AI did this"
   - User as creator, AI as collaborator
   - Ownership of outputs
   
4. **Control vs. Helplessness → Control WINS**
   - Always a way forward
   - User can override automation
   - Easy fixes when things go wrong
   
5. **Efficiency vs. Friction → Efficiency WINS**
   - Fast, smooth interactions
   - No unnecessary steps
   - Intent detection eliminates manual work
   
6. **Delight vs. Satisfaction → Mix of BOTH**
   - Core experience is satisfying (reliable, efficient)
   - Progressive discoveries are delightful (magic moments)
   - Balance prevents over-reliance on novelty

**Emotions to Actively AVOID:**

- ❌ **Confusion** - Onboarding must be crystal clear
- ❌ **Frustration** - When errors happen, show paths forward
- ❌ **Dependence** - User should feel proud, not reliant on AI
- ❌ **Anxiety** - No uncertainty about what will happen
- ❌ **Overwhelm** - Avoid too many options or complexity
- ❌ **Guilt** - Never make user feel they "should have known"
- ❌ **Abandonment** - Always provide guidance and support

### Design Implications

**Emotion-to-Design Connections:**

**1. Immediate Clarity (Onboarding):**
- Landing page = Chat interface (no complex dashboard)
- First message shows example questions/use cases
- Visible slash command menu (`/`) for discoverability
- No multi-step setup - get to value in <30 seconds
- Clear visual hierarchy: Chat input is primary focus

**2. Efficiency + Confidence (Core Experience):**
- Streaming responses (first token < 500ms) - no waiting
- Intent detection with confidence transparency (show choice when uncertain)
- Real-time progress indicators (user sees what's happening)
- Keyboard shortcuts for power users
- Sources with reliability scores (builds trust)

**3. Pride + Accomplishment (Results):**
- Language emphasizes user agency: "You created..." not "AI generated..."
- Show user's inputs/guidance in the generation process
- Export options highlight user as author
- Thumbs up/down reinforces "you're training this"
- Celebrate completion: "Content ready to publish" (not "AI finished")

**4. Control + Capability (Errors):**
- Stop button during long operations
- Clear recovery paths: "Try this instead..." buttons
- Error messages show solutions, not just problems
- System learns from corrections (user teaches the tool)
- Undo/redo available where appropriate

**5. Magic + Delight (Progressive Discovery):**
- 2-3 hidden power features for users to discover organically
- Contextual suggestions reveal capabilities naturally
- Personalization that "just works" without configuration
- Veille alerts that surprise with perfect timing
- Adaptive thresholds (system learns preferences silently)

**6. Fun + Enjoyment (Overall Experience):**
- Smooth animations (Framer Motion) for transitions
- Conversational tone in UI copy (not robotic)
- Micro-interactions that feel responsive
- Celebration of milestones (first veille alert, first export)

### Emotional Design Principles

**Guiding principles for creating the desired emotional experience:**

1. **User as Creator, AI as Collaborator**
   - Every interaction should reinforce user agency
   - Language and UX emphasize user ownership
   - AI assistance is visible but secondary to user contribution
   - *"You made this happen, we just helped"*

2. **Clarity First, Magic Second**
   - Core functionality must be immediately obvious
   - Progressive disclosure for advanced features
   - 2-3 delightful discoveries allowed, but not at expense of clarity
   - *"Understand in 30 seconds, master in 30 minutes"*

3. **Trust Through Transparency**
   - Show sources, scores, and reasoning
   - Real-time progress visibility
   - Explain automated decisions when they matter
   - *"You always know what's happening and why"*

4. **Empowerment Over Automation**
   - Automation serves user control (doesn't replace it)
   - Always provide override/correction mechanisms
   - Learn from user corrections silently
   - *"The tool adapts to you, not vice versa"*

5. **Efficiency Without Sacrifice**
   - Fast doesn't mean rushed or stressful
   - Smooth, polished interactions
   - Celebrate time savings but don't create pressure
   - *"Fast feels effortless, not frantic"*

6. **Joyful Productivity**
   - Work can be efficient AND enjoyable
   - Small moments of delight in everyday tasks
   - Interface feels alive and responsive
   - *"Productivity doesn't have to be boring"*

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**1. ChatGPT/Claude - Conversational AI Interface**

**What They Do Exceptionally Well:**
- **Immediate clarity** - Landing page = chat input. Zero learning curve
- **Streaming responses** - First token appears instantly, feels alive
- **Conversational memory** - System remembers context throughout conversation
- **Markdown rendering** - Code blocks, lists, formatting make responses scannable
- **Regenerate/Edit** - Easy recovery when answer isn't quite right

**Key Lessons for Writer:**
- Single-input simplicity - One text box, infinite possibilities
- Progressive capability reveal - Start simple, discover features organically
- Conversation as interface - All actions flow from chat, not menus

**2. Perplexity - Research-Focused Chat**

**What They Do Exceptionally Well:**
- **Cited sources inline** - Every claim has a [1] [2] link to source
- **Source cards** - Expandable cards show full context of citations
- **Related questions** - Suggests follow-up queries automatically
- **Search transparency** - Shows "Searching X sources..." during research
- **Clean information hierarchy** - Answer → Sources → Related questions (clear priority)

**Key Lessons for Writer:**
- Trust through citations - Never a statement without a source
- Contextual suggestions - Smart next-step recommendations
- Research progress visibility - Show what's happening during `/deep`

**3. Linear - Efficient Productivity UX**

**What They Do Exceptionally Well:**
- **Command palette (Cmd+K)** - Access anything instantly via keyboard
- **Keyboard-first design** - Every action has a shortcut
- **Instant feedback** - No loading spinners, optimistic UI updates
- **Minimal chrome** - Content is king, UI gets out of the way
- **Consistent patterns** - Once you learn one flow, you know them all

**Key Lessons for Writer:**
- Power-user shortcuts - Slash commands for instant action
- Speed as feature - Fast feels professional and trustworthy
- Consistency - Predictable patterns reduce cognitive load

**4. Notion - Knowledge Management**

**What They Do Exceptionally Well:**
- **Flexible building blocks** - Pages, databases, toggles compose together
- **Inline interactions** - No modal dialogs, everything edits in place
- **Progressive disclosure** - Pages can be simple or complex based on need
- **Collaborative feel** - Real-time updates, see others working
- **Templates** - Pre-built structures reduce friction

**Key Lessons for Writer:**
- Modular content - Chat, veille, settings as composable views
- Templates for generation - Pre-built formats (LinkedIn, Blog, Tweet)
- In-place editing - Refine generated content without leaving context

**5. Slack - Contextual Conversation**

**What They Do Exceptionally Well:**
- **Threads** - Keep conversations organized without cluttering main view
- **Reactions** - Quick feedback without adding noise (👍 instead of "thanks!")
- **Slash commands** - `/remind`, `/status` - power without complexity
- **Contextual actions** - Hover over message → Reply/Edit/React
- **Channel organization** - Clear information architecture

**Key Lessons for Writer:**
- Contextual actions - Suggestions appear where needed, not globally
- Quick feedback - Thumbs up/down for training the system
- Organized spaces - Personal space vs workspaces (like Slack channels)

**6. VS Code - Command Palette & Extensions**

**What They Do Exceptionally Well:**
- **Command palette (Cmd+Shift+P)** - Discoverable, searchable, fast
- **Fuzzy search** - Type partial match, find what you need
- **Extension ecosystem** - Powerful without bloating core product
- **Keyboard navigation** - Mouse optional for power users
- **Status bar** - Glanceable info without interrupting flow

**Key Lessons for Writer:**
- Slash command menu - Searchable, fuzzy-matched actions
- Mobile command menu - Touch-friendly equivalent of keyboard shortcuts
- Status indicators - Show veille status, sync status unobtrusively

### Transferable UX Patterns

**Navigation Patterns:**

1. **Command Palette Pattern** (Linear, VS Code, Slack)
   - **Application:** `/` triggers command palette with fuzzy search
   - **Mobile adaptation:** Visible `[/]` button opens touch-friendly command menu
   - **Rationale:** Powerful for experts, discoverable for novices
   - **Supports:** "Progressive Disclosure" principle

2. **Single-View Focus** (ChatGPT, Claude)
   - **Application:** Chat interface is primary, everything else is secondary
   - **Navigation:** Settings, veille, admin accessed from chat context or minimal sidebar
   - **Rationale:** Reduces cognitive load
   - **Supports:** "Zero Context-Switching" principle

**Interaction Patterns:**

1. **Contextual Action Chips** (Perplexity, Slack)
   - **Application:** After each answer, show 1-3 suggestion chips (🔍 Deep Research, 📡 Set up Veille, 📝 Generate Post)
   - **Rationale:** Guides next action without overwhelming user
   - **Supports:** "Intelligent Defaults" design opportunity

2. **Inline Citations** (Perplexity)
   - **Application:** Every statement linked to source [1] [2], expandable cards show context
   - **Rationale:** Builds trust, enables fact-checking
   - **Supports:** "Transparent AI" principle

3. **Streaming with Progress** (ChatGPT + enhanced for `/deep`)
   - **Application:** LLM responses stream, multi-step operations show detailed progress tree
   - **Rationale:** Makes long operations feel fast, builds confidence
   - **Supports:** "Real-Time Progress Visibility" from Core Experience

4. **Quick Feedback** (Slack reactions, Linear upvotes)
   - **Application:** Thumbs up/down after each response
   - **Rationale:** Low-effort feedback loop improves system over time
   - **Supports:** Personalization & Learning from Intent Detection Strategy

**Visual Patterns:**

1. **Minimal Chrome** (Linear, Notion)
   - **Application:** Content-first interface, UI elements appear on hover/focus
   - **Rationale:** Supports "single-screen" vision, reduces visual clutter
   - **Supports:** "Single-Screen Complexity Management" challenge

2. **Markdown Rendering** (ChatGPT, Notion)
   - **Application:** Responses formatted as markdown (headings, lists, code blocks)
   - **Rationale:** Makes dense information scannable
   - **Supports:** Efficiency and clarity

3. **Status Indicators** (VS Code, Slack)
   - **Application:** Small status bar showing veille sync, workspace, connection status
   - **Rationale:** Glanceable info without interrupting flow
   - **Supports:** "Trust Through Transparency" principle

### Anti-Patterns to Avoid

**1. Modal Dialog Overload** (Common in enterprise tools)
- **Problem:** Forces users to context-switch, breaks flow
- **Writer's Approach:** Inline interactions, everything editable in place
- **Why Avoid:** Conflicts with "Continuous Flow" principle

**2. Hidden Onboarding** (Many AI tools)
- **Problem:** Users don't discover features, feel product is limited
- **Writer's Approach:** Example questions on first load, visible `/` for commands
- **Why Avoid:** Conflicts with "Immediate Clarity" emotional goal

**3. Over-Suggestion Fatigue** (Google Assistant, Clippy)
- **Problem:** Too many suggestions = noise, ignored
- **Writer's Approach:** Max 1-3 **high-confidence** suggestions only
- **Why Avoid:** Conflicts with "Efficiency" emotional goal

**4. Black-Box AI** (Many ChatGPT competitors)
- **Problem:** User doesn't know why AI made a decision
- **Writer's Approach:** Show sources, confidence levels, reasoning
- **Why Avoid:** Conflicts with "Transparent & Trustworthy" principle

**5. Feature Sprawl** (Notion's complexity problem)
- **Problem:** Too many options overwhelm users
- **Writer's Approach:** Core features obvious, advanced features discoverable (2-3 magic moments)
- **Why Avoid:** Conflicts with "Clarity First, Magic Second" principle

**6. Mobile-as-Afterthought** (Many productivity tools)
- **Problem:** Desktop UI doesn't translate well to touch
- **Writer's Approach:** PWA with mobile-specific patterns (command menu button, touch-optimized chips)
- **Why Avoid:** Conflicts with "Desktop-First, Mobile-Graceful" platform strategy

### Design Inspiration Strategy

**What to Adopt Directly:**

1. **Command Palette Pattern** (Linear, VS Code)
   - **Rationale:** Supports both novice (discoverable) and expert (fast) users
   - **Implementation:** `/` opens searchable command menu
   - **Aligns With:** Progressive Disclosure principle

2. **Inline Citations** (Perplexity)
   - **Rationale:** Builds trust, supports "Transparent AI" principle
   - **Implementation:** [1] [2] links → expandable source cards with reliability scores
   - **Aligns With:** Trust Through Transparency

3. **Streaming Responses** (ChatGPT)
   - **Rationale:** Makes AI feel fast and alive
   - **Implementation:** First token < 500ms, progressive rendering
   - **Aligns With:** Efficiency emotional goal

4. **Contextual Suggestion Chips** (Perplexity)
   - **Rationale:** Guides action without overwhelming
   - **Implementation:** 1-3 high-confidence chips after each response
   - **Aligns With:** Intelligent Defaults

**What to Adapt:**

1. **Notion's Flexible Blocks → Writer's Content Templates**
   - **Adaptation:** Instead of generic blocks, provide platform-specific templates (LinkedIn, Blog, Tweet)
   - **Rationale:** More focused on content generation use case
   - **Aligns With:** Multi-platform content generation success moment

2. **Slack's Channels → Writer's Workspaces**
   - **Adaptation:** Workspaces + personal spaces instead of channel-based organization
   - **Rationale:** Privacy and multi-tenancy requirements
   - **Aligns With:** Architecture multi-tenant design

3. **VS Code's Status Bar → Writer's Veille Indicator**
   - **Adaptation:** Minimal status showing veille sync, not full IDE status
   - **Rationale:** Simpler product scope, focus on veille status only
   - **Aligns With:** Minimal Chrome visual pattern

**What to Avoid:**

1. **Notion's Complexity**
   - **Rationale:** Conflicts with "Immediate Clarity" goal
   - **Writer's Alternative:** Start simple, progressively reveal complexity

2. **ChatGPT's Lack of Citations**
   - **Rationale:** Conflicts with "Trust Through Transparency" principle
   - **Writer's Alternative:** Always show sources with reliability scores

3. **Linear's Enterprise Focus**
   - **Rationale:** Writer serves both technical and non-technical users (Théo vs Camille)
   - **Writer's Alternative:** Role-based defaults with progressive disclosure

**Strategic Summary:**

Writer borrows proven interaction patterns (command palette, inline citations, contextual chips, streaming) while avoiding common pitfalls (modal overload, hidden features, black-box AI). The inspiration strategy ensures we build on existing user mental models from familiar products while maintaining Writer's unique value proposition: RAG + Veille + Generation in a single, continuous experience.

---

## Design System Foundation

### Design System Choice

**Selected System:** **shadcn/ui** (Radix UI Primitives + Tailwind CSS) + Framer Motion

shadcn/ui is a collection of re-usable components built on Radix UI primitives and styled with Tailwind CSS. Unlike traditional component libraries distributed via npm, shadcn/ui components are copied directly into your codebase, providing full ownership and customization capability while maintaining accessibility and consistency.

**Component Philosophy:**
- Copy-paste components that you own and control
- Built on headless Radix UI primitives (accessible by default)
- Styled with Tailwind CSS utility classes
- TypeScript-first with full type safety
- Composable and extendable

### Rationale for Selection

**1. Balance of Speed and Control**
- Pre-built accessible components accelerate development
- Full source code ownership enables deep customization
- No dependency bloat - only include components you use
- Aligns with Clean Architecture principle (components live in `src/components/ui/`, not `node_modules`)

**2. Perfect Fit for Writer's Technical Stack**
- Next.js 14 App Router (primary framework)
- TypeScript strict mode (full type safety)
- Tailwind CSS (consistent styling system)
- Matches Architecture decisions exactly

**3. Accessibility Built-In**
- Radix UI primitives are WCAG 2.1 Level AA compliant
- Keyboard navigation works out-of-the-box
- Screen reader support included
- Focus management handled automatically
- Supports Writer's diverse user base (Théo to Camille)

**4. Component Availability for Writer's Needs**

**Core Interaction Components:**
- `<Command>` - Perfect for slash command palette (`/` menu with fuzzy search)
- `<Dialog>` / `<Sheet>` - Modals and side panels (minimal use per anti-pattern)
- `<Dropdown Menu>` - Contextual actions on hover
- `<Popover>` - Contextual tooltips and hints

**Content Display Components:**
- `<Card>` - Source citation cards, veille alert cards
- `<Scroll Area>` - Chat history, long content
- `<Separator>` - Visual hierarchy in chat responses
- `<Badge>` - Reliability scores, tags

**Feedback Components:**
- `<Toast>` / Sonner - Notifications (veille alerts, system messages)
- `<Tooltip>` - Contextual help (progressive disclosure)
- `<Progress>` - Streaming indicators (for `/deep` operations)

**Form Components:**
- `<Input>` / `<Textarea>` - Chat input, settings
- `<Button>` - Action chips, suggestions
- `<Tabs>` - Settings organization, workspace switcher

**5. Responsive Design Support**
- Tailwind's responsive utilities (sm, md, lg, xl breakpoints)
- Mobile-first approach built-in
- PWA-compatible styling
- Supports "Desktop-First, Mobile-Graceful" platform strategy

**6. Performance Characteristics**
- Minimal runtime overhead (components are just React + Tailwind)
- Tree-shakeable (only bundle what you use)
- Fast initial page load (target: <200KB total JS gzipped)
- Supports streaming UI patterns (Next.js App Router)

**7. Customization and Theming**
- CSS variables for design tokens (colors, spacing, typography)
- Tailwind config for brand-specific styles
- Easy to override individual component styles
- Supports future dark mode if needed

**8. Developer Experience**
- Excellent documentation at ui.shadcn.com
- Active community and examples
- CLI for adding components (`npx shadcn-ui@latest add button`)
- TypeScript autocomplete and IntelliSense support

### Implementation Approach

**1. Initial Setup**

```bash
# shadcn/ui initialization (already done per Architecture)
npx shadcn@latest init

# Core component installation
npx shadcn@latest add button input textarea card dialog sheet dropdown-menu command avatar badge toast sonner tabs scroll-area tooltip popover separator skeleton
```

**2. Design Token Configuration**

Define brand-specific tokens in Tailwind config and CSS variables:

```css
/* styles/globals.css - Design Tokens */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... additional tokens ... */
}
```

**3. Component Organization**

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── command.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── features/        # Composed feature components
│       ├── search/
│       │   ├── smart-bar.tsx       # Main chat interface
│       │   ├── suggestion-chip.tsx # Contextual actions
│       │   └── source-card.tsx     # Citation cards
│       ├── veille/
│       │   └── alert-card.tsx
│       └── shared/
│           └── command-palette.tsx # `/` menu
```

**4. Framer Motion Integration**

Add animations to enhance "Magic + Delight" emotional goals:

```typescript
// Streaming progress animation
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Progress tree content */}
</motion.div>

// Suggestion chip entrance
<motion.button
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  🔍 Deep Research
</motion.button>
```

**Animation Performance Guidelines:**
- Use `framer-motion/m` (lazy-loaded subset) for simple animations to reduce bundle size (~30KB savings)
- Animate only on user-triggered actions, not on every render
- Limit concurrent animations to avoid performance degradation
- Test on lower-end mobile devices, not just desktop

**5. Accessibility Compliance Strategy**

- Leverage Radix UI's built-in ARIA attributes
- Test with keyboard navigation (Tab, Enter, Escape)
- Validate with screen readers (NVDA, JAWS, VoiceOver)
- Ensure sufficient color contrast ratios (WCAG AA minimum)
- **Mobile touch targets: Minimum 44px for buttons/chips** (WCAG 2.5.5)
- Provide skip links for power users

**6. Server/Client Component Boundaries**

**Critical Pattern for Next.js 14 App Router:**

```typescript
// ✅ CORRECT - Server Component (no 'use client')
// app/page.tsx
import { ChatInterface } from '@/components/features/chat-interface'

export default function Page() {
  return <ChatInterface />
}

// ✅ CORRECT - Client Component wrapper
// components/features/chat-interface.tsx
'use client'
import { Button } from '@/components/ui/button'
import { Command } from '@/components/ui/command'

export function ChatInterface() {
  return (
    <Command>
      <Button>Submit</Button>
    </Command>
  )
}

// ❌ INCORRECT - Importing Radix in Server Component
// app/page.tsx
import { Button } from '@/components/ui/button' // Error: needs 'use client'
```

**Rule:** Radix components (via shadcn/ui) require `'use client'` directive. Never import them directly in Server Components.

### Customization Strategy

**1. Brand Customization**

While Writer doesn't have established brand guidelines yet, we'll prepare for future customization:

```typescript
// tailwind.config.ts - Brand tokens
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    }
  }
}
```

**2. Component Customization Patterns**

**Pattern 1: Extend Base Components**
```typescript
// components/ui/button.tsx (shadcn base)
// components/features/shared/action-button.tsx (extended)
export function ActionButton({ icon, label, onClick }: Props) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  )
}
```

**Pattern 2: Extract Repeated Tailwind Patterns**

To avoid className verbosity, extract repeated patterns:

```typescript
// lib/styles.ts
export const cardStyles = "rounded-lg border bg-card text-card-foreground shadow-sm"
export const chipStyles = "inline-flex items-center rounded-full px-3 py-1 text-sm"

// Usage
<div className={cn(cardStyles, "p-4")}>
  <Badge className={chipStyles}>High Confidence</Badge>
</div>
```

**Pattern 3: Composed Components**
```typescript
// SourceCard composes Card + Badge + Popover
export function SourceCard({ source, reliabilityScore }: Props) {
  return (
    <Card>
      <Badge variant={getScoreVariant(reliabilityScore)}>
        {reliabilityScore}%
      </Badge>
      {/* Source content */}
    </Card>
  )
}
```

**3. Responsive Customization**

Mobile-specific variants with 44px minimum touch targets:

```typescript
// Desktop: Full command palette
<Command className="max-w-2xl">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem>🔍 Deep Research</CommandItem>
      <CommandItem>📡 Set up Veille</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>

// Mobile: Simplified sheet with larger touch targets
<Sheet>
  <SheetTrigger asChild>
    <Button 
      variant="outline" 
      size="icon"
      className="h-11 w-11" // 44px minimum
    >
      /
    </Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <div className="space-y-2">
      <Button className="w-full h-11">🔍 Deep Research</Button>
      <Button className="w-full h-11">📡 Set up Veille</Button>
    </div>
  </SheetContent>
</Sheet>
```

**4. Animation Customization**

Consistent motion design system:

```typescript
// lib/motion.ts - Motion presets
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}
```

**5. Custom Components for Writer-Specific Needs**

Components not available in shadcn/ui that we'll build:

- **StreamingText** - Character-by-character text rendering with cursor
- **ProgressTree** - Visual tree for `/deep` multi-step operations
- **ReliabilityBadge** - Color-coded score indicator with explanation popover
- **SuggestionChips** - Contextual action chips (max 3, confidence-ranked, 44px touch targets)
- **IntentConfidenceDialog** - Medium-confidence choice dialog (⚡ Quick vs 🔍 Deep)

**6. Dark Mode Preparation (Future)**

While not MVP scope, design tokens are configured for dark mode:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode tokens ... */
}
```

Activated via `<html class="dark">` when feature is implemented.

### Design System Governance

**Rules for Maintaining Consistency:**

1. **Always use shadcn/ui components as base** - Don't create parallel button implementations
2. **Extend, don't replace** - Build on top of base components
3. **Document custom components** - Use Storybook for component catalog (setup required)
4. **Accessibility testing required** - Keyboard + screen reader validation before merge
5. **Responsive testing required** - Test mobile (44px touch targets), tablet, desktop breakpoints on real devices
6. **Bundle size monitoring** - Target: <200KB total JS gzipped

**Component Addition Process:**
1. Check if shadcn/ui provides the component
2. If yes, install via CLI and customize
3. If no, build custom using Radix primitive + Tailwind
4. Document in Storybook with examples
5. Add to shared component library

**Component Maintenance Strategy:**
- Track shadcn/ui releases on GitHub
- Quarterly review/update cycle for component bug fixes
- Test updates in dev environment before production
- Document breaking changes in project-context.md

**Immediate Action Items (From Team Review):**
1. **UX (Sally):** Define minimum touch target sizes (44px) in component guidelines
2. **Architecture (Winston):** Document Server/Client boundaries in project-context.md
3. **Development (Amelia):** Set up Storybook for component catalog early in implementation
4. **Development (Amelia):** Configure Vitest mocks for Radix portals (ResizeObserver, etc.)

**Testing Setup Requirements:**

```typescript
// vitest.setup.ts
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

---

This design system foundation ensures Writer has a consistent, accessible, and performant UI that supports all defined UX patterns and emotional goals while remaining flexible for future customization. The shadcn/ui choice has been validated by UX, Architecture, and Development perspectives with actionable recommendations incorporated.

---
