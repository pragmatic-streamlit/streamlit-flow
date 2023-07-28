import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import { ReactNode } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  // useNodesState,
  // useEdgesState,
} from 'reactflow';
import dagre from '@dagrejs/dagre';

import 'reactflow/dist/style.css';

interface IState {
  nodes: any,
  edges: any,
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Array<any>, edges: Array<any>, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const ArgoFlow = (props: any) => {
  // eslint-disable-next-line
  // const [nodes, setNodes] = useState(props.nodes);
  // eslint-disable-next-line
  // const [edges, setEdges] = useState(props.edges);

  let { nodes, edges } = getLayoutedElements(props.nodes, props.edges, 'TB');

  return (
    <div style={{ height: 400, width: "100%" }}>
      <h1>ArgoFlow</h1>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
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
    return (
      <ArgoFlow 
        nodes={this.state.nodes}
        edges={this.state.edges}
        height={this.props.args.height}
        width={this.props.args.width}
      ></ArgoFlow>
    )
  };

}

export default withStreamlitConnection(STArgoFlow);