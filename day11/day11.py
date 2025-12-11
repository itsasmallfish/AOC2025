import networkx as nx
import matplotlib.pyplot as plt


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

all_paths = list(nx.all_simple_paths(G, "you", "out"))
print(len(all_paths))