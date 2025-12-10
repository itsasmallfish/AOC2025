from ortools.sat.python import cp_model

def convert_button(button, max_length):
    if len(button) == 3:
        button = button[0:-1] + ",)"
    mask = [0 for _ in range(max_length)]
    for e in eval(button):
        mask[int(e)] = 1
    return mask

def convert_target(target):
    target = target[1:-1]
    mask = [0 for _ in range(len(target))]
    for i in range(len(target)):
        if target[i] == '#':
            mask[i] = 1
    return mask

def build_model(target, buttons):
    model = cp_model.CpModel()

    variables = [model.NewBoolVar(f'button_{i}') for i in range(len(buttons))]

    for i in range(len(target)):
        activated_variables = [variables[j] for j in range(len(buttons)) if buttons[j][i] == 1]
        if target[i] == 0:
            k = model.new_int_var(0,len(activated_variables),f'k_{i}')
            model.Add(sum(activated_variables) == k)
            model.AddModuloEquality(0, k, 2)
        else:
            model.AddBoolXOr(activated_variables)

    model.Minimize(sum(variables))

    return (model, variables)

def solve_with_cp_sat(model, variables, debug=False):
    """Solves the puzzle using the CP-SAT solver."""
    solver = cp_model.CpSolver()
    if debug == True:
        solver.parameters.log_search_progress = True
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        return solver.ObjectiveValue()
        if debug == True:
            print(f'Minimum sum of variables: {solver.ObjectiveValue()}')

            print('Solution:')
            for var in variables:
                print(f'  {var.Name()} = {solver.Value(var)}')
    else:
        raise Exception('No solution found.')

def solve_line (line):
    splited = line.split(' ')
    target = convert_target(splited[0])
    buttons = [convert_button(button, len(target)) for button in splited[1:-1]]
    model, variables = build_model(target, buttons)
    return solve_with_cp_sat(model, variables)


line = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}"
min_presses = [solve_line(line) for line in open('day10/input10.txt')]
print(sum(min_presses))

