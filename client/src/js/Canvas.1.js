class Canvas{

    constructor(canvas){        
        this.canvas = canvas;
        this.graph = null;
    }

    buildDefaultModel(){

        var style = this.graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        this.graph.alternateEdgeStyle = 'elbow=vertical';

        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = this.graph.getDefaultParent();

        // Adds cells to the model in a single step
        this.graph.getModel().beginUpdate();
        try
        {
            //Build input/output nodes
            var in_style = 'color=green;movable=1;shape=ellipse;'+mxConstants.STYLE_DELETABLE+'=0';
            var out_style = 'color=red;movable=1;shape=ellipse;'+mxConstants.STYLE_DELETABLE+'=0';

            var v1 = this.graph.insertVertex(parent, 'Input', 'Input', 20, 20, 80, 80, in_style);
            v1.getPorts = function(){return {out_0: {x: 1, y: 0.5, perimeter: true, constraint: 'east'}};};

            var v2 = this.graph.insertVertex(parent, 'Output', 'Output', 200, 20, 80, 80, out_style);
            v2.getPorts = function(){return {in_0: {x: 0, y: 0.5, perimeter: true, constraint: 'west'}};};
        }
        finally
        {
            // Updates the display
            this.graph.getModel().endUpdate();
        }

    }

    getSetConnectionConstraint() {

        var f = function(edge, terminal, source, constraint)
        {
            if (constraint != null)
            {
                var key = (source) ? mxConstants.STYLE_SOURCE_PORT : mxConstants.STYLE_TARGET_PORT;

                if (constraint == null || constraint.id == null)
                {
                    graph.setCellStyles(key, null, [edge]);
                }
                else if (constraint.id != null)
                {
                    graph.setCellStyles(key, constraint.id, [edge]);
                }
            }
        };

        return f;
    }



    initCanvas(){        
       
        //Enable guides
        mxGraphHandler.prototype.guidesEnabled = true;

        // Alt disables guides
        mxGuide.prototype.isEnabledForEvent = function(evt)
        {
            return !mxEvent.isAltDown(evt);
        };

        // Enables snapping waypoints to terminals
        mxEdgeHandler.prototype.snapToTerminals = true;

        // Sets the image to be used for creating new connections
        mxConnectionHandler.prototype.connectImage = new mxImage('images/green-dot.gif', 14, 14);

        this.graph = new mxGraph(canvas);

        this.graph.setConnectable(true);
        this.graph.setAllowDanglingEdges(false);
        this.graph.setMultigraph(true);

        // Enables rubberband selection
        new mxRubberband(this.graph);

        // Enables tooltips, new connections and panning
        this.graph.setCellsDisconnectable(false);
        this.graph.setCellsEditable(false);
        this.graph.setPanning(true);
        this.graph.centerZoom = false;

        // Sets the default edge style
        var style = this.graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SegmentConnector;
        
        // Returns all possible ports for a given terminal    
        this.graph.getAllConnectionConstraints = function(terminal, source)
        {
            if (terminal != null && terminal.shape != null &&
                terminal.shape.stencil != null)
            {
                // for stencils with existing constraints...
                if (terminal.shape.stencil != null)
                {
                    return terminal.shape.stencil.constraints;
                }
            }
            else if (terminal != null && this.model.isVertex(terminal.cell))
            {
                if (terminal.cell.getPorts != null)
                {
                    var ports = terminal.cell.getPorts();
                    var cstrs = new Array();

                    for (var id in ports)
                    {
                        var port = ports[id];

                        var cstr = new mxConnectionConstraint(new mxPoint(port.x, port.y), port.perimeter);
                        cstr.id = id;
                        cstrs.push(cstr);
                    }

                    return cstrs;
                }
            }

            return null;
        };;

        //TODO: Implement later
        /*
        this.graph.connectionHandler.addListener(mxEvent.CONNECT, function(sender, evt)
        {
            var edge = evt.getProperty('cell');
            edge.setAttribute('name', 'none');
            edge.setAttribute('product', 'none');
            edge.setAttribute('type', 'unknown');
            edge.setAttribute('tag', 'none');

            var source = this.graph.getModel().getTerminal(edge, true);
            var target = this.graph.getModel().getTerminal(edge, false);

            var style = this.graph.getCellStyle(edge);
            var sourcePortId = style[mxConstants.STYLE_SOURCE_PORT];
            var targetPortId = style[mxConstants.STYLE_TARGET_PORT];

            //mxLog.show();
            //mxLog.debug('connect', edge, source.id, target.id, sourcePortId, targetPortId);
        });
        */

        // Returns the port for the given connection        
        this.graph.getConnectionConstraint = function(edge, terminal, source)
        {
            var key = (source) ? mxConstants.STYLE_SOURCE_PORT : mxConstants.STYLE_TARGET_PORT;
            var id = edge.style[key];

            if (id != null)
            {
                var c =  new mxConnectionConstraint(null, null);
                c.id = id;

                return c;
            }

            return null;
        }; 

        // Returns the actual point for a port by redirecting the constraint to the port
        var graphGetConnectionPoint = this.graph.getConnectionPoint;        
        this.graph.getConnectionPoint = function(vertex, constraint)
        {
            if (constraint.id != null && vertex != null && vertex.shape != null)
            {
                var port = vertex.cell.getPorts()[constraint.id];

                if (port != null)
                {
                    constraint = new mxConnectionConstraint(new mxPoint(port.x, port.y), port.perimeter);
                }
            }

            return graphGetConnectionPoint.apply(this, arguments);
        };

        // Sets the port for the given connection
        this.graph.setConnectionConstraint = function(edge, terminal, source, constraint)
        {
            if (constraint != null)
            {
                var key = (source) ? mxConstants.STYLE_SOURCE_PORT : mxConstants.STYLE_TARGET_PORT;

                if (constraint == null || constraint.id == null)
                {
                    this.setCellStyles(key, null, [edge]);
                }
                else if (constraint.id != null)
                {
                    this.setCellStyles(key, constraint.id, [edge]);
                }
            }
        };

        // Automatically handle parallel edges
        var layout = new mxParallelEdgeLayout(this.graph);
        var layoutMgr = new mxLayoutManager(this.graph);

        layoutMgr.getLayout = function(cell)
        {
            if (cell.getChildCount() > 0)
            {
                return layout;
            }
        };

        // Disables connections to invalid rows
        //mxConnectionHandler.prototype.isValidTarget = function(cell)
        //{
        //	return this.currentRowNode != null;
        //};

        // Removes cells when [DELETE] is pressed
        var keyHandler = new mxKeyHandler(this.graph);
        
        keyHandler.bindKey(46, function(evt)
        {
            if (this.graph.isEnabled())
            {
                this.graph.removeCells();
            }
        });        

        var style = this.graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        this.graph.alternateEdgeStyle = 'elbow=vertical';
        
        this.buildDefaultModel();
    }   

}

export { Canvas };