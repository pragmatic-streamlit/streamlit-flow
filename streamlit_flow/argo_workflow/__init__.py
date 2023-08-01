import os
import streamlit as st
import streamlit.components.v1 as components
from typing import Union, Dict, List, Tuple
from ordered_set import OrderedSet


_DEVELOP_MODE = os.getenv('DEVELOP_MODE')
edgeType = 'default'

if _DEVELOP_MODE:
    print('devel mode')
    _component_func = components.declare_component(
        "streamlit_argo_workflow",
        url="http://localhost:3000",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/dist")
    _component_func = components.declare_component("streamlit_argo_workflow", path=build_dir)


def add_valid_children(node_k, next_node_k, dflow_nodes, nodes, edges, cur_nodes, invalid_node_type):
    next_dflow_node = dflow_nodes[next_node_k]
    if next_dflow_node['type'] in invalid_node_type:
        for next_node_k in next_dflow_node.get('children', []):
            add_valid_children(node_k, next_node_k, dflow_nodes, nodes, edges, cur_nodes, invalid_node_type)
    else:
        nodes.append({
            "id": next_node_k,
            "position": { "x": 0, "y": 0},
            "data": {
                "label": '' if next_dflow_node['type'] in invalid_node_type else next_dflow_node['displayName'],
                'phase':  next_dflow_node['phase']
            },
            'type': "ArgoWorkflowNode"
        })
        edges.append({"id": f'{node_k}--{next_node_k}', "source": node_k, "target": next_node_k, "type": edgeType})
        if next_dflow_node['phase'] == 'Running':
            edges[-1]['animated'] = True
        
        if next_node_k not in cur_nodes:
            cur_nodes.append(next_node_k)


def st_argo_workflow(dflow_nodes, height=400, width="100%", key=None) -> List[str]:
    # dflow_nodes = ret['status']['nodes']
    
    nodes = []
    edges = []
    root_node_k = list(dflow_nodes.keys())[0]
    prev_nodes = OrderedSet([root_node_k])
    invalid_node_type = {'StepGroup'}

    # 添加根节点
    nodes.append({
        "id": root_node_k,
        "position": { "x": 0, "y": 0 },
        "data": {
            "label": dflow_nodes[root_node_k]['displayName'],
            'phase': dflow_nodes[root_node_k]['phase']
        },
        'type': "ArgoWorkflowNode"
    })

    while prev_nodes:
        cur_nodes = OrderedSet()
        for node_k in prev_nodes:
            dflow_node = dflow_nodes[node_k]
            if 'children' not in dflow_node:
                continue

            for next_node_k in dflow_node['children']:
                add_valid_children(node_k, next_node_k, dflow_nodes, nodes, edges, cur_nodes, invalid_node_type)

        prev_nodes = cur_nodes

    component_value = _component_func(nodes=nodes, edges=edges, height=height, width=width, key=key)
    return component_value


def st_argo_workflow1(dflow_nodes, height=400, width="100%", key=None) -> List[str]:
    # dflow_nodes = ret['status']['nodes']
    
    nodes = []
    edges = []
    root_node_k = list(dflow_nodes.keys())[0]
    prev_nodes = [root_node_k]
    empty_node_type = {'StepGroup'}
    empty_node = set()

    # 添加根节点
    nodes.append({
        "id": root_node_k,
        "position": { "x": 0, "y": 0 },
        "data": { "label": dflow_nodes[root_node_k]['displayName']},
        'type': "ArgoWorkflowNode"
    })

    while prev_nodes:
        cur_nodes = []
        cur_nodes_set = set()
        for node_k in prev_nodes:
            dflow_node = dflow_nodes[node_k]
            if 'children' not in dflow_node:
                continue

            for next_node_k in dflow_node['children']:
                next_dflow_node = dflow_nodes[next_node_k]
                nodes.append({
                    "id": next_node_k,
                    "position": { "x": 0, "y": 0},
                    "data": { "label": '' if next_dflow_node['type'] in empty_node_type else next_dflow_node['displayName']},
                    'type': "ArgoWorkflowNode"
                })
                edges.append({"id": f'{node_k}--{next_node_k}', "source": node_k, "target": next_node_k, "type": edgeType})
                
                if next_node_k not in cur_nodes_set:
                    cur_nodes_set.add(next_node_k)
                    cur_nodes.append(next_node_k)
                    if next_dflow_node['type'] in empty_node_type:
                        empty_node.add(next_node_k)

        prev_nodes = cur_nodes

    component_value = _component_func(nodes=nodes, edges=edges, height=height, width=width, key=key)
    return component_value
