---
layout: base.njk
tags: 
    - docs
---
# Docs

This version: {{ versions.latest }}

Incididunt anim irure enim id enim minim mollit mollit Lorem sint ipsum pariatur. Cillum commodo esse sint ad est qui consectetur ipsum laboris labore anim.


## Other versions
<ul id="versionsList">
</ul>
<script type="module" src="/{{site.rootSubdir}}/versions.js"></script>
<script type="module">
    import { getLatest, getReleases } from '/{{site.rootSubdir}}/versions.js';
    document.addEventListener("DOMContentLoaded", e => {
        let versionsList = document.querySelector("#versionsList");
        let latest = getLatest();
        let releases = getReleases();
        versionsList.innerHTML = `
            ${releases.map(release => 
            `<li>
                <a href="/{{site.rootSubdir}}${release !== latest ? `/${release}` : ``}/{{site.docsSubdir}}">${release}</a>${release === latest ? `<span style="font-style: italic">&nbsp;(Latest)</span>` : `` }</a>
                ${release === "{{ versions.latest }}" ? `<span style="font-style: italic">&nbsp;(This)</span>` : ``}
            </li>`).join('')
            }`;
    });
</script>



