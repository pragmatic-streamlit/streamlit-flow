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
  Handle,
  Position,
  NodeProps
  // useNodesState,
  // useEdgesState,
} from 'reactflow';
import dagre from '@dagrejs/dagre';
import Icon from "./icons";

import 'reactflow/dist/style.css';
import './custom_style.css';

const node_color = {
  success: "#1ebd96",
  failed: "#e77177",
}

// custom node
const ArgoWorkflowNode = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {

  let icon_name = "";
  if(data.phase === "Running"){
    
  }else if(data.phase === "Pending"){
    icon_name = ""
  }else if(data.phase === "Succeeded"){
    icon_name = "check-circle-fill"
  }else if(data.phase === "Skipped"){

  }else if(data.phase === "Failed" || data.phase === "Error"){
    icon_name = "xmark-circle-fill"
  }

  if(icon_name !== ""){
    return (
      <>
        <Handle className="argo-node-handle top" type="target" position={targetPosition} isConnectable={isConnectable}/>
        <div className="argo-node-div">
        {data?.label}
        <Icon name={"check-circle-fill"} color={node_color.success} size={12} />
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

const nodeWidth = 200;
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

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    if(node.type !== "StepGroup"){
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }else{
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }
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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
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
        <h1>ArgoFlow</h1>
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
