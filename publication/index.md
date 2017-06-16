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

<table>

<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Stoetzer">2</a>]
</td>
<td class="bibtexitem">
Lukas&nbsp;F. Stoetzer.
 A matter of representation: spatial voting and inconsistent policy
  preferences.
 <em>British Journal of Political Science</em>, 2017.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Gschwend">3</a>]
</td>
<td class="bibtexitem">
Thomas Gschwend, Michael&nbsp;F. Meffert, and Lukas&nbsp;F. Stoetzer.
 Weighting Parties and Coalitions: How Coalition Signals Influence
  Voting Behavior.
 <em>Journal of Politics</em>, 79(2):642-655, 2017.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Gschwend2016">4</a>]
</td>
<td class="bibtexitem">
Thomas Gschwend, Lukas Stoetzer, and Steffen Zittlau.
 What drives rental votes? How coalitions signals facilitate
  strategic coalition voting.
 <em>Electoral Studies</em>, 44:293-306, 2016.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Stoetzer2015a">5</a>]
</td>
<td class="bibtexitem">
Lukas&nbsp;F. Stoetzer, Steffen Zittlau, Thomas Gschwend, and Tobias Witt.
 Leihstimmen in Bundestagswahljahr 2013.
 <em>Zeitschrift f&uuml;r Politische Psychologie</em>, (1):88-107,
  2015.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Stoetzer2015">6</a>]
</td>
<td class="bibtexitem">
Lukas&nbsp;F Stoetzer and Steffen Zittlau.
 Multidimensional Spatial Voting with Non-separable Preferences.
 <em>Political Analysis</em>, 23:415-428, 2015.

</td>
</tr>

</table>

<hr>

<h3>Book-reviews</h3>

<dl>
{% for publication in site.data.publication %}
	{% if publication.type == "other" %}
  	<dt>  {{publication.name}}. <i>{{ publication.journal }}</i>
  	{% if publication.coauthors != "none" %} (with {{ publication.coauthors }})
	{% endif %}
	{% endif %}
{% endfor %}
</dl>
