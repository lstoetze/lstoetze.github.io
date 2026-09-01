---
layout: page
permalink: /workingpaper/
title: working papers
description: 
topics: [Methods, "Election Forecasting", "Coalition Politics", "Populism & Radical Right", "Voting Decisions", "Representation", "Attitudes and Beliefs", "Party Competition"]
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->
<div class="publications">

{% include bib_search.html %}
{% include topic_filter.html %}

<h2> conditionally accepted </h2>
{% bibliography -f papers -q @*[status=condaccept] %}

<h2> revise and resubmit </h2>
{% bibliography -f papers -q @*[status=rar] %}

<h2> under review </h2>
{% bibliography -f papers -q @*[status=review] %}

<h2> in preparation</h2>
{% bibliography -f papers -q @*[status=conf] %}


</div>