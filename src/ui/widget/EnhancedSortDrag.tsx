import React, {
  memo,
  useRef,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Button } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import clsx from "clsx";

import "./EnhancedSortDrag.less";

/**
 * 拖拽项数据类型定义
 */
export interface DragItem {
  id: string;
  cpn: ReactNode;
  isChecked: boolean;
  label: string;
  checkedIndex: number;
}

/**
 * 拖拽组件属性定义
 */
export interface EnhancedSortDragProps {
  /** 拖拽项列表 */
  items: DragItem[];
  /** 数据变化回调 */
  onChange: (newItems: DragItem[]) => void;
  /** 是否启用动画效果，默认开启 */
  enableAnimation?: boolean;
  /** 是否支持跨容器拖拽，默认关闭 */
  enableCrossContainer?: boolean;
  /** 拖拽方向，默认垂直 */
  direction?: "vertical" | "horizontal";
  /** 拖拽失败回调 */
  onDragFail?: (error: DragError) => void;
  /** 自定义拖拽句柄渲染 */
  renderDragHandle?: (item: DragItem, isDragging: boolean) => ReactNode;
  /** 拖拽预览内容 */
  renderDragPreview?: (item: DragItem) => ReactNode;
  /** 是否为表格行模式 */
  isTableRow?: boolean;
}

/**
 * 拖拽错误类型定义
 */
export interface DragError {
  type: "VALIDATION_ERROR" | "DATA_ERROR" | "SYSTEM_ERROR";
  message: string;
  itemId?: string;
  sourceId?: string;
  targetId?: string;
}

/**
 * 拖拽状态类型定义
 */
export interface DragState {
  draggingId: string | null;
  droppingId: string | null;
  isAnimating: boolean;
}

/**
 * 拖拽验证结果
 */
interface ValidationResult {
  isValid: boolean;
  error?: DragError;
}

/**
 * 增强版通用拖拽排序组件
 * 解决原组件的性能问题和功能局限性
 */
const EnhancedSortDrag: React.FC<EnhancedSortDragProps> = memo((props) => {
  const {
    items,
    onChange,
    enableAnimation = true,
    enableCrossContainer = false,
    direction = "vertical",
    onDragFail,
    renderDragHandle,
    renderDragPreview,
    isTableRow = false,
  } = props;

  // 使用 useRef 缓存 items 避免不必要的重渲染
  const itemsRef = useRef<DragItem[]>(items);
  itemsRef.current = items;

  // 拖拽状态管理
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    droppingId: null,
    isAnimating: false,
  });

  // 使用 Map 替代对象，提高查找性能
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const dragHandleRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  // 清理函数缓存，避免重复注册
  const cleanupRefs = useRef<Map<string, () => void>>(new Map());

  /**
   * 验证拖拽操作是否有效
   */
  const validateDragOperation = useCallback(
    (
      sourceId: string,
      targetId: string,
      items: DragItem[]
    ): ValidationResult => {
      // 检查源项目是否存在
      const sourceItem = items.find((item) => item.id === sourceId);
      if (!sourceItem) {
        return {
          isValid: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "源项目不存在",
            sourceId,
          },
        };
      }

      // 检查目标项目是否存在
      const targetItem = items.find((item) => item.id === targetId);
      if (!targetItem) {
        return {
          isValid: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "目标项目不存在",
            targetId,
          },
        };
      }

      // 检查是否允许拖拽
      if (!sourceItem.isChecked) {
        return {
          isValid: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "源项目不允许拖拽",
            sourceId,
          },
        };
      }

      // 检查是否允许放置
      if (!targetItem.isChecked) {
        return {
          isValid: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "目标位置不允许放置",
            targetId,
          },
        };
      }

      // 检查是否为同一项目
      if (sourceId === targetId) {
        return {
          isValid: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "不能拖拽到自身位置",
            sourceId,
            targetId,
          },
        };
      }

      return {
        isValid: true,
      };
    },
    []
  );

  /**
   * 交换数据逻辑 - 核心拖拽算法
   */
  const swapItems = useCallback(
    (fromId: string, toId: string) => {
      try {
        const currentItems = [...itemsRef.current];

        // 验证拖拽操作
        const validation = validateDragOperation(fromId, toId, currentItems);
        if (!validation.isValid) {
          throw new Error(validation.error?.message || "拖拽验证失败");
        }

        const fromIndex = currentItems.findIndex((item) => item.id === fromId);
        const toIndex = currentItems.findIndex((item) => item.id === toId);

        // 边界条件检查
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return;
        }

        const [moved] = currentItems.splice(fromIndex, 1);
        currentItems.splice(toIndex, 0, moved);

        // 更新引用
        itemsRef.current = currentItems;

        // 触发回调
        onChange(currentItems);
      } catch (error) {
        console.error("拖拽交换数据失败:", error);

        // 触发错误回调
        const dragError: DragError = {
          type: "DATA_ERROR",
          message: error instanceof Error ? error.message : "未知错误",
          sourceId: fromId,
          targetId: toId,
        };

        onDragFail?.(dragError);
      }
    },
    [onChange, onDragFail, validateDragOperation]
  );

  /**
   * 注册单个项目的拖拽监听器
   */
  const registerDragListeners = useCallback(
    (item: DragItem, index: number) => {
      const el = itemRefs.current.get(item.id);
      const dragHandle = dragHandleRefs.current.get(item.id);

      if (!el) return;

      // 清理之前的监听器
      const existingCleanup = cleanupRefs.current.get(item.id);
      if (existingCleanup) {
        existingCleanup();
      }

      const cleanups: (() => void)[] = [];

      // 注册为可拖拽元素
      cleanups.push(
        draggable({
          element: el,
          dragHandle: dragHandle,
          canDrag: () => item.isChecked,
          getInitialData: () => ({
            id: item.id,
            index,
            label: item.label,
          }),
          onDragStart: () => {
            setDragState((prev) => ({
              ...prev,
              draggingId: item.id,
              isAnimating: !!enableAnimation,
            }));
            console.log("开始拖拽:", item.label);
          },
          onDrop: () => {
            setDragState((prev) => ({
              ...prev,
              draggingId: null,
              droppingId: null,
              isAnimating: false,
            }));
          },
        })
      );

      // 注册为拖拽目标
      cleanups.push(
        dropTargetForElements({
          element: el,
          canDrop: () => item.isChecked,
          onDragEnter: (args) => {
            const sourceId = args.source.data.id as string;
            if (sourceId === item.id) return;

            console.log("拖拽进入:", item.id);
            setDragState((prev) => ({
              ...prev,
              droppingId: item.id,
            }));
          },
          onDragLeave: () => {
            setDragState((prev) => ({
              ...prev,
              droppingId: null,
            }));
          },
          onDrop: ({ source }) => {
            if (!source) return;
            const sourceId = source.data.id as string;
            if (sourceId === item.id) return;

            // 执行数据交换
            swapItems(sourceId, item.id);
          },
        })
      );

      // 存储清理函数
      const combinedCleanup = () => {
        cleanups.forEach((fn) => fn());
      };
      cleanupRefs.current.set(item.id, combinedCleanup);
    },
    [swapItems, enableAnimation]
  );

  /**
   * 性能优化：只在必要的时候注册监听器
   */
  useEffect(() => {
    // 清理所有旧的监听器
    cleanupRefs.current.forEach((cleanup) => cleanup());
    cleanupRefs.current.clear();

    // 注册所有项目的监听器
    items.forEach((item, index) => {
      registerDragListeners(item, index);
    });

    // 监听全局拖拽结束
    const monitorCleanup = monitorForElements({
      onDrop: () => {
        setDragState((prev) => ({
          ...prev,
          draggingId: null,
          droppingId: null,
          isAnimating: false,
        }));
      },
    });
    cleanupRefs.current.set("monitor", monitorCleanup);

    return () => {
      cleanupRefs.current.forEach((cleanup) => cleanup());
      cleanupRefs.current.clear();
    };
  }, [items.length, registerDragListeners]); // 只在列表长度变化时重新注册

  /**
   * 渲染默认拖拽句柄
   */
  const renderDefaultDragHandle = useCallback(
    (item: DragItem, isDragging: boolean) => (
      <HolderOutlined
        ref={(el) => {
          if (el) {
            dragHandleRefs.current.set(item.id, el);
          }
        }}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          marginLeft: "8px",
          opacity: isDragging ? 0.5 : 1,
          transition: enableAnimation ? "opacity 0.2s" : "none",
        }}
      />
    ),
    [enableAnimation]
  );

  /**
   * 渲染拖拽项
   */
  const renderDragItem = useCallback(
    (item: DragItem, index: number) => {
      const isDragging = dragState.draggingId === item.id;
      const isDropping = dragState.droppingId === item.id;

      // 如果是表格行模式，直接返回组件内容
      if (isTableRow) {
        console.log("表格行数据", item);
        return (
          <tr
            ref={(el) => {
              if (el) {
                itemRefs.current.set(item.id, el as unknown as HTMLDivElement);
              }
            }}
            key={item.id}
            data-drag-id={item.id}
            data-drag-index={index}
            style={{
              transition: enableAnimation ? "all 0.3s ease" : "none",
              opacity: isDragging ? 0.5 : 1,
              backgroundColor: isDropping ? "#e6f7ff" : "transparent",
            }}
          >
            {/* 如果提供了自定义拖拽句柄，则将其作为第一列 */}
            {renderDragHandle && renderDragHandle(item, isDragging)}
            {!renderDragHandle && (
              <td
                ref={(el) => {
                  if (el) {
                    dragHandleRefs.current.set(
                      item.id,
                      el as unknown as HTMLSpanElement
                    );
                  }
                }}
                style={{
                  cursor: isDragging ? "grabbing" : "grab",
                  textAlign: "center",
                  width: "40px",
                }}
              >
                <HolderOutlined
                  style={{
                    opacity: isDragging ? 0.5 : 1,
                    transition: enableAnimation ? "opacity 0.2s" : "none",
                  }}
                />
              </td>
            )}
            {item.cpn}
          </tr>
        );
      }

      const itemClass = clsx("enhanced-dragItem", {
        dragging: isDragging,
        dropping: isDropping,
        disabled: !item.isChecked,
        [`direction-${direction}`]: true,
      });

      return (
        <div
          className={itemClass}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(item.id, el);
            }
          }}
          key={item.id}
          data-drag-id={item.id}
          data-drag-index={index}
          style={{
            transition: enableAnimation ? "all 0.3s ease" : "none",
          }}
        >
          <div className="enhanced-dragBody">{item.cpn}</div>
          <div className="enhanced-dragHandle">
            {item.isChecked &&
              (renderDragHandle
                ? renderDragHandle(item, isDragging)
                : renderDefaultDragHandle(item, isDragging))}
          </div>
        </div>
      );
    },
    [
      dragState,
      direction,
      enableAnimation,
      renderDragHandle,
      renderDefaultDragHandle,
      isTableRow,
    ]
  );

  // 如果是表格行模式，直接渲染子元素而不是包装div
  if (isTableRow) {
    return <>{items.map(renderDragItem)}</>;
  }

  return (
    <div className={`enhanced-sortDrag direction-${direction}`}>
      {items.map(renderDragItem)}
    </div>
  );
});

export default EnhancedSortDrag;
