import { DistanceMatrix, RouteResult } from "@/types/store";

export const initialDistances: DistanceMatrix = [
  [0, 5, 10, 15, 20, 25],
  [5, 0, 7, 10, 15, 20],
  [10, 7, 0, 5, 12, 18],
  [15, 10, 5, 0, 10, 15],
  [20, 15, 12, 10, 0, 8],
  [25, 20, 18, 15, 8, 0],
];

type HeapEntry = [distance: number, node: number];

function comesBefore(a: HeapEntry, b: HeapEntry): boolean {
  return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
}

function heapPush(heap: HeapEntry[], entry: HeapEntry): void {
  heap.push(entry);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (!comesBefore(heap[index], heap[parent])) break;
    [heap[index], heap[parent]] = [heap[parent], heap[index]];
    index = parent;
  }
}

function heapPop(heap: HeapEntry[]): HeapEntry {
  if (!heap.length) throw new Error("El heap está vacío");
  const first = heap[0];
  const last = heap.pop()!;
  if (heap.length) {
    heap[0] = last;
    let index = 0;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      if (left < heap.length && comesBefore(heap[left], heap[smallest])) smallest = left;
      if (right < heap.length && comesBefore(heap[right], heap[smallest])) smallest = right;
      if (smallest === index) break;
      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      index = smallest;
    }
  }
  return first;
}

export function findNearestNode(
  distances: DistanceMatrix,
  startNode: number,
  candidateNodes: number[],
): [nearestNode: number, nearestDistance: number] {
  const heap: HeapEntry[] = [];
  for (const node of candidateNodes) {
    heapPush(heap, [distances[startNode][node], node]);
  }
  const [nearestDistance, nearestNode] = heapPop(heap);
  return [nearestNode, nearestDistance];
}

export function nearestNeighborPath(
  distances: DistanceMatrix,
  nodeStart: number,
  extendedNodes: number[],
): RouteResult {
  const remainingNodes = [...extendedNodes];
  const startIndex = remainingNodes.indexOf(nodeStart);
  if (startIndex >= 0) remainingNodes.splice(startIndex, 1);

  let node = nodeStart;
  const visitedNodes = [nodeStart];
  let accumulatedCost = 0;

  while (remainingNodes.length) {
    const [nearestNode, nearestDistance] = findNearestNode(distances, node, remainingNodes);
    remainingNodes.splice(remainingNodes.indexOf(nearestNode), 1);
    node = nearestNode;
    visitedNodes.push(nearestNode);
    accumulatedCost += nearestDistance;
  }

  return { path: visitedNodes, cost: accumulatedCost };
}

