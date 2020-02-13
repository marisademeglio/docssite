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
<script type="module" src="{{ 'versions.js' | addSiteRootPath }}"></script>
<script type="module" src="{{ 'site.js' | addSiteRootPath }}"></script>
<script type="module">
    import { getLatest, getReleases } from '{{ 'versions.js' | addSiteRootPath }}';
    import { getSitePath, getDocsPath } from '{{ 'site.js' | addSiteRootPath }}';
    document.addEventListener("DOMContentLoaded", e => {
        let versionsList = document.querySelector("#versionsList");
        let latest = getLatest();
        let releases = getReleases();
        let thisVersion = "{{ versions.latest }}";
        versionsList.innerHTML = `
            ${releases.map(release => {
                let href = getDocsPath(release);
                return release !== latest ? 
                    `<li>
                        <a href="${href}">${release}</a>
                        ${release === thisVersion ? 
                            `<span style="font-style: italic">&nbsp;(This)</span>` 
                            : ``
                        }
                    </li>
                    ` : '';                
            })
            .join('')
        }`;
    });
</script>



