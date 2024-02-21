import React, { useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";

const nodeId = (id) => `node-${id}`;
const edgeId = (leftNodeId, rightNodeId) => `edge-${leftNodeId}-${rightNodeId}`;

const buildVerticalNodes = (
  elements,
  sourcePosition,
  targetPosition,
  x,
  initialY,
  deltaY
) => {
  const res = [];
  if (elements.length > 0) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element?.id) {
        const node = {
          id: nodeId(element.id),
          sourcePosition,
          targetPosition,
          data: { label: element.label },
          position: { x, y: initialY + deltaY * i },
        };
        res.push(node);
      }
    }
  }
  return res;
};

const getLeftNodes = (leftElements) =>
  buildVerticalNodes(leftElements, "right", "right", -350, -300, 70);

const getCenterNodes = (centerElement) =>
  buildVerticalNodes([centerElement], "right", "left", 0, -300, 0);

const getRightNodes = (rightElements) =>
  buildVerticalNodes(rightElements, "left", "left", 350, -300, 70);

const getNodes = (leftElements, centerElement, rightElements) => {
  return [
    ...getLeftNodes(leftElements),
    ...getCenterNodes(centerElement),
    ...getRightNodes(rightElements),
  ];
};

const getEdges = (leftElements, centerElement, rightElements) => {
  const leftNodes = getLeftNodes(leftElements);
  const centerNodes = getCenterNodes(centerElement);
  const rightNodes = getRightNodes(rightElements);

  const edges = [];
  for (let i = 0; i < leftNodes.length; i++) {
    const element = leftNodes[i];
    const leftNodeId = element?.id;
    const rightNodeId = centerNodes[0]?.id;
    const edge = {
      id: edgeId(leftNodeId, rightNodeId),
      source: leftNodeId,
      type: "smoothstep",
      target: rightNodeId,
      animated: true,
    };
    edges.push(edge);
  }

  for (let i = 0; i < rightNodes.length; i++) {
    const element = rightNodes[i];
    const leftNodeId = centerNodes[0]?.id;
    const rightNodeId = element?.id;
    const edge = {
      id: edgeId(leftNodeId, rightNodeId),
      source: leftNodeId,
      type: "smoothstep",
      target: rightNodeId,
      animated: true,
    };
    edges.push(edge);
  }
  return edges;
};

const HorizontalFlow = ({
  leftElements,
  centerElement,
  rightElements,
  setSelectedLabel,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    getNodes(leftElements, centerElement, rightElements)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getEdges(leftElements, centerElement, rightElements)
  );

  useEffect(() => {
    setNodes(getNodes(leftElements, centerElement, rightElements));
    setEdges(getEdges(leftElements, centerElement, rightElements));
  }, [leftElements, centerElement, rightElements, setNodes, setEdges]);

  const onNodeClick = (label) => {
    label !== "" && setSelectedLabel(label);
  };

  useEffect(() => {
    const errorHandler = (e) => {
      if (
        e.message.includes(
          "ResizeObserver loop completed with undelivered notifications" ||
            "ResizeObserver loop limit exceeded"
        )
      ) {
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.style.display = "none";
        }
      }
    };
    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);
  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
        zoomOnScroll={false}
        onNodeClick={(e) => onNodeClick(e?.target?.innerText)}
        nodesDraggable={false}
      />
    </div>
  );
};
export default HorizontalFlow;
