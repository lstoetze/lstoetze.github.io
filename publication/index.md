---
layout: page
title: Publications
modified: 2014-08-08T20:53:07.573882-04:00
comments: true
share: false
bio : true
image:
  feature: background.jpg
---


<h3>Peer-reviewed</h3>

<dl>
{% for publication in site.data.publication %}
	{% if publication.type == "peer-reviewed" %}
  	<dt>  <strong>{{publication.name}}</strong> <i>{{ publication.journal }}</i> 
  	{% if publication.coauthors != "none" %} (with {{ publication.coauthors }})
	{% endif %}
	{% endif %}
{% endfor %}
</dl>


<h3>Book-reviews & Other</h3>


<dl>
{% for publication in site.data.publication %}
	{% if publication.type == "other" %}
  	<dt>  {{publication.name}} <i>{{ publication.journal }}</i>
  	{% if publication.coauthors != "none" %} (with {{ publication.coauthors }})
	{% endif %}
	{% endif %}
{% endfor %}
</dl>

