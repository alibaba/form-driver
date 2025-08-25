import React, { memo, useRef, useEffect, useState, ReactNode } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Button } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import clsx from "clsx";

import "./SortDrag.less";

type SortDragProps = {
  changeOriginDataSource: (value: any) => void;
  sortList: Array<{
    cpn: ReactNode;
    id: string;
    isChecked: boolean;
    label: string;
    checkedIndex: number;
  }>;
};

const SortDrag: React.FC<SortDragProps> = memo((props) => {
  const { sortList, changeOriginDataSource } = props;
  const [items, setItems] = useState<SortDragProps["sortList"]>([]);

  // 记录当前拖拽的 item id
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // 记录当前 hover 的 Id
  const [droppingId, setDroppingId] = useState<string | null>(null);
  // refs 用于绑定每个 item 的 DOM
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // 修改：为每个 item 单独管理 dragHandle ref
  const dragHandleRefs = useRef<Record<string, HTMLSpanElement | null>>({});

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
          dragHandle: dragHandleRefs.current[item.id],
          canDrag: () => item.isChecked,
          getInitialData: () => ({
            id: item.id,
            index: idx,
            label: item.label,
          }),
          onDragStart: () => setDraggingId(item.id),
          onDrop: () => setDraggingId(null),
        })
      );
      // 注册为 drop target
      cleanups.push(
        dropTargetForElements({
          element: el,
          canDrop: () => item.isChecked,
          onDragEnter: (args) => {
            const fromIdx = items.findIndex(
              (i) => i.id === args.source.data.id
            );
            if (fromIdx === idx) return;
            console.log("当前hover元素", item.id);
            console.log("当前拖拽元素", args);
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
            console.log("排序之后的数据", newItems);
            setItems(newItems);

            changeOriginDataSource(newItems);
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

  useEffect(() => {
    const checkedItems = sortList
      .filter((item) => item.isChecked)
      .sort((a, b) => a.checkedIndex - b.checkedIndex);
    const unCheckedItems = sortList.filter((item) => !item.isChecked);
    console.log("DRAG: 排序之后实际展示的数据", {
      sortList,
      checkedItems,
      unCheckedItems,
    });
    setItems([...checkedItems, ...unCheckedItems]);
  }, [sortList]);

  return (
    <div className="sortDrag">
      {items.map((item, index) => {
        const itemClass = clsx("dragItem", {
          dragging: draggingId === item.id,
          dropping: droppingId === item.id,
        });

        return (
          <div
            className={itemClass}
            ref={(el) => (itemRefs.current[item.id] = el)}
            key={item.id}
          >
            <div className="dragBody">{item.cpn}</div>
            <div>
              {item.isChecked ? (
                <HolderOutlined
                  ref={(el) => (dragHandleRefs.current[item.id] = el)}
                  style={{ cursor: "grab", marginLeft: "8px" }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default SortDrag;
