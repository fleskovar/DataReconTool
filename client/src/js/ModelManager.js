import {NodeManager} from './NodeManager'

class ModelManager{

    constructor(graph){
        this.graph = graph;
        this.node_manager = new NodeManager(graph);
    }

    BuildDefaultModel(graph)
	{		
		// Gets the default parent for inserting new cells. This
		// is normally the first child of the root (ie. layer 0).
		var parent = graph.getDefaultParent();
		parent.id = "main";
		this.node_manager.AddNode(0, 1, false, 'Input', true, 300, 100);
		this.node_manager.AddNode(1, 0, false, 'Output', true, 500, 100);
    };
    
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
	  
	GetModelXML()
	{
		let graph = this.graph;
		var enc = new mxCodec();
		var node = enc.encode(graph.getModel());
	
		var xmlString = mxUtils.getPrettyXml(node);	
		return xmlString;
	};

	AddNode(in_nodes, out_nodes)
	{
		this.node_manager.AddNode(in_nodes, out_nodes);
	}

	ResizeNode(in_nodes, out_nodes)
	{
		this.node_manager.ResizeNode(in_nodes, out_nodes);
	}

}

export{ModelManager}