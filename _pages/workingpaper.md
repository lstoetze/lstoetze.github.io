---
layout: page
permalink: /workingpaper/
title: working papers
description: 
nav: true
nav_order: 1
---

<!-- _pages/publications.md -->
<div class="publications">

<h2> under review </h2>
{% bibliography -f papers -q @*[status=review] %}

<h2> in preparation</h2>
{% bibliography -f papers -q @*[status=conf] %}


</div>