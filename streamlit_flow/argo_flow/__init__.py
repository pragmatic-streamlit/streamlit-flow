import os
import streamlit as st
import streamlit.components.v1 as components
from typing import Union, Dict, List, Tuple

_DEVELOP_MODE = os.getenv('DEVELOP_MODE') or os.getenv('ST_ANTD_DEVELOP_MODE')

if _DEVELOP_MODE:
    _component_func = components.declare_component(
        "streamlit_argo_flow",
        url="http://localhost:3000",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("streamlit_argo_flow", path=build_dir)


def st_argo_flow(key=None) -> List[str]:
    component_value = _component_func(key=key)
    return list(tag_list) if component_value is None else component_value


if _DEVELOP_MODE or os.getenv('SHOW_TAG_DEMO'):
    import streamlit as st
    st.set_page_config(layout="wide")

    event = st_antd_tag(key='demo1')
    print("event:", event)
    
    event = st_antd_tag(['tag1', 'tag2', 'tag3'], 2, 'new', key='demo2')
    print("event:", event)
    
    event = st_antd_tag(['tag1', 'tag2', 'tag3tag3tag3tag3tag3tag3tag3tag3tag3tag3tag3'], 2, 50, 'new', key='demo3')
    print("event:", event)

