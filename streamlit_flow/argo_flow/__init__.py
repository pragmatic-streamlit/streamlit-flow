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


def st_argo_flow(nodes, edges, key=None) -> List[str]:
    component_value = _component_func(nodes=nodes, edges=edges, key=key)
    return component_value


if _DEVELOP_MODE:
    nodes = [
        { "id": '1', "position": { "x": 0, "y": 0 }, "data": { "label": '1' } },
        { "id": '2', "position": { "x": 0, "y": 100 }, "data": { "label": '2' } },
    ]

    edges = [{ "id": 'e1-2', "source": '1', "target": '2' }]
    import streamlit as st
    st.set_page_config(layout="wide")

    event = st_argo_flow(nodes=nodes, edges=edges, key='demo1')
    print("event:", event)

