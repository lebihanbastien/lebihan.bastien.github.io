---
layout: post
title: "Testing Sidenotes"
permalink: sidenotes
cover: rhino.png
draft: false
test: true
categories:
  - Tests
---

{% include image.html name="rhino.png" %}

Une page de test pour le CSS inspiré de tufte-jekyll

<!--more-->

# Testing Sidenotes


Sidenotes{% sidenote 'sn-id-whatever' 'This is a sidenote and *displays a superscript*'%} display a superscript. The *sidenote* Liquid tag contains two components. The first is an identifier allowing the sidenote to be targeted by the twitchy index fingers of mobile device users so that all the yummy sidenote goodness is revealed when the superscript is tapped. The second components is the actual content of the sidenote. Both of these components should be enclosed in single quotes. Note that we are using the CSS 'counter' trick to automagically keep track of the number sequence on each page or post. On small screens, the sidenotes disappear and when the superscript is clicked, a side note will open below the content, which can then be closed with a similar click. Here is the markup for the sidenote at the beginning of this paragraph{% sidenote 'sn-id-2' 'This is a sidenote and *displays a superscript*'%}.


# Testing Margin Figures

{% marginfigure 'mf-id-1' 'assets/img/rhino.png' 'F.J. Cole, “The History of Albrecht Dürer’s Rhinoceros in Zoological Literature,” *Science, Medicine, and History: Essays on the Evolution of Scientific Thought and Medical Practice* (London, 1953), ed. E. Ashworth Underwood, 337-356. From page 71 of Edward Tufte’s *Visual Explanations*.'  %}


# Testing epigraphs

{% epigraph 'text of citation' 'author of citation' 'citation source' %}

{% epigraph 'For a successful technology, reality must take precedence over public relations, for Nature cannot be fooled.' 'Richard P. Feynman' ' “What Do You Care What Other People Think?” ' %}

> People think focus means saying yes to the thing you've got to focus on. But that's not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick carefully. I'm actually as proud of the things we haven't done as the things I have done. Innovation is saying no to 1,000 things.

<cite>Steve Jobs</cite> --- Apple Worldwide Developers' Conference, 1997*


# Testing equations

The Markdown parser being used by this Jekyll theme is Kramdown, which contains some built-in [Mathjax](//www.mathjax.org) support. Both inline and block-level mathematical figures can be added to the content.

For instance, the following inline sequence:

*When $$ a \ne 0 $$, there are two solutions to $$ ax^2 + bx + c = 0 $$*

Similarly, this block-level Mathjax expression:

$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

# Testing Table

|                 |mpg  | cyl  |  disp  |   hp   |  drat  | wt  |
|:----------------|----:|-----:|-------:|-------:|-------:|----:|
|Mazda RX4        |21   |6     |160     |110     |3.90    |2.62 |
|Mazda RX4 Wag    |21   |6     |160     |110     |3.90    |2.88 |
|Datsun 710       |22.8 |4     |108     |93      |3.85    |2.


