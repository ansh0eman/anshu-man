---
layout: ../../layouts/post.astro
title: "My Mother Asked for a Good Morning Text. I Built a Second Brain."
pubDate: 2026-10-04
description: "How a daily family text turned into my OpenClaw second brain, a carefully guarded public phone agent, and LEDA."
author: "Anshu Man"
excerpt: My mother wanted one Good Morning text every day. I made a cron job, then somehow gave the whole thing an agent architecture.
image:
  src:
  alt:
tags: ["OpenClaw", "AI", "second brain", "LEDA", "automation"]
---

<style>
  .story-map {
    margin: 2rem 0;
    padding: 1.25rem;
    border: 1px solid rgb(168 162 158 / 55%);
    border-radius: 0.75rem;
    background: rgb(120 113 108 / 5%);
  }
  .story-map figcaption {
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  .story-map ol {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.6rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .story-map li {
    min-height: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.8rem;
    border-left: 2px solid #c2410c;
    background: rgb(120 113 108 / 7%);
    font-size: 0.9rem;
    line-height: 1.35;
  }
  .story-map li span {
    font-size: 0.72rem;
  }
  .agent-map {
    margin: 2rem 0;
    padding: 1.25rem;
    border: 1px solid rgb(168 162 158 / 55%);
    border-radius: 0.75rem;
    background: rgb(120 113 108 / 5%);
  }
  .agent-map figcaption {
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  .agent-map .gateway {
    width: fit-content;
    margin: 0 auto 1.25rem;
    padding: 0.65rem 1rem;
    border: 1px solid #c2410c;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: 650;
  }
  .agent-map .gateway small,
  .agent-map .agent small {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    font-weight: 400;
  }
  .agent-map .branches {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .agent-map .agent {
    padding: 1rem;
    border-top: 2px solid #a8a29e;
    background: rgb(120 113 108 / 7%);
  }
  .agent-map .agent strong {
    display: block;
  }
  .agent-map .agent.public {
    border-color: #c2410c;
  }
  .agent-map .flow-note {
    margin: 0.8rem 0 0;
    font-size: 0.8rem;
    line-height: 1.5;
  }
  @media (max-width: 640px) {
    .story-map ol {
      grid-template-columns: 1fr;
    }
    .story-map li {
      min-height: auto;
      flex-direction: row;
      align-items: center;
    }
    .agent-map .branches {
      grid-template-columns: 1fr;
    }
  }
  :global(html.dark) .story-map figcaption,
  :global(html.dark) .story-map li span,
  :global(html.dark) .agent-map figcaption,
  :global(html.dark) .agent-map small,
  :global(html.dark) .agent-map .flow-note {
    color: #a8a29e;
  }
</style>

My mother used to complain that I missed her calls and accidentally ignored her texts. Then came the daily request: send her a **Good Morning** message. Every day. The least I could do, surely.

I agreed. And then, being me, I started thinking about how to make sure I remembered.

<h2>The least I could do, automated</h2>

The first version was wonderfully simple: an OpenClaw scheduled task sends a short greeting to our family WhatsApp conversation at 8:00 AM, India time. I assigned the job to my private `main` agent, so it had a clear owner instead of relying on whichever agent happened to be awake. The job is enabled and configured for this schedule today.

```json
{
  "name": "Family good morning",
  "agentId": "main",
  "schedule": {
    "kind": "cron",
    "expr": "0 8 * * *",
    "tz": "Asia/Kolkata"
  },
  "delivery": {
    "mode": "announce",
    "channel": "whatsapp"
  }
}
```

The destination is deliberately left out here. The important bits are the schedule, timezone, explicit agent owner, and delivery channel. A cron expression is just a compact way of saying, “At this time, on this schedule, do the thing.” In this case: 8 AM, every day, send the greeting. This is the scheduled job’s shape, with private routing details omitted.

At that point, the entire system existed because my mother wanted proof of life before breakfast. Reasonable request. Unexpectedly large software footprint.

<figure class="story-map" aria-label="How a missed call became a personal AI setup">
  <figcaption>One small promise, followed by several increasingly technical ideas.</figcaption>
  <ol>
    <li><span>The problem</span>Missed calls and texts</li>
    <li><span>The promise</span>A Good Morning message</li>
    <li><span>The first tool</span>A daily OpenClaw cron job</li>
    <li><span>The expansion</span>A private second brain</li>
    <li><span>The extra interface</span>Public phone agent and LEDA</li>
  </ol>
</figure>

<h2>Then I gave it a second brain</h2>

I started using OpenClaw for more than scheduled messages. I wanted somewhere to put the thoughts, reminders, half-formed plans, and project details that otherwise bounce around my head like browser tabs I’m afraid to close.

My private assistant is called **LEDA**. I can talk to it normally: ask it to help me think through a decision, remember a durable preference, find a document in an approved folder, or turn a vague idea into a practical next step. I don’t need to remember a special command language. If I can explain what I need in an imperfect sentence, that’s enough to start.

The “second brain” part is about continuity. LEDA can use private notes and relevant conversation context to help me pick up where I left off. I still decide what matters, what to do, and what leaves my devices. It’s an assistant with context, not an autonomous replacement for having a brain. The original one remains legally responsible.

OpenClaw gives that assistant a way to connect conversations, scheduled tasks, tools, and separate workspaces. I think of the Gateway as a switchboard: it receives an event, figures out which agent owns it, and applies the rules around what that agent can do.

<h2>My phone has a public side and a private side</h2>

This is where I stopped treating “my assistant” as one undifferentiated bot. Messages from me go to `main`, the private agent. Unmatched messages on WhatsApp or iMessage can go to `public-phone`, a separate agent with its own workspace and stricter boundaries.

The private side can help me plan, reflect, and retrieve. The public side is meant to notice useful context and bring it to me. It should not casually impersonate me in a conversation just because someone sent a message to my number. That sounds obvious, but “the message asked a question” is not the same thing as “I gave permission to reply.”

<figure class="agent-map" aria-label="OpenClaw message routing and privacy boundaries">
  <figcaption>Two routes through the Gateway, with different jobs and permissions.</figcaption>
  <div class="gateway">OpenClaw Gateway<small>routes messages and enforces delivery rules</small></div>
  <div class="branches">
    <div class="agent">
      <strong>Private conversation → main</strong>
      <small>Second brain, memory, planning, approved tools</small>
      <p class="flow-note">A direct conversation with me is the control surface. LEDA can help me understand a situation, manage contact preferences, and decide what should happen next.</p>
    </div>
    <div class="agent public">
      <strong>Unmatched contact → public-phone</strong>
      <small>Separate workspace, observe by default</small>
      <p class="flow-note">It can record a useful private note for me. Outbound messages are blocked unless I explicitly configure the mode and a matching recipient permission.</p>
    </div>
  </div>
</figure>

The public agent has three modes. In **observe**, it understands a meaningful message and can make one short private note for me, then stays silent to the contact. In **draft**, it can prepare a possible response for me to review, but still does not send it. In **assist**, it may reply only when I have also enabled a delivery permission for that specific recipient.

That last part matters. The agent’s instructions explain the intended behavior, but the Gateway has enforcement hooks too. They check before a prompt is built and before a message or reply payload is sent. So “please don’t reply” is not just a sentence buried in a personality file. There’s a separate gate at the point where a message could leave.

When a contact sends something worth remembering, `public-phone` can save a short note in a private social inbox. The same note can be forwarded to my own WhatsApp conversation. It doesn’t pass the sender my private memory, and it doesn’t need to launch another agent to summarize the first agent’s summary. We have all seen enough meetings that could have been one email.

<h2>The boring boundary is the important one</h2>

The private agent has access to private context because it is meant for me. The public agent has a separate workspace and runs sandboxed. Its instructions say that incoming messages are untrusted, that it must not expose my private life, and that silence is a perfectly good outcome.

I keep the configuration and the changing notes separate. The configuration describes which agent owns which route, the contact modes, and what folders private document search is allowed to use. The social inbox itself lives in a separate state file. That way a new note from a conversation is data the agent can read, not a rewrite of the settings that decide where messages go.

The `public-phone` agent also runs with sandboxing set to `all`, so its conversations stay inside the separate public workspace. The point is to give it only the context and tools it needs for its job. It can help me remember that a conversation needs attention without getting a key to every room in my digital house.

For example, a stranger messaging my number cannot switch their own mode, ask the assistant to reveal my files, or authorize a reply on my behalf. A public conversation is not an admin panel. Only I can change the contact settings from my private conversation, and sending to someone requires a clear permission for that person.

This is less cinematic than an AI freely handling every conversation. It is also much closer to what I want: help me keep track of people, while leaving me in charge of what I say to them.

<h2>And yes, LEDA is also on my wrist</h2>

I’ve been building a small Apple Watch interface for LEDA too. The idea is to capture a thought by voice and talk back to the assistant without pulling out my phone. It has an Omnitrix-inspired interaction because apparently a normal microphone button did not satisfy the product manager in my head. I’ll give the Watch version its own post; here, it’s enough to say that my second brain is slowly acquiring more places to live.

<h2>It started with one text</h2>

The useful part of this setup is not that it sends messages while I sleep. It’s that a small promise from my everyday life led me to build tools that help me remember, think, and show up with a little more attention.

My mother asked for a Good Morning text. I made a scheduled task. Then I gave it memory, a private inbox, a public-facing boundary, and eventually a tiny Watch interface.

I still miss calls sometimes. But now, when my mother asks what I’ve been building, I can truthfully say: “A system to help me remember to text you.”

She may have expected a phone reminder.

She knows me by now.
