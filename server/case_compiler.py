import numpy as np
from scipy.linalg import qr




def compile_model(edges, nodes):
    
    edges_labels = [edges[e].label for e in edges if edges[e].known==True]  
    
    A, ak, auk = build_matrices(edges, nodes)
    
    return A, ak, auk


def build_topology_matrix(edges, nodes):

    known_edges = [edges[e] for e in edges if edges[e].known is True]
    unknown_edges = [edges[e] for e in edges if edges[e].known is False]

    ay = np.zeros((len(nodes),len(known_edges)))
    az = np.zeros((len(nodes),len(unknown_edges)))

    for i, n in enumerate(nodes):   
        node = nodes[n]    
        for j, e in enumerate(known_edges):        
            if e.id in node.inputs:
                ay[i][j] = 1.0
            elif e.id in node.outputs:
                ay[i][j] = -1.0    

    for i, n in enumerate(nodes):   
        node = nodes[n]    
        for j, e in enumerate(unknown_edges):        
            if e.id in node.inputs:
                az[i][j] = 1.0
            elif e.id in node.outputs:
                az[i][j] = -1.0

    return ay, az

def build_matrices(edges, nodes):

    known_edges = [edges[e] for e in edges if edges[e].known is True]
    unknown_edges = [edges[e] for e in edges if edges[e].known is False]

    ay, az = build_topology_matrix(edges, nodes)    

    az_rank = np.linalg.matrix_rank(az)

    q = None
    r = None
    p = None

    if len(unknown_edges) != 0:
        q, r, p = qr(az, pivoting=True)
        q[np.abs(q)< 1e-5] = 0
        r[np.abs(r)< 1e-5] = 0
    
    ay = np.atleast_2d(ay)
    az = np.atleast_2d(az)

    return ay, az, q, r, p