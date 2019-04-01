import xmltodict as xd
import numpy as np
from math import sqrt
from collections import OrderedDict as odict

class Node(object):
    
    def __init__(self, id, name, data=None):
        self.id = id
        self.name = name        
        self.inputs=[]
        self.outputs=[]
        self.aliases = []
        self.data = data

class Edge(object):
    
    def __init__(self, id, known, source_id, target_id, label):
        self.id = id
        self.known = known
        self.source_id = source_id
        self.target_id = target_id
        self.label = label        
        self.type="normal"

def build_model(file_name):
    
    doc = create_xml_dict(file_name) # Transform the xml file into a dictionary
    
    nodes = extract_nodes(doc) # Find all mass balance nodes and put them in a dictionary    
    edges = extract_edges(doc)

    assign_edges_to_nodes(edges, nodes)
    
    return edges, nodes
    

def create_xml_dict(file_name):
    fd = open(file_name)
    doc = xd.parse(fd.read())
    fd.close()
    return doc

def extract_nodes(doc):

    recon_nodes_dict = odict()
    
    node_alias = dict() # Dictionary for maching port-node ids

    for cell in doc['mxGraphModel']['root']['mxCell']:    
        # Go through all cells from the xml dictionary
        if '@edge' not in cell:
            # If the cell is not an edge, then it is a node
            if '@is_node' in cell and '@recon_ignore' not in cell:
                node_id = cell['@id']
                
                #node_label = cell['@label']
                node_label = None

                node = Node(node_id, node_label, data=cell)            
                recon_nodes_dict[node_id] = node
            else:
                #This is a port of a node. Need to add alias to the real node
                if '@parent' in cell:
                    node_alias[cell['@id']]=cell['@parent']
    
    for a in node_alias:
        parent_id = node_alias[a]        
        parent = [recon_nodes_dict[n] for n in recon_nodes_dict if recon_nodes_dict[n].id == parent_id]
        if len(parent) > 0:
            parent[0].aliases.append(a)

    return recon_nodes_dict

def extract_edges(doc):
    
    edges = odict()
    
    for cell in doc['mxGraphModel']['root']['mxCell']:    
        if '@edge' in cell:
            for obj in cell['Array']['Object']:
                if obj['@label'] == 'Flowrate':

                    edge_id = cell['@id']
                    edge_source = cell['@source']
                    edge_target = cell['@target']
                    is_measured = obj['@measured'] == '1'
                    edge_label = cell['@label']

                    edge = Edge(edge_id, is_measured, edge_source, edge_target, edge_label)
                    edges[edge_id] = edge                        
    return edges

def assign_edges_to_nodes(edges, nodes):
    
    for e in edges:
        edge = edges[e]
        source_id = edge.source_id
        target_id = edge.target_id

        assign_single_edge(edge, source_id, nodes, False)
        assign_single_edge(edge, target_id, nodes, True)        

def assign_single_edge(edge, node_id, nodes, is_input):
    edge_id = edge.id
    for n_id in nodes:
        n = nodes[n_id]
        if node_id in n.aliases:
            if is_input:
                n.inputs.append(edge_id)
                edge.source_id = n_id                
            else:
                n.outputs.append(edge_id)
                edge.target_id = n_id
            return
    if is_input:
        edge.source_id = None
    else:
        edge.target_id = None


