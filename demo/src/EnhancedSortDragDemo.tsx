import React, { useState } from "react";
import { Card, Space, Typography, Switch, Radio } from "antd";
import EnhancedSortDrag, {
  DragItem,
} from "../../src/ui/widget/EnhancedSortDrag";

const { Title, Text } = Typography;

/**
 * 增强版拖拽组件使用示例
 */
const EnhancedSortDragDemo: React.FC = () => {
  const [items, setItems] = useState<DragItem[]>([
    {
      id: "item-1",
      cpn: <Text>第一个可拖拽项目</Text>,
      isChecked: true,
      label: "项目1",
      checkedIndex: 0,
    },
    {
      id: "item-2",
      cpn: <Text>第二个可拖拽项目</Text>,
      isChecked: true,
      label: "项目2",
      checkedIndex: 1,
    },
    {
      id: "item-3",
      cpn: <Text>第三个可拖拽项目</Text>,
      isChecked: true,
      label: "项目3",
      checkedIndex: 2,
    },
    {
      id: "item-4",
      cpn: <Text>第四个可拖拽项目</Text>,
      isChecked: true,
      label: "项目4",
      checkedIndex: 3,
    },
  ]);

  const [enableAnimation, setEnableAnimation] = useState(true);
  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    "vertical"
  );

  const handleDragFail = (error: any) => {
    console.error("拖拽操作失败:", error);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Card title="增强版通用拖拽组件演示">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={4}>组件特性</Title>
            <Text>- 性能优化：使用 Map 替代对象，避免重复注册监听器</Text>
            <br />
            <Text>- 完整类型定义：TypeScript 支持，类型安全</Text>
            <br />
            <Text>- 错误处理：完善的验证机制和错误回调</Text>
            <br />
            <Text>- 动画效果：支持拖拽动画和视觉反馈</Text>
            <br />
            <Text>- 扩展功能：支持水平和垂直方向，自定义拖拽句柄</Text>
          </div>

          <div>
            <Title level={5}>配置选项</Title>
            <Space>
              <Switch checked={enableAnimation} onChange={setEnableAnimation} />
              <Text>启用动画效果</Text>
            </Space>
            <br />
            <Space>
              <Radio.Group
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <Radio value="vertical">垂直拖拽</Radio>
                <Radio value="horizontal">水平拖拽</Radio>
              </Radio.Group>
            </Space>
          </div>

          <div style={{ marginTop: 24 }}>
            <EnhancedSortDrag
              items={items}
              onChange={setItems}
              enableAnimation={enableAnimation}
              direction={direction}
              onDragFail={handleDragFail}
              renderDragHandle={(item, isDragging) => (
                <span
                  style={{
                    cursor: isDragging ? "grabbing" : "grab",
                    padding: "4px 8px",
                    background: isDragging ? "#1890ff" : "#f0f0f0",
                    borderRadius: 4,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isDragging ? "拖拽中..." : "拖拽"}
                </span>
              )}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <Title level={5}>当前数据顺序</Title>
            <Space direction="vertical">
              {items.map((item, index) => (
                <Text key={item.id}>
                  {index + 1}. {item.label}
                </Text>
              ))}
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default EnhancedSortDragDemo;
