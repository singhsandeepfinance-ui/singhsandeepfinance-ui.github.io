---
layout: page
title: Contact
permalink: /contact/
intro: For questions about an article, research collaboration, or invitations to speak.
---

{% assign c = site.contact %}
{% if c.email != "" or c.linkedin != "" or c.google_scholar != "" or c.researchgate != "" or c.orcid != "" %}
<ul class="contact-list">
{% if c.email != "" %}<li><span>Email</span><a href="mailto:{{ c.email }}">{{ c.email }}</a></li>{% endif %}
{% if c.linkedin != "" %}<li><span>LinkedIn</span><a href="{{ c.linkedin }}" target="_blank" rel="noopener">View profile</a></li>{% endif %}
{% if c.google_scholar != "" %}<li><span>Google Scholar</span><a href="{{ c.google_scholar }}" target="_blank" rel="noopener">View publications</a></li>{% endif %}
{% if c.researchgate != "" %}<li><span>ResearchGate</span><a href="{{ c.researchgate }}" target="_blank" rel="noopener">View profile</a></li>{% endif %}
{% if c.orcid != "" %}<li><span>ORCID</span><a href="{{ c.orcid }}" target="_blank" rel="noopener">View record</a></li>{% endif %}
</ul>
{% else %}
<p class="empty">Contact details will be added here soon.</p>
{% endif %}

I can't give personal investment advice or recommend specific stocks or funds. For that, please consult a SEBI-registered investment adviser.
