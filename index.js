import React, { Component } from 'react';
import { PanResponder,Animated, Easing, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const windowSize = Dimensions.get('window');
const RESTORE_ANIMATION_DURATION = 200;

class RNBottomSheet extends Component {
	static defaultProps = {
		initialY: windowSize.height/2,
		isDismissable: true,
		disableDragUp: false
	}

	static propTypes = {
		initialY: PropTypes.number,
		onDismiss: PropTypes.func,
		onTopReached: PropTypes.func,
		isDismissable: PropTypes.bool,
		disableSlider: PropTypes.bool,
		initialRenderTime: PropTypes.number,
		disableDragUp: PropTypes.bool
	};

	constructor(props){
		super(props);
		this.state = {
			translateY: new Animated.ValueXY({x: 0, y: windowSize.height}),
		};
		this._translateOrigin = this.props.initialY;
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (event, gestureState) => this.checkGesture(gestureState),
			onMoveShouldSetPanResponderCapture: (event, gestureState) => this.checkGesture(gestureState),
			onPanResponderMove: this._onGestureMove,
			onPanResponderRelease: this._onGestureRelease
		});
	}

	componentDidMount() {
		if(this.props.initialY) {
			Animated.timing(this.state.translateY.y, {
				toValue: this.props.initialY,
				duration: this.props.initialRenderTime || RESTORE_ANIMATION_DURATION,
				// useNativeDriver: true,
			}).start();
		}
	}
	checkGesture = ({ dy }) => {
		let dragUp = (!this.props.disableSlider || this._translateOrigin === this.props.initialY) && dy <= -30 && !this.props.disableDragUp;
		let dragDown = dy >= 30;
		return dragUp || dragDown;
	}

	_onGestureMove = (event, {stateID, dy}) => {
		this._gestureInProgress = stateID;
		if(this._translateOrigin === 0 && dy < 0 && !this.props.disableSlider) {
			// case when scroll got disabled to enable PanResponder but users tries to scroll again
			this.listRef && this.listRef.scrollToOffset({ offset: -dy, animated: true });
		} else {
			this.state.translateY.y.setValue(this._translateOrigin + dy);
		}
	}

	_onGestureRelease = (event, gestureState) => {
		if (this._gestureInProgress !== gestureState.stateID) {
			return;
		}
		let dragDown = gestureState.dy > 0;
		this._gestureInProgress = null;
		if(dragDown && gestureState.dy > this.props.initialY/2 && this.props.isDismissable) {
			this.dismiss();
		} else {
			Animated.timing(this.state.translateY.y, {
				toValue: dragDown ? !this.props.isDismissable ? this.props.initialY : this._translateOrigin : 0,
				duration: RESTORE_ANIMATION_DURATION,
				easing: Easing.ease,
				// useNativeDriver: true,
			}).start(() => {
				requestAnimationFrame(() => {
					this._translateOrigin = dragDown ? !this.props.isDismissable ? this.props.initialY : this._translateOrigin : 0;
					if(!dragDown) { this.props.onTopReached && this.props.onTopReached(); }
				});
			});
		}
	}

	dismiss = () => {
		Animated.timing(this.state.translateY.y, {
			toValue: windowSize.height,
			duration: RESTORE_ANIMATION_DURATION,
			easing: Easing.ease,
			// useNativeDriver: true,
		}).start(() => {
			requestAnimationFrame(() => {
				this.props.onDismiss && this.props.onDismiss();
			});
		});
	}

	render() {
		const {translateY} = this.state;
		return (
			<Animated.View
				{...this._panResponder.panHandlers}
				style={[this.props.style,{transform: [{ translateY: translateY.y }] }]}>
				{this.props.children}
			</Animated.View>
		);
	}
}

export default RNBottomSheet;
