import { componentPorts, type CircuitComponent, type CircuitDocument, type CircuitPoint, type ComponentRotation } from "./types";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 720;
const BODY_WIDTH = 124;
const MIN_BODY_HEIGHT = 66;
const PORT_STEP = 22;
const BODY_VERTICAL_PADDING = 24;
const EDGE_MARGIN = 26;
const CLEARANCE = 20;
const SEARCH_STEP = 24;

type Side = "left" | "right" | "top" | "bottom";

export interface CircuitPortGeometry {
  point: CircuitPoint;
  normal: CircuitPoint;
}
function rotationOf(component: CircuitComponent): ComponentRotation {
  return component.rotation ?? 0;
}

function rotate(point: CircuitPoint, rotation: ComponentRotation): CircuitPoint {
  switch (rotation) {
    case 90: return { x: -point.y, y: point.x };
    case 180: return { x: -point.x, y: -point.y };
    case 270: return { x: point.y, y: -point.x };
    default: return point;
  }
}

function sideNormal(side: Side): CircuitPoint {
  if (side === "left") return { x: -1, y: 0 };
  if (side === "right") return { x: 1, y: 0 };
  if (side === "top") return { x: 0, y: -1 };
  return { x: 0, y: 1 };
}

function passiveSides(component: CircuitComponent): Readonly<Record<string, Side>> {
  switch (component.kind) {
    case "ground": return { g: "bottom" };
    case "bjt": return { c: "top", b: "left", e: "bottom" };
    case "opamp": return { plus: "left", minus: "left", out: "right", vplus: "top", vminus: "bottom" };
    default: {
      const ports = componentPorts[component.kind];
      if (ports.length === 2 && ports.every((port) => port.direction === "passive")) return { [ports[0].id]: "left", [ports[1].id]: "right" };
      return {};
    }
  }
}

function portSide(component: CircuitComponent, portId: string): Side {
  const port = componentPorts[component.kind].find((candidate) => candidate.id === portId);
  if (!port) throw new Error(`元件 ${component.id} 没有端口 ${portId}。`);
  const passive = passiveSides(component)[portId];
  const original = passive ?? (port.direction === "output" ? "right" : "left");
  if (!component.flipped) return original;
  if (original === "left") return "right";
  if (original === "right") return "left";
  return original;
}

function baseComponentSize(component: CircuitComponent) {
  const ports = componentPorts[component.kind];
  const sides = ports.map((port) => portSide({ ...component, flipped: false, rotation: 0 }, port.id));
  const verticalCount = Math.max(sides.filter((side) => side === "left").length, sides.filter((side) => side === "right").length);
  return { width: BODY_WIDTH, height: Math.max(MIN_BODY_HEIGHT, verticalCount * PORT_STEP + BODY_VERTICAL_PADDING) };
}

export function getComponentSize(component: CircuitComponent) {
  const base = baseComponentSize(component);
  return rotationOf(component) === 90 || rotationOf(component) === 270 ? { width: base.height, height: base.width } : base;
}

export function getPortGeometry(component: CircuitComponent, portId: string): CircuitPortGeometry {
  const base = baseComponentSize(component);
  const side = portSide(component, portId);
  const sidePorts = componentPorts[component.kind].filter((port) => portSide(component, port.id) === side);
  const index = sidePorts.findIndex((port) => port.id === portId);
  const fraction = (index + 1) / (sidePorts.length + 1);
  let local: CircuitPoint;
  if (side === "left" || side === "right") local = { x: (side === "right" ? 1 : -1) * base.width / 2, y: -base.height / 2 + fraction * base.height };
  else local = { x: -base.width / 2 + fraction * base.width, y: (side === "bottom" ? 1 : -1) * base.height / 2 };
  const transformedPoint = rotate(local, rotationOf(component));
  const transformedNormal = rotate(sideNormal(side), rotationOf(component));
  return {
    point: { x: component.position.x + transformedPoint.x, y: component.position.y + transformedPoint.y },
    normal: transformedNormal,
  };
}

function boundsFor(component: CircuitComponent, position = component.position, clearance = 0) {
  const size = getComponentSize(component);
  return {
    left: position.x - size.width / 2 - clearance,
    right: position.x + size.width / 2 + clearance,
    top: position.y - size.height / 2 - clearance,
    bottom: position.y + size.height / 2 + clearance,
  };
}

export function componentsOverlap(left: CircuitComponent, right: CircuitComponent, clearance = CLEARANCE): boolean {
  const a = boundsFor(left, left.position, clearance / 2);
  const b = boundsFor(right, right.position, clearance / 2);
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function clampPosition(component: CircuitComponent, desired: CircuitPoint): CircuitPoint {
  const size = getComponentSize(component);
  return {
    x: Math.max(size.width / 2 + EDGE_MARGIN, Math.min(CANVAS_WIDTH - size.width / 2 - EDGE_MARGIN, desired.x)),
    y: Math.max(size.height / 2 + EDGE_MARGIN, Math.min(CANVAS_HEIGHT - size.height / 2 - EDGE_MARGIN, desired.y)),
  };
}

export function findAvailablePosition(circuit: CircuitDocument, component: CircuitComponent, desired: CircuitPoint): CircuitPoint {
  const others = Object.values(circuit.components).filter((candidate) => candidate.id !== component.id);
  const available = (point: CircuitPoint) => {
    const candidate = { ...component, position: point };
    return others.every((other) => !componentsOverlap(candidate, other));
  };
  const origin = clampPosition(component, desired);
  if (available(origin)) return origin;
  for (let ring = 1; ring <= 30; ring += 1) {
    for (let offset = -ring; offset <= ring; offset += 1) {
      const candidates = [
        { x: origin.x + offset * SEARCH_STEP, y: origin.y - ring * SEARCH_STEP },
        { x: origin.x + offset * SEARCH_STEP, y: origin.y + ring * SEARCH_STEP },
        { x: origin.x - ring * SEARCH_STEP, y: origin.y + offset * SEARCH_STEP },
        { x: origin.x + ring * SEARCH_STEP, y: origin.y + offset * SEARCH_STEP },
      ];
      for (const raw of candidates) {
        const point = clampPosition(component, raw);
        if (available(point)) return point;
      }
    }
  }
  return circuit.components[component.id]?.position ?? origin;
}

export function separateOverlappingComponents(circuit: CircuitDocument): CircuitDocument {
  let placed: CircuitDocument = { ...circuit, components: {} };
  for (const component of Object.values(circuit.components)) {
    const normalized = { ...component, rotation: component.rotation ?? 0, flipped: component.flipped ?? false };
    const position = findAvailablePosition(placed, normalized, normalized.position);
    placed = { ...placed, components: { ...placed.components, [normalized.id]: { ...normalized, position } } };
  }
  return { ...circuit, components: placed.components };
}
