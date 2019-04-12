import {ModelManager} from './ModelManager'
//import Vue from 'vue';

class Canvas{

    constructor(canvas, store){
		this.store = store;        
        this.canvas = canvas;
		this.graph = null;
		this.initCanvas(canvas);
			
						
		this.model_manager = new ModelManager(this.graph);		
		this.model_manager.BuildDefaultModel(this.graph);	
		
	}
	
	drawCanvas(container_id){
		var container = document.getElementById(container_id);
		this.graph.init(container);
		this.graph.refresh();
		mxEvent.disableContextMenu(container);
	}

    initCanvas(container)
    {        
	// Checks if the browser is supported
		if (!mxClient.isBrowserSupported())
		{
			// Displays an error message if the browser is not supported.
			mxUtils.error('Browser is not supported!', 200, false);
		}
		else
		{
			// Creates the graph inside the given container
			
			this.graph = new mxGraph(container);
			let graph = this.graph;		
			
			graph.setConnectable(true);
			graph.setTooltips(true);
			
			graph.setPanning(true);
			// Forces panning for middle and right mouse buttons
			//var panningHandlerIsForcePanningEvent = graph.panningHandler.isForcePanningEvent;
			graph.panningHandler.isForcePanningEvent = function(me)
			{
				// Ctrl+left button makes panning
				return  ((mxEvent.isAltDown(me.getEvent()) &&
					mxEvent.isLeftMouseButton(me.getEvent())) ||
					mxEvent.isMiddleMouseButton(me.getEvent()));
			};
			
			mxEvent.disableContextMenu(container);			
			graph.vertexLabelsMovable = true;

			// Sets the default edge style
			var style = graph.getStylesheet().getDefaultEdgeStyle();
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;

			// Ports are not used as terminals for edges, they are
			// only used to compute the graphical connection point
			graph.isPort = function(cell)
			{
				var geo = this.getCellGeometry(cell);
				return false;
				//return (geo != null) ? geo.relative : false;
			};

			// Implements a tooltip that shows the actual
			// source and target of an edge
			graph.getTooltipForCell = function(cell)
			{
				if (this.model.isEdge(cell))
				{
					return this.convertValueToString(this.model.getTerminal(cell, true)) + ' => ' +
						this.convertValueToString(this.model.getTerminal(cell, false))
				}

				return mxGraph.prototype.getTooltipForCell.apply(this, arguments);
			};

			mxEvent.addMouseWheelListener(mxUtils.bind(this, function(evt, up)
			{
				//if (evt.altKey == true){
					if(up == true)
						graph.zoomIn();
					else graph.zoomOut();

				//}	
			}));

			// Removes the folding icon and disables any folding
			graph.isCellFoldable = function(cell)
			{
				return false;
			};

			//Adding new connection event
			graph.connectionHandler.addListener(mxEvent.CONNECT, (sender, evt) =>
			{
				this.model_manager.AddStream();
				//TODO: Create library of connection here.	
				
				var edge = evt.getProperty('cell');	
				edge.properties = [];

				//Automatically asigns name to cell. Could be made quicker if last index used is stored
				var edge_index = 0;
				var label = 'F'+edge_index;
				var index = this.store.state.stream_labels.indexOf(label);

				do{
					++edge_index;
					label = 'F'+edge_index;
					index = this.store.state.stream_labels.indexOf(label);
				}while(index != -1);

				edge.label = label;
				this.store.state.stream_labels.push(label);

				var mass_flow_rate_obj = {
					label: 'Flow_rate',
					id: 'fr',
					optional: true,
					measured: false,
					data_tag: '',
					units: 'barg',
					value: 0.0,
					sd: 0.0,
					reconciled_value: 0.0,
					fixed: false					
				};	
				
				edge.properties.push(mass_flow_rate_obj);
				
				
				/*
				edge.setAttribute('measured', 'false');
				edge.setAttribute('data_tag', '');
				edge.setAttribute('mass_flow_rate', '');
				*/
				/*
				var source = graph.getModel().getTerminal(edge, true);
			   
			    var style = graph.getCellStyle(edge);
			    var sourcePortId = style[mxConstants.STYLE_SOURCE_PORT];
				var targetPortId = style[mxConstants.STYLE_TARGET_PORT];
				*/
			 
			});

			//Adding double click event
			graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
				var cell = evt.getProperty('cell');
				if (cell!=null){
					if (cell.vertex!=null && cell.vertex==1){
						//console.log(cell.userData);
						if (cell.userData && cell.userData.isGroup){	//custom
							//is group, do nothing
						}else{
							//is cell, open cell edit panel    
							this.OpenCell(cell);
						}
					}else if (cell.edge!=null && cell.edge==1){
						//is edge, open edge edit
						this.OpenEdge(cell);
					}
				}
			});

			// Enables rubberband selection
			new mxRubberband(graph);
			graph.setAllowDanglingEdges(false);
			graph.setMultigraph(true);
			graph.setAllowLoops(false);

			// Removes cells when [DELETE] is pressed
			var keyHandler = new mxKeyHandler(graph);
			keyHandler.bindKey(46, function(evt)
			{
				if (graph.isEnabled())
				{
					graph.removeCells();
				}
			});


			graph.isValidConnection = function(source,target){

				var valid_source_target = graph.isValidSource(source) && graph.isValidTarget(target);

				if(!valid_source_target)
					return false;
				else{
					if(source.parent.id == target.parent.id)
						return false;
					else return true;
				}
			}

			this.EnableJumpLines(graph);
		}	
	}

	EnableJumpLines(graph)
	{

		graph.lineJumpsEnabled = true;
	
		/**
		 * Default size for line jumps.
		 */
		graph.defaultJumpSize = 6;
	
		/**
		 * Reset the list of processed edges.
		 */
		var mxGraphViewResetValidationState = mxGraphView.prototype.resetValidationState;
	
		mxGraphView.prototype.resetValidationState = function()
		{
			mxGraphViewResetValidationState.apply(this, arguments);
	
			this.validEdges = [];
		};
	
		/**
		 * Updates jumps for valid edges and repaints if needed.
		 */
		var mxGraphViewValidateCellState = mxGraphView.prototype.validateCellState;
	
		mxGraphView.prototype.validateCellState = function(cell, recurse)
		{
			var state = this.getState(cell);
	
			// Forces repaint if jumps change on a valid edge
			if (state != null && this.graph.model.isEdge(state.cell) &&
				state.style != null && state.style[mxConstants.STYLE_CURVED] != 1 &&
				!state.invalid && this.updateLineJumps(state))
			{
				this.graph.cellRenderer.redraw(state, false, this.isRendering());
			}
	
			state = mxGraphViewValidateCellState.apply(this, arguments);
	
			// Adds to the list of edges that may intersect with later edges
			if (state != null && this.graph.model.isEdge(state.cell) &&
				state.style[mxConstants.STYLE_CURVED] != 1)
			{
				// LATER: Reuse jumps for valid edges
				this.validEdges.push(state);
			}
	
			return state;
		};
	
		/**
		 * Forces repaint if routed points have changed.
		 */
		var mxCellRendererIsShapeInvalid = mxCellRenderer.prototype.isShapeInvalid;
	
		mxCellRenderer.prototype.isShapeInvalid = function(state, shape)
		{
			return mxCellRendererIsShapeInvalid.apply(this, arguments) ||
				(state.routedPoints != null && shape.routedPoints != null &&
				!mxUtils.equalPoints(shape.routedPoints, state.routedPoints))
		};
	
	
		/**
		 * Updates jumps for invalid edges.
		 */
		var mxGraphViewUpdateCellState = mxGraphView.prototype.updateCellState;
	
		mxGraphView.prototype.updateCellState = function(state)
		{
			mxGraphViewUpdateCellState.apply(this, arguments);
	
			// Updates jumps on invalid edge before repaint
			if (this.graph.model.isEdge(state.cell) &&
				state.style[mxConstants.STYLE_CURVED] != 1)
			{
				this.updateLineJumps(state);
			}
		};
	
		/**
		 * Updates the jumps between given state and processed edges.
		 */
		mxGraphView.prototype.updateLineJumps = function(state)
		{
			var pts = state.absolutePoints;
	
			if (graph.lineJumpsEnabled)
			{
				var changed = state.routedPoints != null;
				var actual = null;
	
				//if (pts != null && this.validEdges != null &&
				//	mxUtils.getValue(state.style, 'jumpStyle', 'none') !== 'none')
	
				if (pts != null && this.validEdges != null)
				{
					var thresh = 0.5 * this.scale;
					changed = false;
					actual = [];
	
					// Type 0 means normal waypoint, 1 means jump
					function addPoint(type, x, y)
					{
						var rpt = new mxPoint(x, y);
						rpt.type = type;
	
						actual.push(rpt);
						var curr = (state.routedPoints != null) ? state.routedPoints[actual.length - 1] : null;
	
						return curr == null || curr.type != type || curr.x != x || curr.y != y;
					};
	
					for (var i = 0; i < pts.length - 1; i++)
					{
						var p1 = pts[i + 1];
						var p0 = pts[i];
						var list = [];
	
						// Ignores waypoints on straight segments
						var pn = pts[i + 2];
	
						while (i < pts.length - 2 &&
							mxUtils.ptSegDistSq(p0.x, p0.y, pn.x, pn.y,
							p1.x, p1.y) < 1 * this.scale * this.scale)
						{
							p1 = pn;
							i++;
							pn = pts[i + 2];
						}
	
						changed = addPoint(0, p0.x, p0.y) || changed;
	
						// Processes all previous edges
						for (var e = 0; e < this.validEdges.length; e++)
						{
							var state2 = this.validEdges[e];
							var pts2 = state2.absolutePoints;
	
							if (pts2 != null && mxUtils.intersects(state, state2) && state2.style['noJump'] != '1')
							{
								// Compares each segment of the edge with the current segment
								for (var j = 0; j < pts2.length - 1; j++)
								{
									var p3 = pts2[j + 1];
									var p2 = pts2[j];
	
									// Ignores waypoints on straight segments
									pn = pts2[j + 2];
	
									while (j < pts2.length - 2 &&
										mxUtils.ptSegDistSq(p2.x, p2.y, pn.x, pn.y,
										p3.x, p3.y) < 1 * this.scale * this.scale)
									{
										p3 = pn;
										j++;
										pn = pts2[j + 2];
									}
	
									var pt = mxUtils.intersection(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
	
									// Handles intersection between two segments
									if (pt != null && (Math.abs(pt.x - p2.x) > thresh ||
										Math.abs(pt.y - p2.y) > thresh) &&
										(Math.abs(pt.x - p3.x) > thresh ||
										Math.abs(pt.y - p3.y) > thresh))
									{
										var dx = pt.x - p0.x;
										var dy = pt.y - p0.y;
										var temp = {distSq: dx * dx + dy * dy, x: pt.x, y: pt.y};
	
										// Intersections must be ordered by distance from start of segment
										for (var t = 0; t < list.length; t++)
										{
											if (list[t].distSq > temp.distSq)
											{
												list.splice(t, 0, temp);
												temp = null;
	
												break;
											}
										}
	
										// Ignores multiple intersections at segment joint
										if (temp != null && (list.length == 0 ||
											list[list.length - 1].x !== temp.x ||
											list[list.length - 1].y !== temp.y))
										{
											list.push(temp);
										}
									}
								}
							}
						}
	
						// Adds ordered intersections to routed points
						for (var j = 0; j < list.length; j++)
						{
							changed = addPoint(1, list[j].x, list[j].y) || changed;
						}
					}
	
					var pt = pts[pts.length - 1];
					changed = addPoint(0, pt.x, pt.y) || changed;
				}
	
				state.routedPoints = actual;
	
				return changed;
			}
			else
			{
				return false;
			}
		};

		/**
		 * Overrides painting the actual shape for taking into account jump style.
		 */
		var mxConnectorPaintLine = mxConnector.prototype.paintLine;

		mxConnector.prototype.paintLine = function (c, absPts, rounded)
		{
			// Required for checking dirty state
			this.routedPoints = (this.state != null) ? this.state.routedPoints : null;

			if (this.outline || this.state == null || this.style == null ||
				this.state.routedPoints == null || this.state.routedPoints.length == 0)
			{
				mxConnectorPaintLine.apply(this, arguments);
			}
			else
			{
				
				var arcSize = 6 / 2;
				var size = (6.0 - 2.0) / 2.0 + this.strokewidth;
				
				var style = "gap";
				//var f = Editor.jumpSizeRatio;
				var f = 1.0;
				var moveTo = true;
				var last = null;
				var len = null;
				var pts = [];
				var n = null;
				c.begin();

				for (var i = 0; i < this.state.routedPoints.length; i++)
				{
					var rpt = this.state.routedPoints[i];
					var pt = new mxPoint(rpt.x / this.scale, rpt.y / this.scale);

					// Takes first and last point from passed-in array
					if (i == 0)
					{
						pt = absPts[0];
					}
					else if (i == this.state.routedPoints.length - 1)
					{
						pt = absPts[absPts.length - 1];
					}

					var done = false;

					// Type 1 is an intersection
					if (last != null && rpt.type == 1)
					{
						// Checks if next/previous points are too close
						var next = this.state.routedPoints[i + 1];
						var dx = next.x / this.scale - pt.x;
						var dy = next.y / this.scale - pt.y;
						var dist = dx * dx + dy * dy;

						if (n == null)
						{
							n = new mxPoint(pt.x - last.x, pt.y - last.y);
							len = Math.sqrt(n.x * n.x + n.y * n.y);
							n.x = n.x * size / len;
							n.y = n.y * size / len;
						}

						if (dist > size * size && len > 0)
						{
							var dx = last.x - pt.x;
							var dy = last.y - pt.y;
							var dist = dx * dx + dy * dy;

							if (dist > size * size)
							{
								var p0 = new mxPoint(pt.x - n.x, pt.y - n.y);
								var p1 = new mxPoint(pt.x + n.x, pt.y + n.y);
								pts.push(p0);

								this.addPoints(c, pts, rounded, arcSize, false, null, moveTo);

								var f = (Math.round(n.x) < 0 || (Math.round(n.x) == 0
										&& Math.round(n.y) <= 0)) ? 1 : -1;
								moveTo = false;

								if (style == 'sharp')
								{
									c.lineTo(p0.x - n.y * f, p0.y + n.x * f);
									c.lineTo(p1.x - n.y * f, p1.y + n.x * f);
									c.lineTo(p1.x, p1.y);
								}
								else if (style == 'arc')
								{
									f *= 1.3;
									c.curveTo(p0.x - n.y * f, p0.y + n.x * f,
										p1.x - n.y * f, p1.y + n.x * f,
										p1.x, p1.y);
								}
								else
								{
									c.moveTo(p1.x, p1.y);
									moveTo = true;
								}

								pts = [p1];
								done = true;
							}
						}
					}
					else
					{
						n = null;
					}

					if (!done)
					{
						pts.push(pt);
						last = pt;
					}
				}

				this.addPoints(c, pts, rounded, arcSize, false, null, moveTo);
				c.stroke();
			}
		};
	} 

	OpenCell(cell)
	{

	}

	OpenEdge(cell)
	{
		//Vue.bus.emit("element-selected", cell);
		this.store.commit("setSelectedElement", cell, 'edge');
		//this.store.state.selected_element=cell;
	}
	
	GetModelXML(){
		var xml = this.model_manager.GetModelXML();
		return xml;
	}

	LoadModel(xml){
		this.model_manager.LoadModel(xml);
	}

	AddNode(in_nodes, out_nodes)
	{
		this.model_manager.AddNode(in_nodes, out_nodes);
	}

	ResizeNode(in_nodes, out_nodes)
	{
		this.model_manager.ResizeNode(in_nodes, out_nodes);
	}
}

export { Canvas };