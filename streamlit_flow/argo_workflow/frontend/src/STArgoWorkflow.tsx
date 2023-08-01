import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import { ReactNode } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Handle,
  Position,
  NodeProps
} from 'reactflow';
import dagre from '@dagrejs/dagre';
import Icon from "./icons";

import 'reactflow/dist/style.css';
import './custom_style.css';

const node_color = {
  success: "#1ebd96",
  failed: "#e77177",
  running: "#2789cd",
  pending: "#eea433",
}

// custom node
const ArgoWorkflowNode = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {

  let icon_name = "";
  let color = "";
  if(data.phase === "Running"){
    icon_name = "running"
    color = node_color.running
  }else if(data.phase === "Pending"){
    icon_name = "pending"
    color = node_color.pending
  }else if(data.phase === "Succeeded"){
    icon_name = "success"
    color = node_color.success
  }else if(data.phase === "Skipped"){

  }else if(data.phase === "Failed" || data.phase === "Error"){
    icon_name = "failed"
    color = node_color.failed
  }

  if(icon_name !== ""){
    return (
      <>
        <Handle className="argo-node-handle top" type="target" position={targetPosition} isConnectable={isConnectable}/>
        <div className="argo-node-div">
        {data?.label}
        <Icon name={icon_name} color={color} size={12} />
        </div>
        <Handle className="argo-node-handle bottom" type="source" position={sourcePosition} isConnectable={isConnectable}/>
      </>
    );
  }else{
    return (
      <>
        <Handle className="argo-node-handle top" type="target" position={targetPosition} isConnectable={isConnectable}/>
        <div className="argo-node-div">
        {data?.label}
        </div>
        <Handle className="argo-node-handle bottom" type="source" position={sourcePosition} isConnectable={isConnectable}/>
      </>
    );
  }
};

const nodeTypes = {
  ArgoWorkflowNode: ArgoWorkflowNode,
}

interface IState {
  nodes: any,
  edges: any,
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 120;
const nodeHeight = 60;

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
  let argo_node_maxx = 0;
  let argo_node_maxy = 0;

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
    argo_node_maxx = Math.max(argo_node_maxx, node.position.x + nodeWidth);
    argo_node_maxy = Math.max(argo_node_maxy, node.position.y + nodeHeight);
    return node;
  });

  return { argo_node_maxx, argo_node_maxy };
};

const ArgoFlow = (props: any) => {
  let {argo_node_maxx, argo_node_maxy} = getLayoutedElements(props.nodes, props.edges, 'TB');

  return (
      <ReactFlow
        style={{ background: '#dee6eb' }}
        nodes={props.nodes}
        edges={props.edges}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll
        selectionOnDrag
        minZoom={0.8}
        maxZoom={1.5}
        translateExtent={[[-500, -200], [argo_node_maxx + 500, argo_node_maxy + 200]]}
      >
        <MiniMap zoomable pannable nodeColor={"#000"} zoomStep={1} />
        <Controls />
      </ReactFlow>
  );
}

class STArgoFlow extends StreamlitComponentBase<IState> {
  state = {
    nodes: this.props.args.nodes,
    edges: this.props.args.edges,
  }
  constructor(props: any) {
    super(props);
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
    // console.log(this.props.args.height)
    return (
      <div style={{ height: this.props.args.height, width: this.props.args.width }}>
        <ArgoFlow 
          nodes={this.state.nodes}
          edges={this.state.edges}
          height={this.props.args.height}
          width={this.props.args.width}
        ></ArgoFlow>
      </div>
    )
  };

}

export default withStreamlitConnection(STArgoFlow);
