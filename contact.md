---
layout: page
title: Contact
permalink: /contact/
intro: For questions about an article, research collaboration, or invitations to speak.
---

{% assign a = site.author %}
<p class="contact-address">
  <strong>{{ a.name }}</strong><br>
  PhD Scholar, Banking &amp; Financial Markets<br>
  {{ a.department }}<br>
  {{ a.institution }}, {{ a.address }}
</p>

{% assign c = site.contact %}
<ul class="contact-list">
{% if c.email != "" %}<li><span>Email</span><a href="mailto:{{ c.email }}">{{ c.email }}</a></li>{% endif %}
{% if c.linkedin != "" %}<li><span>LinkedIn</span><a href="{{ c.linkedin }}" target="_blank" rel="noopener">linkedin.com/in/sandeepsingh-finance</a></li>{% endif %}
{% if c.orcid != "" %}<li><span>ORCID</span><a href="{{ c.orcid }}" target="_blank" rel="noopener">0009-0005-6386-3342</a></li>{% endif %}
{% if c.ssrn != "" %}<li><span>SSRN</span><a href="{{ c.ssrn }}" target="_blank" rel="noopener">Author page</a></li>{% endif %}
{% if c.researchgate != "" %}<li><span>ResearchGate</span><a href="{{ c.researchgate }}" target="_blank" rel="noopener">View profile</a></li>{% endif %}
{% if c.google_scholar != "" %}<li><span>Google Scholar</span><a href="{{ c.google_scholar }}" target="_blank" rel="noopener">View publications</a></li>{% endif %}
</ul>

I can't give personal investment advice or recommend specific stocks or funds. For that, please consult a SEBI-registered investment adviser.
