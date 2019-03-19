import pymc3 as pm
import numpy as np

def compile_model(model_matrix, edges, data_frame):
    b = compress(model_matrix)
    edges_labels = [edges[e].label for e in edges if edges[e].known==True]

    model = buil_pymc3_model(b, edges_labels, data_frame)

    return model

def buil_pymc3_model(b, edges_labels, data_frame):
    model = pm.Model()

    b1 = b[:-1]
    b2 = b[-1]    

    balance_label = edges_labels[-1]    
    balance_mu = data_frame['mu'][balance_label]
    balance_sd = data_frame['sd'][balance_label]

    with model:
        random_vars = []
        for e in edges_labels[:-1]:

            mu = data_frame['mu'][e]
            sd = data_frame['sd'][e]

            f = pm.Normal(e, mu=mu, sd=sd)
            random_vars.append(f)

        random_vars = np.array(random_vars)

        balance_f = pm.Deterministic(balance_label, np.dot(b1/(-1*b2), random_vars))     

        likelihood = pm.Normal('l', mu=balance_f, observed=balance_mu, sd=balance_sd)

    return model
    
def compress(model_matrix):
    return fran_matrix_compression_alg(model_matrix)
    

def fran_matrix_compression_alg(model_matrix):
    b = np.copy(model_matrix[0])
    for c in range(len(model_matrix)-1):    
        j = np.where(b*model_matrix[c+1]!=0)    
        if len(j[0]) == 0:
            cte = 1
        else:   
            iterate = True
            cte = 0        
            while(iterate):
                cte += 1 
                diff = cte * model_matrix[c+1] + b
                i = np.where(diff[j] == 0)            
                if len(i[0]) > 0:
                    iterate = True
                else:
                    iterate = False
        b += model_matrix[c+1] * (cte)
    return b