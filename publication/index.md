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
[<a name="Risk2018">1</a>]
</td>
<td class="bibtexitem">
Verena Mack and Lukas&nbsp;F. Stoetzer.
 Election fraud, digit tests and how humans fabricate vote counts -
  An experimental approach.
 <em>Electoral Studies</em>, First View, 2018.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Stoetzer2019">2</a>]
</td>
<td class="bibtexitem">
Lukas&nbsp;F. Stoetzer, Thomas Gschwend, Marcel Neunhoeffer, Simon Munzert, and
  Sebastian Sternberg.
 Forecasting Elections in Multi-Party Systems: A Bayesian Approach
  Combining Polls and Fundamentals.
 <em>Political Analysis</em>, First View, 2018.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="NAUMANN2018">1</a>]
</td>
<td class="bibtexitem">
Elias Naumann, Lukas F. Stoetzer, and Giuseppe Pietrantuono.
 Attitudes towards highly skilled and low-skilled immigration in
  Europe: A survey experiment in 15 European countries.
 <em>European Journal of Political Research</em>, pages 1--22, 2018.
  First View.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Naumann2017">2</a>]
</td>
<td class="bibtexitem">
Elias Naumann and Lukas&nbsp;F. Stoetzer.
 Immigration and support for redistribution: survey experiments in
  three European countries.
 <em>West European Politics</em>, 41(1):80--101, 2018.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Stoetzer">3</a>]
</td>
<td class="bibtexitem">
Lukas&nbsp;F. Stoetzer.
 A matter of representation: spatial voting and inconsistent policy
  preferences.
 <em>British Journal of Political Science</em>, pages 1--16, 2017. First
  View.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Gschwend">4</a>]
</td>
<td class="bibtexitem">
Thomas Gschwend, Michael&nbsp;F. Meffert, and Lukas&nbsp;F. Stoetzer.
 Weighting Parties and Coalitions: How Coalition Signals Influence
  Voting Behavior.
 <em>Journal of Politics</em>, 79(2):642--655, 2017.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Munzert2017">5</a>]
</td>
<td class="bibtexitem">
Simon Munzert, Lukas&nbsp;F. Stoetzer, Thomas Gschwend, Marcel Neunhoeffer,
  Sebastian Sternberg, and Steffen Zittlau.
 Zweitstimme.org. Ein strukturell-dynamisches Vorhersagemodell
  f&uuml;r Bundestagswahlen.
 <em>Politische Vierteljahresschrift</em>, 58(3):418--441, 2017.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Gschwend2016">6</a>]
</td>
<td class="bibtexitem">
Thomas Gschwend, Lukas Stoetzer, and Steffen Zittlau.
 What drives rental votes? How coalitions signals facilitate
  strategic coalition voting.
 <em>Electoral Studies</em>, 44:293--306, 2016.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Stoetzer2015">7</a>]
</td>
<td class="bibtexitem">
Lukas&nbsp;F. Stoetzer and Steffen Zittlau.
 Multidimensional Spatial Voting with Non-separable Preferences.
 <em>Political Analysis</em>, 23(3):415--428, 2015.

</td>
</tr>


<tr valign="top">
<td align="right" class="bibtexnumber">
[<a name="Stoetzer2015a">8</a>]
</td>
<td class="bibtexitem">
Lukas&nbsp;F. Stoetzer, Steffen Zittlau, Thomas Gschwend, and Tobias Witt.
 Leihstimmen in Bundestagswahljahr 2013.
 <em>Zeitschrift f&uuml;r Politische Psychologie</em>, (1):88--107,
  2015.

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
