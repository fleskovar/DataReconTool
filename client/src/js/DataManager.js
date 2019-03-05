export class DataManager
{
    constructor(graph)
    {
        this.graph = graph;
    }

    ReadSingleFile(e)
    {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            // Display file content
            LoadModel(contents);
        };
        reader.readAsText(file);
    };

    LoadModel(contents)
    {
        let graph = this.graph;
        var file = contents;
        //var xmlDoc = mxUtils.load(url).getXml();
        var xmlDoc = mxUtils.parseXml(file);
        var node = xmlDoc.documentElement;
        var dec = new mxCodec(node.ownerDocument);
        dec.decode(node, graph.getModel());
    };
}