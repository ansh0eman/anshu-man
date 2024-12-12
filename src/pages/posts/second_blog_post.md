---
layout: ../../layouts/post.astro
title: "Art Generation with Neural Style Transfer Model."
pubDate: 2023-12-24
description: "Exploring Neural Style Transfer with Impressionism!"
author: "anshu man"
excerpt: as a fan of art history, i decided to experiment with some impressionist art. impressionism, a revolutionary 19th-century art movement, is known for its small, thin, yet visible brush strokes, open compositions, and emphasis on the ever-changing qualities of light.
image:
  src:
  alt:
tags: ["tag1", "tag2", "tag3"]
---

## Exploring Neural Style Transfer with Impressionism!

Hello World!. 😉 

as a fan of art history, i decided to experiment with some impressionist art. ***impressionism***, a revolutionary 19th-century art movement, is known for its small, thin, yet visible brush strokes, open compositions, and emphasis on the ever-changing qualities of light.

i've recently been diving into the fascinating world of <h1 style="margin-top: 1.2em" >**neural style transfer** (nst)</h1>one of the coolest optimization techniques in deep learning. nst essentially merges two images: **the content image** and the **style image**, repainting the content image in the style (?) of the referenced image. us to merge two images—a "content" image and a "style" image —to create a "generated" image that beautifully blends the content of first image with the style of other.

<img src="/nst.png" alt="Personal Image" class="shadow-lg w-full object-repeat" style="max-width: 100%; height: auto; border-radius:0 " />


 I used ***VGG-19***, a 19-layer version of the VGG network. This model has already been trained on the very large ImageNet database, and has learned to recognize a variety of low level features (at the shallower layers) and high level features (at the deeper layers).

The Impressionism movement began with a group of paris-based artists in the 1870s and 1880s and faced significant opposition from the conventional art community at the time. fun fact: the name 
# "impressionism"
 comes from claude monet's painting, impression, soleil levant (impression, sunrise), which inspired a critic to coin the term in a satirical review.

for my experiment, i used multiple pictures from my pc (whatever there was) as the content image and multiple paintins as the style image. the results were pretty insane. the generated image kept the landscape's structure while adopting the style image's vibrant brushstrokes and colors. it was like merging the past and present on one canvas.

<img src="/4.png" alt="Personal Image" class="shadow-lg w-full object-repeat" style="max-width: 100%; height: auto; border-radius:0 " />
<img src="/3.png" alt="Personal Image" class="shadow-lg w-full object-repeat" style="max-width: 100%; height: auto; border-radius:0 " />
<img src="/2.png" alt="Personal Image" class="shadow-lg w-full object-repeat" style="max-width: 100%; height: auto; border-radius:0 " />
<img src="/6.png" alt="Personal Image" class="shadow-lg w-full object-repeat" style="max-width: 100%; height: auto; border-radius:0 " />
<img src="/1.png" alt="Personal Image" class="shadow-lg w-full object-repeat" style="max-width: 100%; height: auto; border-radius:0 " />

there's always room for improvement with some hyperparameter magic and longer training—if only i had a quantum computer.
