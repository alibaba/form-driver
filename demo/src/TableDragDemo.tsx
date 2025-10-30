import React, { useState } from "react";
import { Card, Space, Typography, Switch } from "antd";
import EnhancedSortDrag, {
  DragItem,
} from "../../src/ui/widget/EnhancedSortDrag";

const { Title, Text } = Typography;

/**
 * 原生Table拖拽组件使用示例
 */
const TableDragDemo: React.FC = () => {
  const [tableData, setTableData] = useState([
    {
      id: "row-1",
      name: "张三",
      age: 25,
      address: "北京市朝阳区",
      department: "技术部",
      position: "前端工程师",
    },
    {
      id: "row-2",
      name: "李四",
      age: 30,
      address: "上海市浦东新区",
      department: "产品部",
      position: "产品经理",
    },
    {
      id: "row-3",
      name: "王五",
      age: 28,
      address: "深圳市南山区",
      department: "设计部",
      position: "UI设计师",
    },
    {
      id: "row-4",
      name: "赵六",
      age: 32,
      address: "广州市天河区",
      department: "市场部",
      position: "市场专员",
    },
    {
      id: "row-5",
      name: "钱七",
      age: 27,
      address: "杭州市西湖区",
      department: "运营部",
      position: "运营经理",
    },
  ]);

  const [enableAnimation, setEnableAnimation] = useState(true);

  // 处理拖拽后的数据变化
  const handleDragChange = (newItems: DragItem[]) => {
    // 根据拖拽后的新顺序，重新排列原始表格数据
    const newData = newItems.map((item) => {
      // 从原始数据中找到对应的行数据
      const originalRow = tableData.find((row) => row.id === item.id);
      // 正常情况下一定能找到对应的行数据，因为我们是基于原始数据创建的拖拽项
      return { ...originalRow! }; // 使用 ! 断言，因为我们确信能找到匹配项
    });

    setTableData(newData);
  };

  const handleDragFail = (error: any) => {
    console.error("拖拽操作失败:", error);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, width: 600, margin: "0 auto" }}>
      <Card title="原生Table拖拽组件演示">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={4}>组件特性</Title>
            <Text>- 支持原生HTML table行拖拽排序</Text>
            <br />
            <Text>- 保留原有表格样式和功能</Text>
            <br />
            <Text>- 完整类型定义：TypeScript 支持，类型安全</Text>
            <br />
            <Text>- 错误处理：完善的验证机制和错误回调</Text>
            <br />
            <Text>- 动画效果：支持拖拽动画和视觉反馈</Text>
          </div>

          <div>
            <Title level={5}>配置选项</Title>
            <Space>
              <Switch checked={enableAnimation} onChange={setEnableAnimation} />
              <Text>启用动画效果</Text>
            </Space>
          </div>

          <div style={{ marginTop: 24 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #f0f0f0",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#fafafa" }}>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "center",
                      borderBottom: "1px solid #f0f0f0",
                      width: "40px",
                    }}
                  >
                    拖拽
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    姓名
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    年龄
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    地址
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    部门
                  </th>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    职位
                  </th>
                </tr>
              </thead>
              <tbody>
                <EnhancedSortDrag
                  items={tableData.map((row, index) => ({
                    id: row.id,
                    cpn: (
                      <>
                        <td>{row.name}</td>
                        <td>{row.age}</td>
                        <td>{row.address}</td>
                        <td>{row.department}</td>
                        <td>{row.position}</td>
                      </>
                    ),
                    isChecked: true,
                    label: `${row.name}(${row.position})`,
                    checkedIndex: index,
                  }))}
                  onChange={handleDragChange}
                  enableAnimation={enableAnimation}
                  isTableRow={true}
                  onDragFail={handleDragFail}
                />
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 24 }}>
            <Title level={5}>当前数据顺序</Title>
            <pre
              style={{ background: "#f5f5f5", padding: 16, borderRadius: 4 }}
            >
              {JSON.stringify(
                tableData.map((row, index) => ({
                  order: index + 1,
                  name: row.name,
                  position: row.position,
                })),
                null,
                2
              )}
            </pre>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TableDragDemo;
