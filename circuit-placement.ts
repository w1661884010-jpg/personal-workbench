import { componentsOverlap } from "../personal-workbench-sites-3000/app/lib/circuit/geometry";
import type { CircuitComponent, CircuitDocument, CircuitPoint } from "../personal-workbench-sites-3000/app/lib/circuit/types";

// 沿用原有邻近避让搜索，但工作区已可扩展，不能再夹紧到 1200×720。
export function findAvailablePosition(circuit: CircuitDocument, component: CircuitComponent, desired: CircuitPoint): CircuitPoint {
  const others = Object.values(circuit.components).filter((item) => item.id !== component.id);
  const available = (position: CircuitPoint) => others.every((other) => !componentsOverlap({ ...component, position }, other));
  if (available(desired)) return desired;
  for (let ring = 1; ring <= 30; ring += 1) {
    for (let offset = -ring; offset <= ring; offset += 1) {
      const candidates = [
        { x: desired.x + offset * 24, y: desired.y - ring * 24 },
        { x: desired.x + offset * 24, y: desired.y + ring * 24 },
        { x: desired.x - ring * 24, y: desired.y + offset * 24 },
        { x: desired.x + ring * 24, y: desired.y + offset * 24 },
      ];
      for (const point of candidates) if (available(point)) return point;
    }
  }
  return circuit.components[component.id]?.position ?? desired;
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
