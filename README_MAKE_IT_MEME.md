# 🎭 Make It Meme — Game Analysis & Feature Roadmap

A comprehensive architectural analysis and feature implementation guide for the **Make It Meme** party game inside **Lolby**.

---

## 📌 Table of Contents
1. [Current State Analysis](#1-current-state-analysis)
2. [Critical Missing Features & Gameplay Gaps](#2-critical-missing-features--gameplay-gaps)
3. [Feature Specification 1: Meme Image Swap / Re-roll](#3-feature-specification-1-meme-image-swap--re-roll)
4. [Feature Specification 2: Authoritative Server-Side Timers](#4-feature-specification-2-authoritative-server-side-timers)
5. [Feature Specification 3: Enhanced Voting & Reaction System](#5-feature-specification-3-enhanced-voting--reaction-system)
6. [Feature Specification 4: Meme Canvas & Text Customizer](#6-feature-specification-4-meme-canvas--text-customizer)
7. [Feature Specification 5: Lobby Customization & Game Modes](#7-feature-specification-5-lobby-customization--game-modes)
8. [Feature Specification 6: Audio, SFX & Visual Juice](#8-feature-specification-6-audio-sfx--visual-juice)
9. [Feature Specification 7: Results Podium, Meme Gallery & Export](#9-feature-specification-7-results-podium-meme-gallery--export)
10. [Socket.io Event Architecture Contract](#10-socketio-event-architecture-contract)
11. [Step-by-Step Implementation Plan](#11-step-by-step-implementation-plan)

---

## 1. Current State Analysis

### What Is Already Built:
- **Lobby System**: Room creation with 6-character room codes (`createRoom`), player join (`joinRoom`), player list real-time sync (`playerListUpdated`).
- **Session Persistence**: Player token and room code stored in `localStorage` and `sessionStorage` with socket reconnection capability.
- **Template Distribution**: Backend queries active memes from PostgreSQL via Drizzle ORM and partitions 10 templates per player (3 `extraImage` + 7 `memeTemplate`).
- **Basic Round Progression**:
  - `startGame`: Distributes meme templates to players and starts round 1.
  - `submitCaption`: Player sends caption text for their designated round image.
  - `submitVote`: When all players submit captions, submissions are sent to players (excluding their own) for single-choice voting.
  - `result`: Tallies votes (`score += votes * 121`), sorts players, and triggers round 2–7 or `finalScore`.

### Existing File Architecture:
```text
LOLBY/
├── backend/
│   ├── src/
│   │   ├── meme/          # Meme entity, templates, DB schema & image queries
│   │   ├── room/          # In-memory room store & player session management
│   │   └── round/         # Round gateway (WebSockets) & round service logic
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CaptionWriting.tsx  # Caption input and preview
    │   │   ├── Voting.tsx          # Carousel for browsing and voting memes
    │   │   ├── Result.tsx          # Round leaderboard & winner screen
    │   │   ├── WaitingRoom.tsx     # Lobby and player roster
    │   │   └── CreateJoin.tsx      # Landing page room entry
    │   └── context/
    │       └── GameContext.tsx     # Centralized socket state & actions
```

---

## 2. Critical Missing Features & Gameplay Gaps

| Area | Current Implementation | Make It Meme Benchmark | Issue / Risk |
| :--- | :--- | :--- | :--- |
| **Image Swap** | `extraImages` are fetched and emitted to frontend, but never used in the UI. | Players can discard their meme and pick a replacement (up to 2-3 re-rolls). | Players get stuck with unfunny/hard templates with no way to change them. |
| **Timer System** | Frontend runs a purely cosmetic timer. Backend has **no timeout logic**. | Server-enforced countdown for Caption (60s), Voting (30s), and Results (7s). | If one player goes AFK or disconnects, the **entire room freezes forever**. |
| **Voting System** | Single vote per player (`submitVote`), binary choice. | Upvote (+pts), Downvote (-pts), and 1 "Meme Buddy" golden bonus vote (x2 multiplier). | Low engagement; players can't express reactions to memes. |
| **Text Editing** | Single bottom text input only. | Top Text + Bottom Text, font size scaling, text positioning, uppercase toggle. | Limits meme formats (e.g. classic top/bottom meme setups). |
| **Live Reactions** | None. Voting is silent and asynchronous. | Live emoji reactions (😂, 💀, 🔥, 💩) float across the screen during presentation. | Missing the social party energy. |
| **Meme Download** | None. Memes disappear when the round ends. | Download meme card as PNG / Share to social media. | Players cannot keep or share the memes they made. |
| **Lobby Settings** | Hardcoded 7 rounds, 60s timer, fixed meme pool. | Host can configure round count, timer lengths, game mode (Classic vs Same Meme). | Lack of replayability and flexibility for quick/long sessions. |

---

## 3. Feature Specification 1: Meme Image Swap / Re-roll

### Gameplay Concept:
In Make It Meme, players are not forced to play the first template they receive. If an image is hard to caption, the player can click **"Swap Meme"** to cycle through their reserve pool (`extraImages`).

### Mechanics:
1. Each player has **3 swap charges** per game (or 1 swap per round).
2. During `CaptionWriting`, a floating badge or button shows **"Swap Meme (X left)"**.
3. Clicking it opens a swap drawer showing the 3 `extraImages` or instantly swaps to the next reserve template.
4. When swapped:
   - Client sends `swapMemeTemplate` event to backend.
   - Backend sets `player.currentRoundImage = chosenImage` and removes it from `player.extraImage`.
   - Backend acknowledges the swap.

### Backend Implementation (`round.gateway.ts`):
```typescript
@SubscribeMessage('swapMemeTemplate')
handleSwapMemeTemplate(
  @ConnectedSocket() client: Socket,
  @MessageBody() data: { roomCode: string; playerToken: string; targetTemplateId: string }
) {
  const room = this.roomService.getRoom(data.roomCode);
  if (!room || room.gamestatus !== 'in-progress') return;

  const player = room.players.find(p => p.token === data.playerToken);
  if (!player || !player.extraImage?.length) {
    client.emit('appError', { message: 'No swaps remaining' });
    return;
  }

  const selectedIndex = player.extraImage.findIndex(img => img.id === data.targetTemplateId);
  if (selectedIndex === -1) {
    client.emit('appError', { message: 'Selected template not available in your reserve' });
    return;
  }

  // Swap current image with reserve image
  const oldImage = player.currentRoundImage;
  player.currentRoundImage = player.extraImage[selectedIndex];
  player.extraImage.splice(selectedIndex, 1);
  if (oldImage) {
    player.extraImage.push(oldImage); // Or permanently discard
  }

  client.emit('currentRoundImage', player.currentRoundImage);
  client.emit('extraImages', player.extraImage);
}
```

### Frontend UI (`CaptionWriting.tsx`):
- Add a **"🎲 Re-roll Meme"** button directly beneath the Meme Preview card.
- Show thumbnail selector modal/carousel displaying the available `extraImages`.
- Include smooth CSS transition when the image updates.

---

## 4. Feature Specification 2: Authoritative Server-Side Timers

### Problem:
Currently, `handlecheckForSubmission` only triggers when `submissions.length === room.players.length`. If one player minimizes their mobile browser or drops connection, everyone is trapped in the round.

### Solution: Authoritative Server-Side Timer Engine

```
[Round Starts]
      │
      ▼
Set Server Timeout (60s) ──────► Broadcast 'timerTick' / 'roundStarted' with endsAt
      │
      ├── If all submitted before 60s ──► Clear Timeout ──┐
      │                                                   │
      └── If 60s expires ──► Auto-submit defaults for AFKs ─┘
                                  │
                                  ▼
                         [Transition to Voting]
                                  │
                                  ▼
Set Server Timeout (30s) ──────► Broadcast 'votingStarted' with endsAt
      │
      ├── If all voted before 30s ─────► Clear Timeout ──┐
      │                                                 │
      └── If 30s expires ──────────────► Auto-skip AFKs ─┘
                                  │
                                  ▼
                         [Transition to Results]
                                  │
                                  ▼
Set Server Timeout (7s) ───────► Auto-start next round or final scoreboard
```

### Backend Timer Manager (`backend/src/round/round-timer.service.ts`):
```typescript
@Injectable()
export class RoundTimerService {
  private activeTimers = new Map<string, NodeJS.Timeout>();

  startPhaseTimer(roomCode: string, durationMs: number, onExpire: () => void) {
    this.clearTimer(roomCode);
    const timeout = setTimeout(() => {
      this.activeTimers.delete(roomCode);
      onExpire();
    }, durationMs);
    this.activeTimers.set(roomCode, timeout);
  }

  clearTimer(roomCode: string) {
    const existing = this.activeTimers.get(roomCode);
    if (existing) {
      clearTimeout(existing);
      this.activeTimers.delete(roomCode);
    }
  }
}
```

### Timeout Fallback Behavior:
- **Caption Phase Timeout**: Any player who hasn't submitted is assigned:
  - Text: `"Ran out of time... 💀"` or their unsaved draft.
  - Image: Their assigned `currentRoundImage`.
- **Voting Phase Timeout**: Players who didn't vote forfeit their vote; existing votes are tallied immediately.

---

## 5. Feature Specification 3: Enhanced Voting & Reaction System

### Game Mechanics (Make It Meme Standard):
1. **Three Vote Types**:
   - 👍 **Upvote (+100 pts)**: Funny meme.
   - 👎 **Downvote (-50 pts)**: Low effort / unfunny (optional toggle in lobby).
   - ⭐ **Meme Buddy / Supervote (x2 points)**: Each player gets **ONE** Meme Buddy token per game or round. When used, it doubles the points awarded to the recipient and gives the voter +50 bonus points if that meme wins the round!
2. **Live Floating Emoji Reactions**:
   - While browsing submissions, players can tap quick reactions: `😂`, `💀`, `🔥`, `💩`, `🤡`.
   - Socket event `sendReaction` broadcasts `{ emoji, x, y }` to all clients in the room to animate floating emojis across everyone's screen in real time.
3. **Synchronized Presentation Mode (Optional Host Screen)**:
   - Instead of individual scrolling, the room can watch each meme on screen for 10 seconds together, revealing who voted for what at the end of the reveal.

### Socket Schema:
```typescript
// Client -> Server
socket.emit('submitVote', {
  roomCode: 'ABC123',
  voterToken: 'TOKEN',
  votedForToken: 'SUBMISSION_OWNER_TOKEN',
  voteType: 'UPVOTE' | 'DOWNVOTE' | 'MEME_BUDDY'
});

socket.emit('sendReaction', {
  roomCode: 'ABC123',
  emoji: '😂'
});

// Server -> Client Broadcast
socket.emit('reactionReceived', {
  emoji: '😂',
  senderName: 'Sabin'
});
```

---

## 6. Feature Specification 4: Meme Canvas & Text Customizer

### Current UI:
Only a single input field placed at the bottom of the image.

### Upgraded Meme Customizer:
1. **Classic Top & Bottom Text**:
   - `topText`: Appears over the top of the meme.
   - `bottomText`: Appears over the bottom of the meme.
2. **Text Formatting Controls**:
   - **Font Style**: Impact (Classic meme), Montserrat (Modern), Comic Sans (Irony), Anton (Bold).
   - **Text Color & Outline**: Default White with thick black stroke (classic `text-stroke: 2px black`).
   - **Font Size**: Small, Medium, Large toggle.
   - **All-Caps Toggle**: Auto-converts to uppercase (standard meme behavior).
3. **Client-side HTML5 Canvas Compositing**:
   - Use HTML5 `<canvas>` or `html2canvas` to bake the text onto the image for true WYSIWYG rendering.
   - Ensures that the rendered meme looks identical on mobile, desktop, and during voting.

---

## 7. Feature Specification 5: Lobby Customization & Game Modes

### Host Controls in Waiting Room (`WaitingRoom.tsx`):
The host should be able to tweak match settings before hitting **"Start Game"**:

```
┌────────────────────────────────────────────────────────┐
│                   LOBBY SETTINGS                       │
├────────────────────────────────────────────────────────┤
│ Game Mode:       [ Classic Meme  ▼ ]                   │
│                  - Classic (Different meme per player) │
│                  - Same Meme (Everyone captions same)  │
│                  - Speed Meme (30s frantic blitz)      │
│                                                        │
│ Number of Rounds:[  3  ]  [ (5) ]  [  7  ]  [  10 ]    │
│ Caption Timer:   [ 30s ]  [ 45s ]  [ (60s) ][ 90s ]    │
│ Voting Timer:    [ 15s ]  [ (30s) ][ 45s ]             │
│ Allow Downvotes: [ ON / (OFF) ]                        │
│ Meme Category:   [ All Memes / Dank / Gaming / SFW ]   │
└────────────────────────────────────────────────────────┘
```

### "Same Meme" Mode Mechanics:
- In "Same Meme" mode, every player receives the exact same template for the round.
- This creates intense direct competition to see who can come up with the most creative twist on a single picture.

---

## 8. Feature Specification 6: Audio, SFX & Visual Juice

Party games live and die by sound and kinetic visuals.

### Recommended Sound Effects (Web Audio API / Howler.js):
- `lobby_join.mp3`: Playful pop when a friend joins the lobby.
- `round_start.mp3`: Energetic whistle / gong when captioning begins.
- `timer_tick.mp3`: Gentle tick at 10s, increasing urgency at 5s.
- `timer_buzzer.mp3`: Airhorn or comic buzz when time runs out.
- `vote_submit.mp3`: Satisfying stamp or lock-in click.
- `drumroll.mp3`: Drumroll during score tallying before revealing winners.
- `winner_cheer.mp3`: Confetti blast and crowd applause for the champion.

### Visual Juice:
- **Screen Shake** when locking in a dank meme.
- **Confetti Cannon** (`canvas-confetti`) on round results and final champion reveal.
- **Floating Memes Background**: Slow floating, blurred meme background art in lobby.

---

## 9. Feature Specification 7: Results Podium, Meme Gallery & Export

### 1. Animated Podium:
- 3rd, 2nd, and 1st place rise onto an animated podium with gold/silver/bronze trophies.
- Player avatars and final scores displayed prominently.

### 2. "Save / Download Meme" Feature:
- Next to each meme in the results gallery, add a **"💾 Download Meme"** button.
- Converts the canvas into a high-res `.png` download named `lolby-meme-{round}.png`.
- Adds a **"Share to Discord / WhatsApp"** Web Share API trigger for mobile players.

### 3. Match Awards & Badges:
- 👑 **Meme God**: Highest total score.
- ⚡ **Speed Demon**: Fastest caption submission.
- 🤝 **Best Buddy**: Received the most Meme Buddy votes.
- 💀 **Uncrowned Jester**: Highest ratio of votes to submissions.

---

## 10. Socket.io Event Architecture Contract

### New & Updated Events Matrix

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `updateLobbySettings` | Client ➔ Server | `{ roomCode, settings: { rounds, timer, mode } }` | Host updates match configuration |
| `lobbySettingsUpdated` | Server ➔ Client | `{ settings }` | Broadcast new settings to all lobby members |
| `swapMemeTemplate` | Client ➔ Server | `{ roomCode, playerToken, targetTemplateId }` | Player requests a template re-roll |
| `memeTemplateSwapped` | Server ➔ Client | `{ currentRoundImage, remainingExtraImages }` | Sends updated image to swapping player |
| `timerSync` | Server ➔ Client | `{ phase, secondsRemaining, endsAt }` | Authoritative server clock sync |
| `phaseTimeout` | Server ➔ Client | `{ phase }` | Server signals that time has expired |
| `sendReaction` | Client ➔ Server | `{ roomCode, emoji }` | Player taps a live reaction emoji |
| `broadcastReaction` | Server ➔ Client | `{ emoji, senderName }` | Broadcasts floating emoji across all screens |
| `playAgain` | Client ➔ Server | `{ roomCode }` | Host restarts game into lobby without rebuilding room |

---

## 11. Step-by-Step Implementation Plan

### Phase 1: Stability & Timers (P0 — Must-have)
1. Implement `RoundTimerService` in backend to enforce hard timeouts on captioning and voting.
2. Add automatic AFK/draft fallback when the 60s caption timer expires.
3. Add server-side voting timer (30s) to prevent stalled lobbies.

### Phase 2: Template Re-roll / Swap (P0 — Core Gameplay)
1. Add `swapMemeTemplate` listener in `RoundGateway`.
2. Connect `extraImages` in `GameContext.tsx`.
3. Add "Swap Template" drawer and UI button in `CaptionWriting.tsx`.

### Phase 3: Text Customization & Formatting (P1)
1. Add Top Text + Bottom Text support to `CaptionWriting.tsx`.
2. Implement font-family and text-size selectors.
3. Render canvas-based preview for uniform cross-device display.

### Phase 4: Scoring, Meme Buddy & Reactions (P1)
1. Add Meme Buddy vote token (x2 multiplier) to `Voting.tsx` and `round.service.ts`.
2. Implement live floating emoji reactions (`sendReaction` / `broadcastReaction`).

### Phase 5: Lobby Customization & Polishing (P2)
1. Add host setting controls (round count, timer speed, Same Meme mode).
2. Integrate Web Audio SFX (timer ticking, buzzers, victory fanfare).
3. Add Meme PNG download button and Hall of Fame recap in `Result.tsx`.

---

*Document created for Lolby — Make It Meme Module.*
