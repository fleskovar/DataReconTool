import numpy as np
from scipy.optimize import minimize
from numpy.linalg import multi_dot as mdot
from scipy.linalg import qr, inv

def calc_models(x, labels, model_list):
        multi_map = generate_multimap()
        return multi_map(x=x, labels=labels, func=model_list)

#def calc_z(y, a1, a2):
#    return mdot([-1*inv(np.dot(a2.T, a2)), a2.T, np.dot(a1, y)])

def generate_obj_function(labels, y, calc_z, sd, omega_list=None, mu_omega=None, sd_omega=None):

        V = np.atleast_2d(np.diag(sd*sd))
        if mu_omega is not None:
            mu_omega = np.atleast_2d(np.diag(mu_omega))

        def f(y_hat):
            
            if calc_z is not None:
                z_hat = calc_z(y_hat)  # Reemplazar por observability
                x = np.concatenate([y_hat, z_hat])
            else:
                x = y_hat
            
            p_r = 0.0

            if omega_list is not None:
                r = np.atleast_2d(calc_models(x, labels, omega_list) - mu_omega)   
                p_r = mdot([r.T, inv(sd_omega*sd_omega), r]) # Probabilidad de los residuales de los modelos blandos

            p_y = mdot([(y-y_hat).T, inv(V), (y-y_hat)]) # Probabilidad de las variables
            p_t = p_r + p_y        
            return p_t    
        return f

def gen_mass_balance_constraints(qay):
        cons = []  
              
        for row in qay:        
            c = dict()
            c['type'] = 'eq'            
            c['fun'] = lambda x: np.dot(row, x)
            cons.append(c)
        return cons

def generate_multimap():

    def apply_f(x, labels, func):
        return func(x, labels)

    return np.vectorize(apply_f, excluded =['x', 'labels'])

def generate_yield_eq(numerator_labels, denominator_labels, labels):
    
    def f(values, labels=None):
        
        num = 0.0
        for l in numerator_labels:
            i = labels.index(l)
            num += values[i]
            
        den = 0.0
        for l in denominator_labels:
            i = labels.index(l)
            den += values[i]
        
        return num/den
    
    return f

def generate_z_eval(ay, az, q, r, p):

    if az is None:
        l = None
    else:
        az_rank = np.linalg.matrix_rank(az)

        if az_rank >= az.shape[1]:
            # All unmeasured variables are observable
            l = lambda x: mdot([-1*inv(np.dot(az.T, az)), az.T, np.dot(ay, x)])
        else:   
            
            i, j = r.shape
            r1 = r[:az_rank, :az_rank]
            r2 = r[:az_rank, az_rank:]
            q1 = q[:, :-1]
            q2 = q[:, -1]

            z_selection_matrix = inv(r1).dot(r2)
            z_selection_matrix[np.abs(z_selection_matrix)<1.e-5] = 0.0
            i = np.where(z_selection_matrix == 0.0)

            def f(x):
                z_est = (-inv(r1).dot(q1.T).dot(ay)).dot(x)
                return z_est[i[0]]
            
            l = f
    
    return l

def solve(labels_known, labels_unknown, y, ay, az, q, r, p, sd, model_cons = None, mu_omega=None, sd_omega=None):

    qay = np.atleast_2d(q[:, -1].dot(ay))
    cons = gen_mass_balance_constraints(qay) # Mass balance constraint = 0
    
    evaluate_z = generate_z_eval(ay, az, q, r, p)
    
    az_rank = np.linalg.matrix_rank(az)

    if az_rank < az.shape[1]:
        
        i, j = r.shape
        r1 = r[:az_rank, :az_rank]
        r2 = r[:az_rank, az_rank:]
        q1 = q[:, :-1]
        q2 = q[:, -1]

        z_selection_matrix = inv(r1).dot(r2)
        z_selection_matrix[np.abs(z_selection_matrix)<1.e-5] = 0.0
        i = np.where(z_selection_matrix == 0.0)
        z_labels = np.array(labels_unknown)[p]
        z_labels = z_labels[i[0]]
        labels_unknown = z_labels.tolist()

    labels = labels_known + labels_unknown

    f = generate_obj_function(labels, y, evaluate_z, sd, model_cons, mu_omega, sd_omega)    

    r = minimize(f, y, method='SLSQP', constraints=cons, options={'ftol': 1e-06})
    z = evaluate_z(r.x)    

    return r.x, z, labels