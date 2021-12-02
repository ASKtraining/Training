<li class="resource resource-2" data-duration="90" data-name="Wind Turbine" data-cost="60" data-space="20" data-internet="no" data-power="no">
    <div class="time">
        <i class="far fa-clock"></i> <span class='clock-time'>03:45pm - 05:15pm</span>
        <div class="edit-time">
            <form>
                <label>Duration:</label>
                <input type="number" class="duration" placeholder="10" min="0" max="59">
                <span>minutes</span>
                <input class="submit button" type="button" value="Save">
                <input class="close button" type="button" value="Close">
            </form>
        </div>
    </div>
    <div class="content">
        <a href="#" class="button">Manual <i class="fas fa-file-download"></i></a>
        <div>XXXXXXXXXX | medium | 90 minutes | 60 $</div>
    </div>
    <div class="clearer"></div>
</li>



<!-- ---
version: '0.1.0'

resource:
    name: MyBigFatTrainingModuleResource
    id: example-resource
    authors:
        - name: Name of the author
          github-user: werwe
          email: rwewer@email.com
    release: v.1.0
    categories: [A, B]
    duration: HH:MM
    difficulty: high
    cost: 99 Eur
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

{% include resource.html %} -->