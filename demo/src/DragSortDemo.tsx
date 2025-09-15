import React, { useRef, useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

// 列表项类型定义
interface Item {
  id: string;
  content: string;
}

const initialItems: Item[] = [
  { id: "item-1", content: "列表项 1" },
  { id: "item-2", content: "列表项 2" },
  { id: "item-3", content: "列表项 3" },
  { id: "item-4", content: "列表项 4" },
];

const DragSortDemo: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  // 记录当前拖拽的 item id
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // 记录当前 hover 的 Id
  const [droppingId, setDroppingId] = useState<string | null>(null);
  // refs 用于绑定每个 item 的 DOM
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    console.log("droppingId", droppingId);
  }, [draggingId]);

  // 注册拖拽和 drop target
  useEffect(() => {
    // 清理函数集合
    const cleanups: (() => void)[] = [];
    items.forEach((item, idx) => {
      const el = itemRefs.current[item.id];
      if (!el) return;
      // 注册为 draggable
      cleanups.push(
        draggable({
          element: el,
          getInitialData: () => ({ id: item.id, index: idx }),
          onDragStart: () => setDraggingId(item.id),
          onDrop: () => setDraggingId(null),
        })
      );
      // 注册为 drop target
      cleanups.push(
        dropTargetForElements({
          element: el,
          onDragEnter: (args) => {
            console.log("当前hover元素", item.id);
            // console.log("当前拖拽元素", args);
            setDroppingId(item.id);
          },
          onDragLeave: () => {
            setDroppingId(null);
          },
          onDrop: ({ source }) => {
            // console.log("当前拖拽元素", source);
            if (!source) return;
            const fromIdx = items.findIndex((i) => i.id === source.data.id);
            const toIdx = idx;
            if (fromIdx === -1 || fromIdx === toIdx) return;
            const newItems = [...items];
            const [moved] = newItems.splice(fromIdx, 1);
            newItems.splice(toIdx, 0, moved);
            setItems(newItems);
            setDroppingId(null);
          },
        })
      );
    });
    // 监听全局拖拽，拖拽结束时清理 draggingId
    const monitorCleanup = monitorForElements({
      onDrop: () => setDraggingId(null),
    });
    cleanups.push(monitorCleanup);
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [items]);

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h3>拖拽排序 Demo（Pragmatic Drag and Drop 原生实现）</h3>
      <div
        style={{
          background: "#fafafa",
          padding: 16,
          borderRadius: 8,
          minHeight: 120,
          boxShadow: "0 1px 4px #00000010",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => (itemRefs.current[item.id] = el)}
            style={{
              userSelect: "none",
              padding: "12px 16px",
              margin: "0 0 8px 0",
              background:
                draggingId === item.id
                  ? "#bae7ff"
                  : droppingId === item.id
                  ? "#f8f8"
                  : "#fff",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              boxShadow:
                draggingId === item.id
                  ? "0 2px 8px #1890ff33"
                  : "0 1px 2px #00000008",
              fontSize: 16,
              transition: "background 0.2s, box-shadow 0.2s",
              cursor: "grab",
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
      <div style={{ color: "#888", fontSize: 13, marginTop: 16 }}>
        使用 @atlaskit/pragmatic-drag-and-drop/element/adapter 实现，无高阶
        React 组件依赖。
      </div>
    </div>
  );
};

export default DragSortDemo;
