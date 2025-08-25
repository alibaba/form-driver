import React, { ReactNode } from "react";
import { Checkbox, CheckboxProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckOutlined } from "@ant-design/icons";
import "./DIYCheckbox.less";

export interface DIYCheckboxProps extends Omit<CheckboxProps, "children"> {
  /** 自定义选中时的图标 */
  checkedIcon?: ReactNode;
  /** 自定义未选中时的图标 */
  uncheckedIcon?: ReactNode;
  /** 自定义半选中时的图标 */
  indeterminateIcon?: ReactNode;
  /** 子元素内容 */
  children?: ReactNode;
  /** 图标大小 */
  iconSize?: number;
  /** 图标颜色 */
  iconColor?: string;
}

const DIYCheckbox: React.FC<DIYCheckboxProps> = ({
  checkedIcon = <CheckOutlined />,
  uncheckedIcon,
  indeterminateIcon,
  children,
  iconSize = 16,
  iconColor = "#fff",
  className = "",
  style = {},
  checked,
  indeterminate,
  disabled,
  ...restProps
}) => {
  // 根据状态决定显示的图标
  const getCurrentIcon = () => {
    if (indeterminate && indeterminateIcon) {
      return indeterminateIcon;
    }
    if (checked && checkedIcon) {
      return checkedIcon;
    }
    if (!checked && uncheckedIcon) {
      return uncheckedIcon;
    }
    return null;
  };

  const currentIcon = getCurrentIcon();

  // 如果没有自定义图标，使用默认的 Checkbox
  if (!currentIcon) {
    return (
      <Checkbox
        className={className}
        style={style}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        {...restProps}
      >
        {children}
      </Checkbox>
    );
  }

  // 处理点击事件，确保正确的状态传递
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;

    // 阻止事件冒泡到隐藏的 input
    e.preventDefault();
    e.stopPropagation();

    // 如果有 onChange 回调，则调用它并传递正确的 checked 状态
    if (restProps.onChange) {
      const checkboxEvent: CheckboxChangeEvent = {
        target: {
          checked: !checked,
        },
        stopPropagation: () => {},
        preventDefault: () => {},
        nativeEvent: e.nativeEvent,
      };
      restProps.onChange(checkboxEvent);
    }
  };

  // 处理键盘事件，支持空格键和回车键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick(e as any);
    }
  };

  // 自定义图标的样式
  const iconStyle: React.CSSProperties = {
    fontSize: iconSize,
    color: disabled ? "#d9d9d9" : iconColor,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s",
  };

  const wrapperStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  return (
    <label
      className={`diy-checkbox-wrapper ${className}`}
      style={wrapperStyle}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-disabled={disabled}
    >
      <span
        className={`diy-checkbox-icon ${checked ? "checked" : ""} ${
          indeterminate ? "indeterminate" : ""
        }`}
        style={iconStyle}
        aria-hidden="true"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {currentIcon}
      </span>
      {children && (
        <span className="diy-checkbox-label" style={{ marginLeft: 8 }}>
          {children}
        </span>
      )}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={() => {}} // 防止 React 警告
        tabIndex={-1} // 避免键盘焦点
        aria-hidden="true"
      />
    </label>
  );
};

export default DIYCheckbox;
