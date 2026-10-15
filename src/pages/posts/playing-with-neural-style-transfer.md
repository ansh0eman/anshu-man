---
layout: ../../layouts/post.astro
title: "Playing with Neural Style Transfer"
pubDate: 2024-07-09
description: "An experiment with neural style transfer and Impressionist paintings."
author: "Anshu Man"
excerpt: "I tried giving my photos an Impressionist makeover with neural style transfer. Some of the results were surprisingly good; some were just very committed to the brushstrokes."
image:
  src:
  alt:
tags: ["Art", "Deep Learning", "AI"]
---

Hello World! 😉

I've always liked Impressionist paintings: the visible brushstrokes, the light, and the way a scene can feel familiar and strange at once. So I tried making my own images in that spirit with **neural style transfer**.

The idea is to start with two images. The **content image** supplies the scene; the **style image** supplies visual patterns such as colour and texture. The generated image tries to keep the first while borrowing from the second.

<img src="/nst.png" alt="Diagram showing a content image and a style image combined into a neural style transfer result" class="w-full" />

I used a pretrained VGG-19 network to represent features from the images. Its earlier layers respond to simpler visual features, while deeper layers capture more complex ones. Optimising the generated image against those representations is what makes the mix possible.

For the experiment, I pulled content photos from my computer and paired them with paintings. The outputs kept recognisable parts of the original scenes while picking up colour and brushstroke patterns from the style images. Here are a few results:

<img src="/4.png" alt="Photo of two people blended with the gold textures of Klimt's The Kiss" class="w-full" />
<img src="/3.png" alt="Photo of two people blended with the swirling blue sky of Van Gogh's Starry Night" class="w-full" />
<img src="/2.png" alt="Seated person blended with the blues and yellows of Van Gogh's Starry Night" class="w-full" />
<img src="/6.png" alt="Group photo blended with the gold patterning of Klimt's The Kiss" class="w-full" />
<img src="/1.png" alt="Seated person blended with the colours of a poppy-field painting" class="w-full" />

There's always room to tune the settings and let it run longer. For now, I like that the results sit somewhere between a photo, a painting, and a small machine-made surprise.
