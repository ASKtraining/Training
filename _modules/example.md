---
# SPDX-FileCopyrightText: 2020 Robin Vobruba <hoijui.quaero@gmail.com>
#
# SPDX-License-Identifier: CC-BY-SA-4.0

# This is a meta-data file for a training module,
# as described here:
# https://github.com/ASKtraining/Module/blob/main/README.md
# The whole Training system is described here:
# https://github.com/opencultureagency/Training.Template/blob/main/README.md

version: '0.1.0'

module:
    name: 'Example Module'
    id: example-module
    tag: battery
    authors:
        - name: BaMa
          email: test@bla.com
          github-user: test
          telegram: test
    release: v.1.0
    duration: 90
    max-participants: 10
    compatibility: ASKotec2.0 or newer
    blog: https://url-to-blog-posts
    issues: https://url-to-issue-list
    new-issue: https://url-to-new-issue
    licenses:
        - name: CC-BY-SA-4.0
          file: LICENSE.md
    manual: Manual.md
    resources:
        - rdf-url: https://opencultureagency.github.io/Training.Module.Resource.Template/resource.ttl
#        - yaml-url: https://raw.githubusercontent.com/opencultureagency/Training.Module.Resource.Template/main/resource.yml
---

{% include_relative _resources/example.md %}





<!-- {% for resource in site.resources %}
  {{ resource.content }}
{% endfor %} -->


