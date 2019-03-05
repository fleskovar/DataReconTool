import {NodeManager} from './NodeManager'
import {DataManager} from './DataManager'
import {Stream, Node} from './ReconciliationModel'

class ModelManager{

	constructor(graph){
			this.graph = graph;
			this.node_manager = new NodeManager(graph);
			this.data_manager = new DataManager(graph);
			this.streams = [];
			this.nodes = [];
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
		this.data_manager.ReadSingleFile(e);
	};
	
	LoadModel(content)
	{
		this.data_manager.LoadModel(content);
	}
	  
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
		var node = new Node();
		this.nodes.push(node);
	}

	ResizeNode(in_nodes, out_nodes)
	{
		this.node_manager.ResizeNode(in_nodes, out_nodes);
	}

	AddStream()
	{
		 var stream = new Stream();
		 this.streams.push(stream);
	}

}

export{ModelManager}