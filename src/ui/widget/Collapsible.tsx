import _ from "lodash";
import React, { CSSProperties } from "react";
interface Prop {
	/** 单测需要用到的属性 */
	name: string;
	/** 是否展开状态 */
	open: boolean;
	/** 动画时长，默认0.5秒，nil表示无动画效果 */
	ms?: number;
	/** Collapsible也能定义样式 */
	style?: CSSProperties;
	/** html元素id */
	id?:string;
}

interface State {
	css: CSSProperties,
	
	// 为了让getDerivedStateFromProps能读到this，把this放在state里
	self?: Collapsible
}

/**
 * 可以折叠的元素，折叠时可带动画效果
 * 
 * 以下几点帮助理解这个组件：
 * 1. 初始元素隐藏时，需要隐藏又不能占用空间，否则无法获取其高度，用position="absolute"让其脱离文档流来实现
 * 2. 折叠效果通过max-height来实现
 * 3. 用state来控制元素的css，state可能由props变化和定时器自己触发，所以要用getDerivedStateFromProps
 */
export class Collapsible extends React.Component<Prop, State> {
	div:HTMLDivElement;
	height: number;
	action: any;
	
	/** props.style去掉margin。如果不去掉，隐藏后margin会占用空间出来 */ 
	closeStyle: CSSProperties

	constructor(p: Prop){
		super(p);

		// 这段根据props创造一个初始的state
		let st = Collapsible.genNextState(this, this.props.open, false);
		if(!this.props.open){ // 初始折叠的话，不能占用空间，又有实际大小供componentDidMount读取。
			st.css.position = "absolute"
			st.css.display = this.props.style.display;
			delete st.css.maxHeight;
		}
		st.self = this;
		this.state = st;

		this.closeStyle = {};
		for(let k of Object.keys(this.props.style)){
			if(k.indexOf("margin") != 0){
				this.closeStyle[k] = this.props.style[k];
			}
		}
	}

	componentDidMount(){ // dom初次加载时记录元素高度，假如起始状态是隐藏的，这个高度动画会用得上
		if(!this.height) {
			this.height = this.div.offsetHeight;
		}
	}

	/**
	 * 产生state对象
	 * @param self 
	 * @param open 是否展开
	 * @param changing 是否是切换中
	 * @returns 新的state对象
	 */
	static genNextState(self: Collapsible, open:boolean, changing:boolean): State {
		const  transition = self.props.ms ? 'all ' + self.props.ms + 'ms' : undefined;

		if(open) {
			return { css: {
				...self.props.style,
				maxHeight: changing ? self.height + "px" :  undefined,
				visibility: "visible",
				opacity: "1",
				transition
			} }
		} else {
			const r: State = { css: {
				... self.closeStyle,
				maxHeight: "0px",
				visibility: "hidden",
				opacity: "0",
				transition
			} }

			if(!changing) {
				r.css.display = "none";
			}
			return r;
		}
	}

	/** Collapsible的state既可以被props影响，也可能自发（延时）改变 */
	static getDerivedStateFromProps(nextProps:Prop, prevState:State): State {
		const self = prevState.self;

		 // open状态不变，直接返回。这个判断是要的，否则初始隐藏的元素高度获得不了，因为下面的代码会把maxHeight设置为0
		if(self.state.css.visibility == "hidden" && !nextProps.open || self.state.css.visibility == "visible" && nextProps.open){
			return null;
		}

		if(_.isNil(nextProps.ms)) { // 没有动画
			return Collapsible.genNextState(self, nextProps.open, false);
		}

		let nextState = null;

		if(prevState.css.visibility === "visible" && !nextProps.open) { // 折叠
			// 折叠前，重新获取元素高度，虽然componentDidMount里记录过，但渲染过以后，万一元素高度又变了呢？
			const heightNow = prevState.self.div.offsetHeight;
		
			nextState = Collapsible.genNextState(self, true, true); // maxHeight设置为元素被折叠前的高度，以启动动画

			clearTimeout(self.action)
			self.action = setTimeout(()=>{
				self.setState(Collapsible.genNextState(self, false, true)); // maxHeight设置为0，以完成动画

				self.action =setTimeout(()=>{
					self.setState(Collapsible.genNextState(self, false, false)); // 去掉maxHeight，这样元素高度仍然是可变的
				}, self.props.ms)
			})
			
			// 计入height，展开时用
			self.height = _.max([heightNow, self.height]);
		} else if(prevState.css.visibility === "hidden" && nextProps.open) { // 展开
			// 原来没有maxHeight，需要给个初始的，等下再改掉。因为maxHeight必须有变化，才能触发动画
			nextState = Collapsible.genNextState(self, false, true); // maxHeight设置为0，以启动动画

			clearTimeout(self.action)
			self.action = setTimeout(()=>{
				self.setState(Collapsible.genNextState(self, true, true)); // maxHeight设置为折叠前的高度，以完成动画

				self.action = setTimeout(()=>{
					self.setState(Collapsible.genNextState(self, true, false)); // 去掉maxHeight/display，这样元素高度仍然是可变的
				}, self.props.ms)
			})
		}
		// else { // 状态不变，不用动
		// }
		return nextState;
	}

  render(){
		// @ts-ignore
		return <div id={this.props.id} name={this.props.name} ref={d => {this.div = d}} style={this.state.css}>
			{this.props.children}
		</div>
  }
}
