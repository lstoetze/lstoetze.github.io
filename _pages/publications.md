---
layout: page
permalink: /publications/
title: publications
description: 
years: [2026,2025,2024,2023,2022,2021,2020,2019,2018,2017,2016,2015]
topics: [Methods, "Election Forecasting", "Coalition Politics", "Populism & Radical Right", "Voting Decisions", "Representation"]
nav: true
nav_order: 1
---
<!-- _pages/publications.md -->
<div class="publications">
Peer-reviewed Journal Articles

{% include bib_search.html %}
{% include topic_filter.html %}

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}} && status=published] %}
{% endfor %}

</div>
