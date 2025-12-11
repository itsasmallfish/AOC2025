import networkx as nx
import matplotlib.pyplot as plt
import functools


def read_line(line, G):
    splited = line.split() 
    parent = splited[0][0:-1]
    children = splited[1:]
    G.add_node(parent)
    for child in children:
        G.add_node(child)
        G.add_edge(parent, child)
    
G = nx.DiGraph()

for line in open('day11/input11.txt'):
    read_line(line, G)

if nx.is_directed_acyclic_graph(G):
    @functools.cache
    def count_paths(u, target):
        if u == target:
            return 1
        return sum(count_paths(v, target) for v in G.successors(u))

    total = 0
    c1 = count_paths("svr", "dac") * count_paths("dac", "fft") * count_paths("fft", "out")
    c2 = count_paths("svr", "fft") * count_paths("fft", "dac") * count_paths("dac", "out")
    total = c1 + c2
    print(total)
else:
    all_paths = nx.all_simple_paths(G, "svr", "out")
    print(sum(1 for path in all_paths if "dac" in path and "fft" in path))