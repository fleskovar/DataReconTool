class NodeManager{

    constructor(graph){        
        this.graph = graph;
    };

    AddNode(n_nodes_in, n_nodes_out, deletable=true, name='Node', ignore_graph=false, x=300, y=300){
	
		let graph = this.graph;
		
		var parent = graph.getDefaultParent();
		graph.getModel().beginUpdate();
		try
		{
			//Build input/output nodes
			var style = mxConstants.STYLE_DELETABLE+'=1';
			if(!deletable)
					style = mxConstants.STYLE_DELETABLE+'=0';
	
			if(n_nodes_out == 1 && n_nodes_in > 1)
				style +=';shape=triangle;perimeter=trianglePerimeter';
			else if (n_nodes_out > 1 && n_nodes_in == 1)
				style +=';shape=triangle;perimeter=trianglePerimeter;flipH=1';
	
			/*
			var doc = mxUtils.createXmlDocument();
			var node_data = doc.createElement('Node');
			node_data.setAttribute('value', name);
			node_data.tagName = name;
			*/
	
			var v = graph.insertVertex(parent, null, name, x, y, 80, 80, style);
			v.setConnectable(false);
			v.setAttribute('node', '1');
			
			if(ignore_graph)
				v.setAttribute('ignore_graph', '1');
			
				v.in_nodes = [];
			v.out_nodes = [];
	
			var in_style = 'fillColor=green;movable=1;shape=ellipse;'+mxConstants.STYLE_DELETABLE+'=0';
			var out_style = 'fillColor=red;movable=1;shape=ellipse;'+mxConstants.STYLE_DELETABLE+'=0';
		
			var l_in = 1.0 / (n_nodes_in+1);
			var l_out = 1.0 / (n_nodes_out+1);
	
			for(var i = 0; i < n_nodes_in; i++){
				var v_in = graph.insertVertex(v, null, '', 0, (i+1)*l_in, 10, 10, in_style);
				v_in.geometry.offset = new mxPoint(-5, -5);
				v_in.geometry.relative = true;
				v_in.setConnectable(true);
				v_in.setAttribute('port_type', 'in');
				v.in_nodes.push(v_in);
			}
	
			for(var i = 0; i < n_nodes_out; i++){
				var v_out = graph.insertVertex(v, null, '', 1, (i+1)*l_out, 10, 10, out_style);
				v_out.geometry.offset = new mxPoint(-5, -5);
				v_out.geometry.relative = true;
				v_out.setConnectable(true);
				v_out.setAttribute('port_type', 'out');
				v.out_nodes.push(v_out);
			}

			this.RepositionNodes(v.in_nodes);	
			this.RepositionNodes(v.out_nodes);	
	
		}
		finally
		{
			// Updates the display
			graph.getModel().endUpdate();
		}
	
    };
    
    
	ResizeNode(n_ports_in, n_ports_out)
	{			
		if(this.graph.getSelectionCount() == 1){
	
			var cell = this.graph.getSelectionCell();
	
			//Don't edit cells
			if(cell.isEdge())
				return;
	
			//Don't edit connection nodes
			while(cell.parent.id != "main"){
				cell = cell.parent;
			}	
			
			this.graph.getModel().beginUpdate();
			try
			{
				this.ResizeInputNodes(n_ports_in, cell);
				this.ResizeOutputNodes(n_ports_out, cell);
				this.UpdateNode(cell);			
			}
			finally
			{
				// Updates the display
				this.graph.getModel().endUpdate();
			}
	
		}
	};
	
	RepositionNodes(node_arr)
	{
		var n_nodes = node_arr.length;
		var l_in = 1.0 / (n_nodes+1);

		for(var i = 0; i < n_nodes; i++)
		{
			var v = node_arr[i];
			v.geometry.y = (i+1)*l_in;
			v.geometry.offset = new mxPoint(-5, -5);						
		}
	};

	UpdateNode(node)
	{
		this.graph.getView().clear(node, false, false);
    this.graph.getView().validate();
	};

	ResizeInputNodes(n_nodes, node)
	{
		var style = 'fillColor=green;movable=1;shape=ellipse;'+mxConstants.STYLE_DELETABLE+'=0';
		let node_arr = node.in_nodes;		
		this.ResizeGenericNodes(n_nodes, node_arr, node, style, 0.0);	
		this.RepositionNodes(node_arr);		
	};

	ResizeOutputNodes(n_nodes, node)
	{
		var style = 'fillColor=red;movable=1;shape=ellipse;'+mxConstants.STYLE_DELETABLE+'=0';
		let node_arr = node.out_nodes;		
		this.ResizeGenericNodes(n_nodes, node_arr, node, style, 1.0);				
		this.RepositionNodes(node_arr);	
	};

	ResizeGenericNodes(n_nodes, node_arr, node, style, x_pos)
	{
		var current_number_of_nodes = node_arr.length;
		let model = this.graph.getModel();

		while(current_number_of_nodes !=  n_nodes)
		{
			if(current_number_of_nodes < n_nodes){
				var v_out = this.graph.insertVertex(node, null, '', x_pos, 1, 10, 10, style);
				v_out.geometry.offset = new mxPoint(-5, -5);
				v_out.geometry.relative = true;
				v_out.setConnectable(true);
				node_arr.push(v_out);
			}
			else{				
				let remove_cell=node_arr.pop();				
				//Remove edges
				this.graph.removeCells(model.getEdges(remove_cell), false);
				//Remove node
				this.graph.removeCells([remove_cell], false);				
			}
			current_number_of_nodes = node_arr.length;
		}
	};

}

export {NodeManager}