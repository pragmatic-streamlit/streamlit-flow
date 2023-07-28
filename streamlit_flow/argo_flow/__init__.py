import os
import streamlit as st
import streamlit.components.v1 as components
from typing import Union, Dict, List, Tuple
import json

_DEVELOP_MODE = os.getenv('DEVELOP_MODE')

if _DEVELOP_MODE:
    print('devel mode')
    _component_func = components.declare_component(
        "streamlit_argo_flow",
        url="http://localhost:3000",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("streamlit_argo_flow", path=build_dir)


def st_argo_flow(dflow_nodes, height=400, width="100%", key=None) -> List[str]:
    # dflow_nodes = ret['status']['nodes']
    edgeType = 'smoothstep'

    nodes = []
    edges = []
    root_node_k = list(dflow_nodes.keys())[0]
    prev_nodes = [root_node_k]
    cur_nodes = []
    cur_nodes_set = set()
    valid_node_types = {'Steps', 'Pod', 'StepGroup'}

    # 添加根节点
    # print(f'add node, {root_node_k}')
    # print(dflow_nodes[root_node_k])
    nodes.append({"id": root_node_k, "position": { "x": 0, "y": 0 }, "data": { "label": dflow_nodes[root_node_k]['displayName'] }})

    # 如果父节点是无效节点，需要保存该无效父节点的有效父节点
    parent_nodes = {}

    while prev_nodes:
        cur_nodes = []
        for node_k in prev_nodes:
            dflow_node = dflow_nodes[node_k]
            dflow_node_valid = dflow_node['type'] in valid_node_types
            if 'children' not in dflow_node:
                continue

            for next_node_k in dflow_node['children']:
                next_dflow_node = dflow_nodes[next_node_k]

                if next_dflow_node['type'] not in valid_node_types:
                    if dflow_node_valid:
                        parent_nodes[next_node_k] = node_k
                    else:
                        parent_nodes[next_node_k] = parent_nodes[node_k]
                    continue

                nodes.append({
                    "id": next_node_k,
                    "position": { "x": 0, "y": 0},
                    "data": { "label": next_dflow_node['displayName']},
                })
                source = node_k if dflow_node_valid else parent_nodes[node_k]
                edges.append({"id": f'{source}--{next_node_k}', "source": source, "target": next_node_k, "type": edgeType})
                
                if next_node_k not in cur_nodes_set:
                    cur_nodes_set.add(next_node_k)
                    cur_nodes.append(next_node_k)

        prev_nodes = cur_nodes

    component_value = _component_func(nodes=nodes, edges=edges, height=height, width=width, key=key)
    return component_value

