import xmltodict as xd
import numpy as np
from scipy.linalg import qr
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
    
    ak, auk = build_matrices(edges, nodes)

    if auk.shape[1] == 0:
        # Only known edges
        A = ak
    else:
        A = project_matrix(ak, auk)

    return A, auk, edges, nodes

def project_matrix(ak, auk):
    q, r, p = qr(auk, pivoting=True)
    q2 = q[:, -1]
    return np.dot(q2, ak)

def build_pymc3_model(b, known_edges, flow_dict, sd_dict):

    b1 = b[0:-1]
    b2 = b[-1]

    labels = [e.label for e in known_edges]

    model = pm.Model()

    with model:
        f_list = []
        for i, l in enumerate(labels[0:-1]):        
            f = pm.Normal(l, mu=flow_dict[l], sd = sd_dict[l])
            f_list.append(f)
        f_list = np.array(f_list)
        
        balance = pm.Deterministic(labels[-1], np.dot(b1/(-1*b2), f_list))
        
        likelihood = pm.Normal('bal', mu=balance, observed=flow_dict[l], sd=sd_dict[l])
        #start = pm.find_MAP()        
    return model

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

        assign_single_edge(edge.id, source_id, nodes, True)
        assign_single_edge(edge.id, target_id, nodes, False)        

def assign_single_edge(edge_id, node_id, nodes, is_input):
    
    for n_id in nodes:
        n = nodes[n_id]
        if node_id in n.aliases:
            if is_input:
                n.inputs.append(edge_id)                
            else:
                n.outputs.append(edge_id)
            return

def build_matrices(edges, nodes):

    known_edges = [edges[e] for e in edges if edges[e].known is True]
    unknown_edges = [edges[e] for e in edges if edges[e].known is False]

    ak = np.zeros((len(nodes),len(known_edges)))
    auk = np.zeros((len(nodes),len(unknown_edges)))

    for i, n in enumerate(nodes):   
        node = nodes[n]    
        for j, e in enumerate(known_edges):        
            if e.id in node.inputs:
                ak[i][j] = 1
            elif e.id in node.outputs:
                ak[i][j] = -1
    return ak, auk
