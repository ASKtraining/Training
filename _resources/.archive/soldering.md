---
version: '0.1.0'
layout: resource

resource:
    name: Soldering
    id: soldering
    url: https://en.wikipedia.org/wiki/Soldering
    authors:
        - name: Name of the author
          github-user: werwe
          email: rwewer@email.com
    release: v.1.0
    categories: [A, B]
    duration: 45
    difficulty: high
    cost: 20
    language: en
    connected-platforms:
        - blog: https://url-to-blog-post
        - telegram: https://url-to-telegram-group
        - wikifab: https://url-to-wikifab-project
        - other: https://url-to-github-project
#    new-issue: <generate url to new issue when creating the RDF>
#    license:
#        name: # generate name from repo
#        file: # generate file link from repo. If there is no file in root then link to repo.
#    manual: manual.md # if the manual file has the manual.md filename it could be generated
    materials:
      - name: Name of the material
        stockroom: https://url-to-material-product
        quantity: 1
        notes: material_notes
    tools:
      - name: Name of the tool
        stockroom: https://url-to-tool-prodct
        quantity: 1
        notes: tool_notes
---
