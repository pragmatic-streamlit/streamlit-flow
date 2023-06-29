import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  // useNodesState,
  // useEdgesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

interface IState {
  nodes: any,
  edges: any,
}

const ArgoFlow = (props: any) => {
  // eslint-disable-next-line
  // const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
  // eslint-disable-next-line
  // const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);

  // eslint-disable-next-line
  const [nodes, setNodes] = useState(props.nodes);
  // eslint-disable-next-line
  const [edges, setEdges] = useState(props.edges);

  return (
    <div style={{ height: 100 }}>
      <h1>ArgoFlow</h1>
      <ReactFlow
        nodes={nodes}
        edges={edges}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

class STArgoFlow extends StreamlitComponentBase<IState> {
  state = {
    nodes: this.props.args.nodes,
    edges: this.props.args.edges,
  }
  constructor(props: any) {
    super(props);
    console.log("-----------------------");
    console.log('nodes: ', props.args.nodes);
    console.log('edges: ', props.args.edges);
  }

  ajustHeight() {
    setTimeout(() => {
        Streamlit.setFrameHeight();
    }, 0)
  }

  componentDidMount() {
    this.ajustHeight();
  }

  componentDidUpdate() {
    this.ajustHeight();
  }

  public render = (): ReactNode => {
    return <ArgoFlow nodes={this.state.nodes} edges={this.state.edges}></ArgoFlow>
  };

}

export default withStreamlitConnection(STArgoFlow);